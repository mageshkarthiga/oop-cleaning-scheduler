'use client';

import { useParams, useRouter } from 'next/navigation';
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
    const [selectedWorker, setSelectedWorker] = useState([]);
    const [availableWorker, setAvailableWorker] = useState([]);
    const [needWorkers, setNeedWorkers] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v0.1/cleaningSession`)
            .then((response) => {
                const fetchedData = response.data;
                const foundSession = fetchedData.find(cleaningSession => cleaningSession.cleaningSessionId.toString() === id);
                foundSession.planningStage = "EMBER";
                console.log(foundSession);

                if (!foundSession) {
                    setError('Session not found');
                    setLoading(false);
                    return;
                }

                if (foundSession.planningStage === "EMBER" || foundSession.planningStage === "RED") {
                    setNeedWorkers(true);
                    addWorkers(foundSession.cleaningSessionId);
                }

                const allWorkers = foundSession.shifts
                    ? foundSession.shifts.map(shift => {
                        if (shift.worker) {
                            return { ...shift.worker, shiftId: shift.shiftId }; // Include shiftId with worker details
                        } else {
                            console.log("Shift worker is null or undefined");
                            return null;
                        }
                    }).filter(worker => worker !== null)
                    : [];
                setWorkers(allWorkers);
                setSession(foundSession);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching details:", error);
                setError('Failed to load session details. Please try again later.');
                setLoading(false);
            });
    }, [id]);

    const addWorkers = async (shiftId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v0.1/workers`);
            setAvailableWorker(response.data);
        } catch (error) {
            console.error("Error getting workers:", error);
            setError('Failed to retrieve workers. Please try again later.');
        }
    };

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

    const handleRowSelect = (shiftId) => {
        if (typeof window !== "undefined") {
            router.push(`/shift/${shiftId}`);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                label="View" 
                severity="help" 
                outlined
                onClick={() => handleRowSelect(rowData.shiftId)} 
            />
        );
    };

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
                </div>
                <div className="mb-4">
                    <p className="text-lg font-medium">
                        <strong>Shift Assigned To:</strong>
                    </p>
                    <div className='container w-3/4'>
                        <DataTable value={workers} size='small'>
                            <Column field="name" header="Name" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="phone" header="Phone Number" style={{ color: "black", backgroundColor: "white" }} />
                            <Column body={actionBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                        </DataTable>
                    </div>
                    <br />
                    <p className="text-lg font-medium">
                        <strong>Available Workers:</strong>
                    </p>
                    <div className='w-3/4'>
                        {needWorkers && (
                            <div className="w-3/4">
                                <select
                                    value={availableWorker}
                                    onChange={(e) => setSelectedWorker([...e.target.selectedOptions].map(option => option.value))}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    multiple
                                >
                                    {workers.map((worker, index) => (
                                        <option key={index} value={worker.id} id={worker.id}>
                                            {worker.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                    </div>
                </div>
                <div>
                    <p className="text-lg font-medium">
                        <strong>Session Status:</strong>
                        <Tag value={session.sessionStatus.replace(/_/g, ' ')} severity={getSessionStatusSeverity(session)} className="ml-2" />
                    </p>
                </div>
                <br/>
                <Button label="Update" severity='success'/>
            </Card>
        </div>
    );
}
