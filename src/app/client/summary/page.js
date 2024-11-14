"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const fetchClients = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v0.1/client');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching leave applications", error);
        return [];
    }
};

export default function ClientSummary() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchClients();
            setClients(data);
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

    const handleRowSelect = (contractId) => {
        if (typeof window !== "undefined") {
            router.push(`/contract/details/${contractId}`);
        }
    };

    const viewButtonTemplate = (rowData) => {
        if (rowData.contracts.length > 0) {
            return (
                <Button
                    label="View Contract"
                    severity="help"
                    outlined
                    onClick={() => handleRowSelect(rowData.contracts[0].contractId)}
                />
            );
        } else {
            return (
                <Tag value="NO CONTRACT" severity="danger" />)
        };
    };

    const addressTemplate = (rowData) => {
        return rowData.clientSites[0]?.streetAddress || 'NA';
    };

    const contractStartDateTemplate = (rowData) => {
        return rowData.contracts[0] ? formatDate(rowData.contracts[0].contractStart) : 'NA';
    };

    return (
        <div className="container mx-auto p-4 card border-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Clients</h2>
            <Button label="Add New Client &nbsp;" icon="pi pi-plus-circle" iconPos='right' onClick={() => router.push('/client/new')}/>
            <br /><br />
            <DataTable value={clients} paginator rows={5} loading={loading} sortField='name' sortOrder={1}>
                <Column field="name" header="Client Name" style={{ color: "black", backgroundColor: "white", fontWeight: "bold" }} sortable />
                <Column field="phone" header="Client Phone No." style={{ color: "black", backgroundColor: "white" }} />
                <Column header="Street Address" body={addressTemplate} style={{ color: "black", backgroundColor: "white" }} />
                <Column header="Latest Contract Start Date" body={contractStartDateTemplate} style={{ color: "black", backgroundColor: "white" }} />
                <Column header="Actions" body={viewButtonTemplate} style={{ color: "black", backgroundColor: "white" }} />
            </DataTable>

            {/* Toast component for displaying alerts */}
            <Toast ref={toast} />
        </div>
    );
}
