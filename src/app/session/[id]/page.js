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
                if (foundSession.planningStage != "RED") {
                    console.log(foundSession)
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

    const getPlanningStageSeverity = (session) => {
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

    const getSessionStatusSeverity = (session) => {
        switch (session.sessionStatus) {
            case 'NOT_STARTED':
                return 'danger';
            case 'WORKING':
                return 'warning';
            case 'FINISHED':
                return 'success';
            default:
                return null;
        }
    }



    return (
        <div className='container m-auto p-5'>
            <Card title={`Details for Session ${id}`} className="shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <p className="text-lg font-medium">
                        <strong>Session Start:</strong> {session.sessionStartDate} at {session.sessionStartTime}
                    </p>
                    <p className="text-lg font-medium">
                        <strong>Session End:</strong> {session.sessionEndDate} at {session.sessionEndTime}
                    </p>
                </div>
                <div className="mb-4">
                    <p className="text-lg font-medium">
                        <strong>Planning Status:</strong>
                        <Tag value={getPlanningStage(session)} severity={getPlanningStageSeverity(session)} className="ml-2" />
                    </p>
                    {/* <p className="text-lg font-medium">
                        <strong>Number of Workers Assigned:</strong> {session.workersBudgeted}
                    </p> */}
                </div>
                <div className="mb-4">
                    <p className="text-lg font-medium">
                        <strong>Workers Assigned:</strong>
                    </p>
                    <div className='container w-full'>
                        <DataTable value={workers} size='small'>
                            <Column field="name" header="Name" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="phone" header="Phone Number" style={{ color: "black", backgroundColor: "white" }} />
                        </DataTable>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-medium">
                        <strong>Session Status:</strong>
                        <Tag value={session.sessionStatus.replace(/_/g, ' ')} severity={getSessionStatusSeverity(session)} className="ml-2" />
                    </p>
                </div>
            </Card>
        </div>

    )
}