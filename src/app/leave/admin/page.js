"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

export default function Leave() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminId, setAdminId] = useState(2);
    const [admins, setAdmins] = useState([]);
    const [isMounted, setIsMounted] = useState(false);  // Added state to track mount
    const toast = useRef(null);

    useEffect(() => {
            setIsMounted(true);  // Set to true after mount
        }, []);

    // Fetch the list of admins
    const fetchAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v0.1/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    // Fetch pending leave applications for approved/rejection for the selected admin
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v0.1/leave-applications/${adminId}/get-pending-leave-applications/`);
            setApplications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins(); // Fetch the list of admins on component mount
        fetchData(); // Fetch data for the default admin (ID 2)
    }, [adminId]); // Re-fetch data when selectedAdminId changes

    const handleApprove = async (rowData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/admins/approve-leave-application/${rowData.leaveApplicationId}`);
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Approved application for ${rowData.workerName}`, life: 4000 });
                fetchData();
                console.log(rowData);
            }
        } catch (error) {
            console.error('Error approving application:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to approve application. Please try again.', life: 4000 });
        }
    };

    const handleReject = async (rowData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v0.1/admins/reject-leave-application/${rowData.leaveApplicationId}`);
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Rejected application for ${rowData.workerName}`, life: 4000 });
                fetchData();
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to reject application. Please try again.', life: 4000 });
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button label="Approve &nbsp;" severity="success" onClick={() => handleApprove(rowData)} icon="pi pi-check" iconPos='right' />
                <Button label="Reject &nbsp;" severity="danger" onClick={() => handleReject(rowData)} icon="pi pi-times" iconPos='right' />
            </div>
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

    return (
        <div>
            <Toast ref={toast} />
            <div className='container mx-auto p-4 card border-4'>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Pending Leave Applications</h2>

                {/* Dropdown to select admin */}
                <div className="mb-4">
                    <label htmlFor="adminDropdown" className="block text-lg font-medium">Select Admin</label>
                    <Dropdown
                        id="adminDropdown"
                        value={adminId}
                        options={admins.map(admin => ({ label: admin.username, value: admin.adminId }))}  // Map to display admin names
                        onChange={(e) => setAdminId(e.value)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select an Admin"
                    />
                </div>

                <DataTable value={applications} paginator rows={5} loading={loading} sortField="dateSubmitted" sortOrder={-1}>
                    <Column field="workerName" header="Worker Name" style={{ color: "black", backgroundColor: "white", fontWeight: "bold" }}/>
                    <Column field="workerPhoneNumber" header="Worker Phone Number" style={{ color: "black", backgroundColor: "white" }}/>
                    <Column field="leaveStartDate" header="Leave Start Date" sortable style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "leaveStartDate")}/>
                    <Column field="leaveEndDate" header="Leave End Date" sortable style={{ color: "black", backgroundColor: "white" }} body={(rowData) => dateBodyTemplate(rowData, "leaveEndDate")}/>
                    <Column header="Actions" body={actionTemplate} style={{ color: "black", backgroundColor: "white" }}/>
                </DataTable>
            </div>
        </div>
    )
}
