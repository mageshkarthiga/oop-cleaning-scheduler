'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import axios from 'axios';

export default function DetailsPage() {
    const { id } = useParams();
    const [shift, setShift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [isSessionFinished, setIsSessionFinished] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/v0.1/shift/${id}`)
                .then((response) => {
                    const fetchedData = response.data;
                    setShift(fetchedData);
                    setLoading(false);

                    if (fetchedData.workingStatus === 'WORKING') {
                        setIsSessionStarted(true);
                    } else if (fetchedData.workingStatus === 'FINISHED') {
                        setIsSessionFinished(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching details:", error);
                    setError('Failed to load shift details. Please try again later.');
                    setLoading(false);
                });
        }
    }, [id]);
    
    const startSession = async () => {
        try {
            const date = new Date();
            const updatedShift = {
                ...shift,
                actualStartDate: date.toISOString().split('T')[0],
                actualStartTime: date.toISOString().split('T')[1].split('.')[0],
                workingStatus: 'WORKING'
            };
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
    

    const endSession = async() => {
        try{
            const date = new Date();
            const updatedShift = {
                ...shift,
                actualEndDate: date.toISOString().split('T')[0],
                actualEndTime: date.toISOString().split('T')[1].split('.')[0],
                workingStatus: 'FINISHED'
            };
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/${id}`,updatedShift);
            if(response.status === 200) {
                console.log('Session ended successfully',response);
                setIsSessionStarted(false);
                setIsSessionFinished(true);
                const updatedResponse = await axios.get(`http://localhost:8080/api/v0.1/shift/${id}`);
                setShift(updatedResponse.data); 
            }
        }
        catch(error){
            console.error("Error updating details:", error);
        }
    };

    if (loading) return <ProgressSpinner />;
    if (error) return <div>Error: {error}</div>;
    if (!shift) return <div>No data found for ID {id}</div>;

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

    return (
        <div className="mt-4 m-auto">
            <Card title={`Details for ${shift.sessionDescription || `Session ${id}`}`} className="m-auto p-5">
                <p><strong>Start:</strong> {shift.sessionStartDate} at {shift.sessionStartTime}</p>
                <p><strong>End:</strong> {shift.sessionEndDate} at {shift.sessionEndTime}</p>
                <p><strong>Status: </strong>
                    <Tag value={shift.workingStatus.replace(/_/g, ' ')} severity={getSeverity(shift)} />
                </p>
                <br /><br />
                <div className='space-x-4'>
                    {!isSessionFinished && (
                        isSessionStarted ? (
                            <Button
                                label="End Session"
                                icon="pi pi-times-circle"
                                severity="danger"
                                rounded
                                onClick={endSession}
                            />
                        ) : (
                            <Button
                                label="Start Session"
                                icon="pi pi-check-circle"
                                severity="success"
                                rounded
                                onClick={startSession}
                            />
                        )
                    )}
                </div>
            </Card>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    zoom={10}
                    center={{ lat: shift.latitude || 1.284540, lng: shift.longitude || 103.852028 }}
                    style={{ width: '100%', height: '400px' }}
                >
                    <Marker position={{ lat: shift.latitude || 1.284540, lng: shift.longitude || 103.852028 }} />
                </Map>
            </APIProvider>
        </div>
    );
}
