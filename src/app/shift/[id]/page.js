"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap
} from '@vis.gl/react-google-maps';
import { Tag } from 'primereact/tag';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMap = ({ origin, destination }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // Initialize directions service and renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    // Use directions service
    useEffect(() => {
        if (!directionsService || !directionsRenderer || !origin || !destination) return;

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: routesLibrary.TravelMode.TRANSIT,
            provideRouteAlternatives: true
        }).then(response => {
            console.log(response)
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        });

        return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer, origin, destination]);

    const openGoogleMaps = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
        window.open(googleMapsUrl, '_blank');
    };

    // Update direction route
    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className='container' style={{ width: '400px' }}>
            <h2>{selected.summary}</h2>
            <p><strong>Travel Duration:</strong> {leg.duration?.text}</p>
            <Button label="View Directions in Google Maps &nbsp;" icon="pi pi-map" onClick={openGoogleMaps} iconPos="right" size='small' outlined/>
        </div>
    );
};

export default function DetailsPage() {
    const { id } = useParams();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [shift, setShift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [isSessionFinished, setIsSessionFinished] = useState(false);

    // Fetch shift data from API
    useEffect(() => {
        async function fetchShiftData() {
            try {
                const response = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                const data = response.data;
                data.worker.homeLocation = {
                    "locationId": 1,
                    "address": "88 Corporation Road",
                    "postalCode": "649823",
                    "unitNumber": "#11-25",
                    "latitude": 1.29908744640975,
                    "longitude": 103.881565630968,
                    "subzone": null
                };
                const workerLocation = data.worker.homeLocation;
                const shiftLocation = data.location;
                console.log(data)

                // Update state with origin and destination
                setOrigin(`${workerLocation.latitude},${workerLocation.longitude}`);
                setDestination(`${shiftLocation.latitude},${shiftLocation.longitude}`);
                setShift(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shift data:', error);
                setError('Failed to load shift details. Please try again later.');
                setLoading(false);
            }
        }

        fetchShiftData();
    }, [id]);

    const startSession = async () => {
        try {
            const date = new Date();
            const currentDate = new Intl.DateTimeFormat('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(date).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
            const currentTime = date.toLocaleTimeString('en-SG', { hour12: false });
            const updatedShift = {
                ...shift,
                actualStartDate: currentDate,
                actualStartTime: currentTime,
                workingStatus: 'WORKING'
            };
            console.log(updatedShift);

            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/${id}`, updatedShift);
            if (response.status === 200) {
                console.log('Session started successfully', response);
                setIsSessionStarted(true);
                const updatedResponse = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                setShift(updatedResponse.data);
            }
        } catch (error) {
            console.error("Error updating details:", error);
        }
    };


    const endSession = async () => {
        try {
            const date = new Date();
            const currentDate = new Intl.DateTimeFormat('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(date).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'); 
            const currentTime = date.toLocaleTimeString('en-SG', { hour12: false });
            const updatedShift = {
                ...shift,
                actualEndDate: currentDate,
                actualEndTime: currentTime,
                workingStatus: 'FINISHED'
            };
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/${id}`, updatedShift);
            if (response.status === 200) {
                console.log('Session ended successfully', response);
                setIsSessionStarted(false);
                setIsSessionFinished(true);
                const updatedResponse = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                setShift(updatedResponse.data);
            }
        }
        catch (error) {
            console.error("Error updating details:", error);
        }
    };

    const getSeverity = (shift) => {
        switch (shift.workingStatus) {
            case 'NOT_STARTED':
                return 'danger';
            case 'WORKING':
                return 'warning';
            case 'FINISHED':
                return 'success';
            default:
                return null;
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!shift) return <div>No data found for ID {id}</div>;

    return (
        <APIProvider apiKey={API_KEY}>
        <div className="container m-auto p-4">
            <Card title={`Details for Shift ${shift.shiftId || `Shift ${id}`}`} className="m-5">
                <div className="flex">
                    {/* Column for details */}
                    <div className="flex-1">
                        <div className="flex flex-col mb-5">
                            <p className="font-semibold">Scheduled Shift Start:</p>
                            <p>{formatDate(shift.sessionStartDate)} at {shift.sessionStartTime}</p>
                        </div>
                        <div className="flex flex-col mb-5">
                            <p className="font-semibold">Scheduled Shift End:</p>
                            <p>{formatDate(shift.sessionEndDate)} at {shift.sessionEndTime}</p>
                        </div>
    
                        <p className="font-semibold">Shift Address:</p>
                        <p>{shift.location.address}</p>
    
                        <p className="font-semibold mt-4">Status:
                            <Tag value={shift.workingStatus.replace(/_/g, ' ')} severity={getSeverity(shift)} />
                        </p>
    
                        <div className='mt-4 mb-5'>
                            <h3 className="text-lg font-semibold">Shift Actions:</h3>
                            <div className="flex flex-col space-y-2 w-1/2 mb-5">
                                {!isSessionFinished && (
                                    isSessionStarted ? (
                                        <Button
                                            label="End Session"
                                            icon="pi pi-times-circle"
                                            iconPos="right"
                                            severity="danger"
                                            onClick={endSession}
                                        />
                                    ) : (
                                        <Button
                                            label="Start Session"
                                            icon="pi pi-check-circle"
                                            iconPos="right"
                                            severity="success"
                                            onClick={startSession}
                                        />
                                    )
                                )}
                            </div>
                            <GoogleMap origin={origin} destination={destination} />
                        </div>
                    </div>
    
                    {/* Column for the map */}
                    <div className='ml-4' style={{ flex: '0 0 450px' }}>
                        <Map
                            defaultCenter={{ lat: shift.worker.homeLocation.latitude || 0, lng: shift.worker.homeLocation.longitude || 0 }}
                            defaultZoom={9}
                            gestureHandling="greedy"
                            fullscreenControl={false}
                            style={{ width: '100%', height: '450px' }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    </APIProvider>
    
    );
}
