"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const fetchLeaveApplications = () => {
    return axios.get('http://localhost:8080/api/v0.1/leave-applications/worker/1/pending-with-approved')
        .then(response => response.data) 
        .catch(error => {
            console.error("Error fetching leave applications", error);
            return [];  
        });
};

const fetchLeaveHistory = () => {
    return axios.get('http://localhost:8080/api/v0.1/leave-applications/worker/1/history')
        .then(response => response.data) 
        .catch(error => {
            console.error("Error fetching leave history", error);
            return []; 
        });
};

export default function Leave() {
    const [pendingApplications, setPendingApplications] = useState([]);  
    const [recentApplication, setRecentApplication] = useState(null);  
    const [history, setHistory] = useState([]);  
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaveApplications, historyData] = await Promise.all([
                    fetchLeaveApplications(),
                    fetchLeaveHistory()
                ]);
                setPendingApplications(Array.isArray(leaveApplications.pendingApplications) ? leaveApplications.pendingApplications : []);
                setRecentApplication(leaveApplications.mostRecentApprovedApplication || null);
                setHistory(Array.isArray(historyData) ? historyData : []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
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

    const statusBodyTemplate = (application) => {
        return <Tag value={application.applicationStatus} severity={getSeverity(application)} />;
    };

    const getSeverity = (application) => {
        switch (application.applicationStatus) {
            case 'APPROVED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'REJECTED':
                return 'danger';
            default:
                return null;
        }
    };

    const dateBodyTemplate = (rowData, field) => {
        return formatDate(rowData[field]);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight underline text-gray-900 mx-10">Leave Applications</h1>
            <br />

            {/* Most Recent Approved Application Table */}
            <div className="card m-4 border-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Most Recent Approved Application</h2>
                <DataTable value={recentApplication ? [recentApplication] : []} paginator rows={1} loading={loading}>
                    <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }} />
                    <Column field="applicationSubmitted" body={(rowData) => dateBodyTemplate(rowData, "applicationSubmitted")} header="Date Submitted" style={{ color: "black", backgroundColor: "white" }} />
                    <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                </DataTable>
            </div>

            {/* Pending Applications Table */}
            <div className="card m-4 border-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Pending Applications</h2>
                <DataTable value={pendingApplications} paginator rows={5} loading={loading} sortField="applicationSubmitted" sortOrder={-1}>
                    <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }} />
                    <Column field="applicationSubmitted" body={(rowData) => dateBodyTemplate(rowData, "applicationSubmitted")} header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }} />
                    <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                </DataTable>
            </div>

            {/* Leave History Table */}
            <div className="card m-4 border-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-3">Leave History</h2>
                <DataTable value={history} paginator rows={5} loading={loading} sortField="applicationSubmitted" sortOrder={-1}>
                    <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }} />
                    <Column field="applicationSubmitted" body={(rowData) => dateBodyTemplate(rowData, "applicationSubmitted")} header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }} />
                    <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                </DataTable>
            </div>
        </div>
    );
}
