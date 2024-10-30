'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function SessionDetails() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v0.1/cleaningSession`)
            .then((response) => {
                const fetchedData = response.data;
                const foundSession = fetchedData.find(cleaningSession => cleaningSession.cleaningSessionId.toString() === id);
                foundSession.planningStage = "EMBER"
                foundSession.workersBudgeted = 1;
                if (foundSession.planningStage != "RED") {
                    console.log(foundSession.shifts)
                    const allWorkers = [];
                    foundSession.shifts.forEach(shift => {
                        allWorkers.push(shift.worker);
                    });
                    setWorkers(allWorkers);
                }
                setSession(foundSession);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching details:", error);
                setError('Failed to load session details. Please try again later.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <ProgressSpinner />;
    if (error) return <div>Error: {error}</div>;
    if (!session) return <div>No data found for ID {id}</div>;

    const getSeverity = (session) => {
        switch (session.planningStage) {
            case 'GREEN':
                return 'success';
            case 'EMBER':
                return 'warning';
            case 'RED':
                return 'danger';
            default:
                return null;
        }
    };

    const getPlanningStage = (session) => {
        switch (session.planningStage) {
            case 'GREEN':
                return 'CONFIRMED';
            case 'EMBER':
                return 'PARTIAL';
            case 'RED':
                return 'VACANT';
            default:
                return null;
        }
    }



    return (
        <div>
            <Card title={`Details for Session ${id}`} className="m-auto p-5">
                <p><strong>Session Start:</strong> {session.sessionStartDate} at {session.sessionStartTime}</p>
                <br/>
                <p><strong>Session End:</strong> {session.sessionEndDate} at {session.sessionEndTime}</p>
                <br/>
                <p>
                    <strong>Planning Status: </strong>
                    <Tag value={getPlanningStage(session)} severity={getSeverity(session)} />
                </p>
                <br/>
                <p><strong>Number of Workers Assigned:</strong> {session.workersBudgeted}</p>
                <br/>
                <p><strong>Workers Assigned:</strong> </p>
                <br/>
                <div className='container w-1/2'>
                    <DataTable value={workers} size='small'>
                        <Column field="name" header="Name" style={{ color: "black", backgroundColor: "white" }} />
                        <Column field="phone" header="Phone Number" style={{ color: "black", backgroundColor: "white" }} />
                    </DataTable>
                </div>
            </Card>

        </div>
    )
}