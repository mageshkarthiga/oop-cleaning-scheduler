"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';

export default function SessionDetails() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [availableWorker, setAvailableWorker] = useState([]);
    const [needWorkers, setNeedWorkers] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [showAvailableWorkers, setShowAvailableWorkers] = useState(false);
    const [unassignedShiftId, setUnassignedShiftId] = useState(null);
    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v0.1/cleaningSession/calendar-card/${id}`);
                const foundSession = response.data;
                console.log(foundSession);

                if (!foundSession) {
                    setError('Session not found');
                    setLoading(false);
                    return;
                }

                if (foundSession.planningStage === "EMBER" || foundSession.planningStage === "RED") {
                    setNeedWorkers(true);
                    getAdditionalWorkers(foundSession.cleaningSessionId);
                }

                const allWorkers = foundSession.shifts
                    ? foundSession.shifts.map(shift => {
                        if (shift.workerName) {
                            return { workerName: shift.workerName, workerPhone: shift.workerPhone, shiftId: shift.shiftId };
                        } else {
                            console.log("Shift worker is null or undefined");
                            return null;
                        }
                    }).filter(worker => worker !== null)
                    : [];
                setWorkers(allWorkers);

                // Set initial session and date-time states
                setSession(foundSession);
                setStartDate(foundSession.sessionStartDate);
                setStartTime(foundSession.sessionStartTime);
                setEndDate(foundSession.sessionEndDate);
                setEndTime(foundSession.sessionEndTime);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching details:", error);
                setError('Failed to load session details. Please try again later.');
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [id]);

    const getAdditionalWorkers = async (shiftId) => {
        try {
            // const response = await axios.get(`http://localhost:8080/api/v0.1/shift/${shiftId}/available-workers`);
            // setAvailableWorker(response.data);
        } catch (error) {
            console.error("Error getting workers:", error);
            setError('Failed to retrieve workers. Please try again later.');
        }
    };

    if (loading) return <ProgressSpinner className='m-auto' />;
    if (error) return <div>Error: {error}</div>;
    if (!session) return <div>No data found for ID {id}</div>;

    const handleDateChange = (e, setDate) => setDate(e.target.value);

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
            case 'CANCELLED':
                return 'danger';
            default:
                return null;
        }
    }

    const handleViewSelect = (shiftId) => {
        if (typeof window !== "undefined") {
            router.push(`/shift/${shiftId}`);
        }
    };

    const viewButtonTemplate = (rowData) => {
        return (
            <Button
                label="View"
                severity="help"
                outlined
                onClick={() => handleViewSelect(rowData.shiftId)}
            />
        );
    };

    const unassignButtonTemplate = (rowData) => {
        return (
            <Button
                label="Unassign"
                severity="danger"
                outlined
                onClick={() => {
                    handleWorkerUnassign(rowData.shiftId);
                    setShowAvailableWorkers(true);
                    setUnassignedShiftId(rowData.shiftId);
                }}
            />
        );
    }

    const handleWorkerUnassign = async (shiftId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/unassign-worker/${shiftId}`);
            console.log(response);
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Worker Unassigned', detail: 'Worker unassigned successfully.', life: 3000 });
                const updatedWorkers = workers.filter(worker => worker.shiftId !== shiftId);
                setWorkers(updatedWorkers);
            }
        }
        catch (error) {
            toast.current.show({ severity: 'error', summary: 'Unassign Failed', detail: 'Failed to unassign worker. Please try again.', life: 3000 });
        }
    };

    const reassignWorker = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/shift/assign-worker/${unassignedShiftId}`, {
                workerId: selectedWorker
            });
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Worker Reassigned', detail: 'Worker reassigned successfully.', life: 3000 });
                setShowAvailableWorkers(false);
                const updatedWorkers = [...workers, { workerName: response.data.workerName, workerPhone: response.data.workerPhone, shiftId: unassignedShiftId }];
                setWorkers(updatedWorkers);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Reassign Failed', detail: 'Failed to reassign worker. Please try again.', life: 3000 });
        }
    };

    const cancelSession = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/cleaningSession/cancel-cleaning-session/${id}`);
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Session Cancelled', detail: 'Session was successfully cancelled.', life: 3000 });
            }
        } catch (error) {
            console.log("Error cancelling session", error);
            toast.current.show({ severity: 'error', summary: 'Cancellation Failed', detail: 'Failed to cancel session. Please try again.', life: 3000 });
        }
    };

    const updateSession = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/cleaningSession/update-cleaning-session/${id}`, {
                clientName: session.clientName,
                clientPhone: session.clientPhone,
                clientAddress: session.clientAddress,
                latitude: session.latitude,
                longitude: session.longitude,
                sessionStartDate: startDate,
                sessionEndDate: endDate,
                sessionStartTime: startTime,
                sessionEndTime: endTime,
                planningStage: session.planningStage,
                sessionStatus: session.sessionStatus
            });

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Session Updated', detail: 'Session was successfully updated.', life: 3000 });
            }
        } catch (error) {
            console.error("Error updating session:", error);
            toast.current.show({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update session. Please try again.', life: 3000 });
        }
    };

    const showDialog = () => {
        setDialogVisible(true);
    };

    return (
        <div className="container m-auto p-4">
            <Toast ref={toast} />
            <Card title={`Details for Session ${id}`} className="m-5 p-4 shadow-lg rounded-lg">
                <div className="flex">
                    {/* Column for session details */}
                    <div className="flex-1">
                        <p className="font-semibold">Client Name:</p>
                        <p>{session.clientName}</p>

                        <p className="font-semibold mt-4">Client Phone Number:</p>
                        <a href={`tel:${session.clientPhone}`} className="underline text-blue-400">{session.clientPhone}</a>

                        <p className="font-semibold mt-4">Client Address:</p>
                        <p>{session.clientAddress}</p>

                        <div className="flex flex-col my-4">
                            <p className="font-semibold">Scheduled Session Start:</p>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateChange(e, setStartDate)}
                                className="border border-gray-300 rounded p-2 w-3/4"
                            />
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => handleDateChange(e, setStartTime)}
                                className="border border-gray-300 rounded p-2 mt-2 w-3/4"
                            />
                        </div>

                        <div className="flex flex-col my-4">
                            <p className="font-semibold">Scheduled Session End:</p>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => handleDateChange(e, setEndDate)}
                                className="border border-gray-300 rounded p-2 w-3/4"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => handleDateChange(e, setEndTime)}
                                className="border border-gray-300 rounded p-2 mt-2 w-3/4"
                            />
                        </div>

                        <p className="font-semibold mt-4">Planning Status:
                            <Tag value={getPlanningStage(session)} severity={getPlanningStageSeverity(session)} className="ml-2" />
                        </p>

                        <p className="font-semibold mt-4">Session Status:
                            <Tag value={session.sessionStatus.replace(/_/g, ' ')} severity={getSessionStatusSeverity(session)} className="ml-2" />
                        </p>
                        <div className='flex flex-row space-x-4'>
                            <Button label="Update Session" className="mt-5" onClick={() => updateSession()} />
                            <Button label="Cancel Session" className="mt-5" severity='danger' outlined onClick={() => showDialog()} />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-l-2 border-gray-300 mx-6" />

                    {/* Column for worker assignments */}
                    <div className="flex-1">
                        <p className="font-semibold">Shift Assigned To:</p>
                        {workers.length > 0 ? (
                            <DataTable value={workers} size="small" className="w-full mt-2">
                                <Column field="workerName" header="Name" style={{ color: "black", backgroundColor: "white" }} />
                                <Column field="workerPhone" header="Phone Number" body={(rowData) => (
                                    <a href={`tel:${rowData.workerPhone}`} className="underline text-blue-400">
                                        {rowData.workerPhone}
                                    </a>
                                )} style={{ color: "black", backgroundColor: "white" }} />
                                <Column body={viewButtonTemplate} style={{ color: "black", backgroundColor: "white" }} />
                                <Column body={unassignButtonTemplate} style={{ color: "black", backgroundColor: "white" }} />
                            </DataTable>
                        ) : (
                            <p>No workers assigned to this shift.</p>
                        )}

                        {showAvailableWorkers && (
                            <>
                                <p className="font-semibold mt-4">Available Workers:</p>
                                <select
                                    value={selectedWorker}
                                    onChange={(e) => setSelectedWorker(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-4"
                                >
                                    <option value="" disabled>Select a worker</option>
                                    {availableWorker.map((worker, index) => (
                                        <option key={index} value={worker.id}>
                                            {worker.name}
                                        </option>
                                    ))}
                                </select>
                                <Button label="Reassign Worker" className="mt-2" onClick={reassignWorker} />
                            </>
                        )}
                    </div>
                </div>
                <Dialog
                    header="Confirm Cancellation"
                    visible={dialogVisible}
                    style={{ width: '50vw' }}
                    onHide={() => setDialogVisible(false)}
                    footer={
                        <div className='flex flex-row space-x-4'>
                            <Button label="No &nbsp;" icon="pi pi-times" onClick={() => setDialogVisible(false)} iconPos='right' />
                            <Button label="Cancel &nbsp;" icon="pi pi-check" onClick={cancelSession} severity='danger' iconPos='right' outlined />
                        </div>
                    }
                >
                    <p>Are you sure you want to cancel this session?</p>
                </Dialog>
            </Card>
        </div>
    );
}
