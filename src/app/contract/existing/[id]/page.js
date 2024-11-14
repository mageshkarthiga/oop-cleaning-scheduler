"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

export default function ContractDetails() {
    const [contract, setContract] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [cleaningSessions, setCleaningSessions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    const toast = useRef(null);
    const minDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                if (id && loading) {
                    const response = await axios.get(`http://localhost:8080/api/v0.1/contract/${id}`);
                    const contractData = response.data;

                    if (contractData) {
                        setContract(contractData);
                        setCleaningSessions(contractData.cleaningSessions || []);
                        setStartDate(contractData.contractStart || "");
                        setEndDate(contractData.contractEnd || "");
                        setStartTime(contractData.sessionStartTime || "");
                        setLoading(false); 
                    } else {
                        setError("Contract not found.");
                    }
                }
            } catch (error) {
                console.error("Error fetching contract data:", error);
                setError("Failed to load contract data.");
            }
        };

        fetchContractData();
    }, [id]);



    const updateContractDetails = async () => {
        try {
            const updatedContract = {
                ...contract,
                contractStart: startDate ? `${startDate}T${startTime}:00.000Z` : contract.contractStart,
                contractEnd: endDate ? `${endDate}T23:59:59.000Z` : contract.contractEnd
            };
            console.log(updatedContract);

            const response = await axios.put(`http://localhost:8080/api/v0.1/contract/update-contract/${contract.contractId}`,
                updatedContract,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Contract updated successfully:', response.data);
            setError('');

            // Show success toast notification
            toast.current.show({
                severity: 'success',
                summary: 'Success!',
                detail: 'Contract updated.',
                life: 7000
            });

        } catch (error) {
            console.error('Error updating contract details:', error);
            setError('Failed to update contract details. Please try again later.');
        }
    };

    const handleRowSelect = (sessionId) => {
        if (typeof window !== "undefined") {
            router.push(`/session/${sessionId}`);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                label="View"
                severity="help"
                outlined
                onClick={() => handleRowSelect(rowData.cleaningSessionId)}
            />
        );
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

    const dateBodyTemplate = (rowData, field) => {
        return formatDate(rowData[field]);
    };

    const stageTagTemplate = (rowData) => {
        switch (rowData.planningStage) {
            case "GREEN":
                return <Tag value="CONFIRMED" severity="success" />;
            case "EMBER":
                return <Tag value="PARTIAL" severity="warning" />;
            case "RED":
                return <Tag value="VACANT" severity="danger" />;
        }
    }

    const terminateContract = async () => {
        try {
            await axios.put(`http://localhost:8080/api/v0.1/contract/deactivate-contract/${id}`);

            // Show success toast
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Contract terminated successfully.',
                life: 4000
            });
        } catch (error) {
            console.error("Error terminating contract", error);

            // Show error toast
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response ? error.response.data : 'An unexpected error occurred.',
                life: 4000
            });
        }
    };

    const showDialog = () => {
        setDialogVisible(true);
    };

    if (error) {
        return (
            <div className="text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (!contract) {
        return <p>Loading contract details...</p>;
    }

    return (
        <Card className="m-4 p-4">
            <div className="toast-container w-full">
                <Toast ref={toast} />
            </div>
            <div className="flex flex-row">
                <div className="w-1/2 pr-4">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Contract Details</h2>
                    <div className="space-y-4">
                        <div>
                            <strong>Property Address:</strong> {contract.clientSite.unitNumber}, {contract.clientSite.streetAddress}, Singapore {contract.clientSite.postalCode}
                        </div>
                        <div>
                            <strong>Property Type:</strong> {contract.clientSite.propertyType}
                        </div>
                        <div>
                            <strong>Frequency:</strong> {contract.frequency}
                        </div>
                        <div>
                            <strong>Start Date:</strong>&nbsp;
                            <input
                                type="date"
                                value={startDate}
                                min={minDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <strong>End Date:</strong>&nbsp;
                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <strong>Preferred Start Time:</strong>&nbsp;
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <Button label="Update Contract" className="mt-4" onClick={updateContractDetails} />
                        <Button label="Terminate Contract" className="mt-4" onClick={showDialog} severity="danger" outlined />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-l-2 border-gray-300 mx-6" />

                <div className="w-3/4">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Cleaning Sessions</h2>
                    {cleaningSessions.length > 0 ? (
                        <DataTable value={cleaningSessions} sortField='sessionStartDate' paginator rows={5} loading={loading} sortOrder={-1}>
                            <Column field="sessionStartDate" header="Session Date" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "sessionStartDate")} sortable />
                            <Column field="sessionStartTime" header="Start Time" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="sessionEndTime" header="End Time" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="planningStage" header="Planning Status" style={{ color: "black", backgroundColor: "white" }} body={stageTagTemplate} />
                            <Column body={actionBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                        </DataTable>
                    ) : (
                        <p>No cleaning sessions available.</p>
                    )}
                </div>
            </div>
            {/* Confirmation Dialog */}
            <Dialog
                header="Confirm Termination"
                visible={dialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <div className='flex flex-row space-x-4'>
                        <Button label="No &nbsp;" icon="pi pi-times" onClick={() => setDialogVisible(false)} iconPos='right' />
                        <Button label="Terminate &nbsp;" icon="pi pi-check" onClick={terminateContract} severity='danger' iconPos='right' outlined />
                    </div>
                }
            >
                <p>Are you sure you want to terminate this contract?</p>
            </Dialog>
        </Card>
    );
}
