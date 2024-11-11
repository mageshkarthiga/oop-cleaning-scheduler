"use client"; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const fetchShifts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v0.1/shift/worker/1');
        return response.data;
    } catch (error) {
        console.error("Error fetching leave applications", error);
        return [];
    }
};

export default function WorkerShifts() {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchShifts();
            setShifts(data);
            setLoading(false);
        };

        fetchData();
    }, []);

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
                onClick={() => handleRowSelect(rowData.contractId)} 
            />
        );
    };

    return (
        <div className="container mx-auto p-4 card border-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Upcoming Shifts</h2>
            <DataTable value={shifts} paginator rows={5} loading={loading}>
                <Column field="sessionStartDate" header="Shift Date" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "sessionStartDate")}/>
                <Column field="sessionStartTime" header="Start Time" style={{ color: "black", backgroundColor: "white" }}/>
                <Column field="sessionEndTime" header="End Time" style={{ color: "black", backgroundColor: "white" }}/>
                <Column field="location.address" header="Location" style={{ color: "black", backgroundColor: "white" }}/>
                <Column body={actionBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
            </DataTable>
        </div>
    );
}
