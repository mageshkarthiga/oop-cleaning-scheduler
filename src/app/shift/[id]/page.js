"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap
} from '@vis.gl/react-google-maps';

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

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className='container' style={{ width: '400px' }}>
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
    const [selectedImage, setSelectedImage] = useState(null); 
    const toast = useRef(null);

    useEffect(() => {
        async function fetchShiftData() {
            try {
                const response = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                const data = response.data;
                data.workerLocation = {
                    "locationId": 1,
                    "address": "88 Corporation Road",
                    "postalCode": "649823",
                    "unitNumber": "#11-25",
                    "latitude": 1.29908744640975,
                    "longitude": 103.881565630968,
                    "subzone": null
                };
                console.log(data)

                setOrigin(`${data.workerLocation.latitude},${data.workerLocation.longitude}`);
                setDestination(`${data.latitude},${data.longitude}`);
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

    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const startSession = async () => {
        if (!selectedImage) {
            toast.current.show({ severity: 'warn', summary: 'No Image Uploaded', detail: 'Please upload an image to start the shift.' });
            return;
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/start-shift/${id}`);
            console.log(response);
            if (response.status === 202 && response.data.success) {
                console.log('Session started successfully', response);
                setIsSessionStarted(true);
                setSelectedImage(null);
                toast.current.show({ severity: 'success', summary: 'Shift Started', detail: 'Shift has started successfully!' });
                const updatedResponse = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                setShift(updatedResponse.data);
            }
        } catch (error) {
            console.error("Error updating details:", error);
        }
    };


    const endSession = async () => {
        if (!selectedImage) {
            toast.current.show({ severity: 'warn', summary: 'No Image Uploaded', detail: 'Please upload an image to end the shift.' });
            return;
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/end-shift/${id}`);
            if (response.status === 202 && response.data.success) {
                console.log('Session ended successfully', response);
                setIsSessionStarted(false);
                setIsSessionFinished(true);
                setSelectedImage(null); 
                toast.current.show({ severity: 'success', summary: 'Shift Ended', detail: 'Shift has ended successfully!' });
                const updatedResponse = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                setShift(updatedResponse.data);
            }
        } catch (error) {
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
            <Toast ref={toast} />
            <Card title={`Details for Shift ${shift.shiftId || `Shift ${id}`}`} className="m-5 p-4">
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

                        <p className="font-semibold">Client Name:</p>
                        <p>{shift.clientName}</p> 

                        <p className="font-semibold mt-4">Client Phone Number:</p>
                        <a href={`tel:${shift.clientPhone}`} className="underline text-blue-400">{shift.clientPhone}</a>
    
                        <p className="font-semibold mt-4">Shift Address:</p>
                        <p>{shift.clientAddress}</p> 
    
                        <p className="font-semibold mt-4">Status:
                            <Tag value={shift.workingStatus.replace(/_/g, ' ')} severity={getSeverity(shift)} />
                        </p>
    
                        <div className='mt-4 mb-5'>
                            <h3 className="text-lg font-semibold">Shift Actions:</h3>
                            <div className='mt-4 mb-5'>
                                <h3 className="font-semibold">Upload Image:</h3>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="my-3 w-1/2 p-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    
                                />
                                <br/>
                                {!isSessionFinished && (
                                    isSessionStarted ? (
                                        <Button
                                            label="End Shift &nbsp;"
                                            icon="pi pi-times-circle"
                                            iconPos="right"
                                            severity="danger"
                                            onClick={endSession}
                                        />
                                    ) : (
                                        <Button
                                            label="Start Shift &nbsp;"
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
                    <div className='ml-4' style={{ flex: '0 0 600px' }}>
                        <Map
                            defaultCenter={{ lat: shift.workerLocation.latitude || 0, lng: shift.workerLocation.longitude || 0 }}
                            defaultZoom={9}
                            gestureHandling="greedy"
                            fullscreenControl={false}
                            style={{ width: '100%', height: '550px' }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    </APIProvider>
    
    );
}
