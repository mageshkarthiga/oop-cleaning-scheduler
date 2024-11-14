"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';

const fetchContracts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v0.1/contract');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching leave applications", error);
        return [];
    }
};

export default function WorkerContracts() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useRef(null); 

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchContracts();
            setContracts(data);
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
        return formatDate(rowData[field].split("T")[0]);
    };

    const handleRowSelect = (contractId) => {
        if (typeof window !== "undefined") {
            router.push(`/contract/existing/${contractId}`);
        }
    };

    const viewButtonTemplate = (rowData) => {
        return (
            <Button
                label="View"
                severity="help"
                outlined
                onClick={() => handleRowSelect(rowData.contractId)}
            />
        );
    };

    const tagTemplate = (rowData) => {
        switch (rowData.contractStatus) {
            case "COMPLETED":
                return <Tag value="COMPLETED" severity="success" />;
            case "IN_PROGRESS":
                return <Tag value="ONGOING" severity="warning" />;
            case "NOT_STARTED":
                return <Tag value="NOT STARTED" severity="danger" />;
        }
    };

    const routeToCreateContract = (type) => {
        if (typeof window !== "undefined") {
            const path = type === 'new' ? '/client/new' : '/contract/form/existing';
            router.push(path);
        }
    };

    return (
        <div className="container mx-auto p-4 card border-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Contracts</h2>
            <SplitButton
                label="&nbsp;Create Contract"
                model={[
                    { label: 'With Existing Client', command: () => routeToCreateContract('existing') },
                    { label: 'With New Client', command: () => routeToCreateContract('new') }
                ]}
                className="mb-4"
                icon="pi pi-plus"
                dropdownIcon="pi pi-chevron-down"
            />
            <br /><br />
            <DataTable value={contracts} paginator rows={5} loading={loading} sortField='contractStart' sortOrder={-1}>
                <Column field="clientName" header="Client" style={{ color: "black", backgroundColor: "white", fontWeight: "bold" }} />
                <Column field="contractStart" header="Start Date" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "contractStart")} sortable />
                <Column field="contractEnd" header="End Date" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "contractEnd")} />
                <Column field="frequency" header="Frequency" style={{ color: "black", backgroundColor: "white" }} />
                <Column field="contractStatus" header="Status" style={{ color: "black", backgroundColor: "white" }} body={tagTemplate} />
                <Column body={viewButtonTemplate} style={{ color: "black", backgroundColor: "white" }} />
            </DataTable>

            {/* Toast component for displaying alerts */}
            <Toast ref={toast} />
        </div>
    );
}
