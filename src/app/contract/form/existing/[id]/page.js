"use client";
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';


export default function ContractDetails() {
    const [contract, setContract] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [cleaningSessions, setCleaningSessions] = useState([]);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (id) fetchContractData();
    }, [id]);

    const fetchContractData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v0.1/contract`);
            const contractData = response.data;
            console.log(contractData)
            for (const contract in contractData) {
                if (contractData[contract].contractId == id) {
                    var contractDetails = contractData[contract];
                    setCleaningSessions(contractDetails.cleaningSessions);
                    setLoading(false);
                }
            }

            if (contractDetails) {
                setContract(contractDetails);
            } else {
                setError('Contract not found.');
            }
        } catch (error) {
            console.error('Error fetching contract data:', error);
            setError('Failed to load contract data. Please try again later.');
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
        rowData.planningStage = "EMBER";
        switch (rowData.planningStage) {
            case "GREEN":
                return <Tag value="Confirmed" severity="success" />;
            case "EMBER":
                return <Tag value="Partial" severity="warning" />;
            case "RED":
                return <Tag value="Vacant" severity="danger" />;
        }
    }

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
            <div className="flex flex-row">
                <div className='w-1/2'>
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Contract Details</h2>
                    <div className="space-y-4">
                        <div>
                            <strong>Client Name:</strong> {contract.client.name}
                        </div>
                        <div>
                            <strong>Property Address:</strong> {contract.location.address}
                        </div>
                        <div>
                            <strong>Package Type:</strong> {contract.packageType}
                        </div>
                        <div>
                            <strong>Frequency:</strong> {contract.frequency}
                        </div>
                        <div>
                            <strong>Start Date:</strong> {new Date(contract.contractStart).toLocaleDateString('en-GB', {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <div>
                            <strong>End Date:</strong> {new Date(contract.contractEnd).toLocaleDateString('en-GB', {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <div>
                            <strong>Start Time:</strong> {new Date(contract.contractStart).toLocaleTimeString('en-SG').slice(0, 5)}
                        </div>
                    </div>
                </div>
                <div className='w-3/4'>
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Cleaning Sessions</h2>
                    <DataTable value={cleaningSessions} paginator rows={5} loading={loading}>
                        <Column field="sessionStartDate" header="Session Date" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "sessionStartDate")} />
                        <Column field="sessionStartTime" header="Start Time" style={{ color: "black", backgroundColor: "white" }} />
                        <Column field="sessionEndTime" header="End Time" style={{ color: "black", backgroundColor: "white" }} />
                        <Column field="planningStage" header="Planning Stage" style={{ color: "black", backgroundColor: "white" }} body={stageTagTemplate}/>
                        <Column body={actionBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                    </DataTable>
                </div>
            </div>
        </Card>
    );
}
