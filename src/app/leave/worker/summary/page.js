"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';

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
    const [recentApplications, setrecentApplications] = useState([]);  
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
                setrecentApplications(Array.isArray(leaveApplications.mostRecentApprovedApplication) ? leaveApplications.mostRecentApprovedApplication : []);
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

    const handleApprove = (rowData) => {
        console.log(`Approved application for ${rowData.workerName}`);
        updateApplicationStatus(rowData.applicationId, "APPROVED");
    };

    const handleReject = (rowData) => {
        console.log(`Rejected application for ${rowData.workerName}`);
        updateApplicationStatus(rowData.applicationId, "REJECTED");
    };

    const updateApplicationStatus = (applicationId, status) => {
        const updatedApplications = pendingApplications.map(app =>
            app.applicationId === applicationId ? { ...app, applicationStatus: status } : app
        );
        setPendingApplications(updatedApplications);
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mx-10">Leave Applications</h1>
            <br />
            <div className='card m-4 border-4'>
                <TabView>
                    {/* Pending Applications Tab */}
                    <TabPanel header="Pending Applications" rightIcon="pi pi-calendar-clock ml-2" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
                        <DataTable value={pendingApplications.filter(app => app.applicationStatus === "PENDING")} paginator rows={5} loading={loading} sortField="applicationSubmitted" sortOrder={-1}>
                            <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="applicationSubmitted" body={(rowData) => dateBodyTemplate(rowData, "applicationSubmitted")} header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }} />
                            <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                            <Column header="Actions" style={{ color: "black", backgroundColor: "white" }} body={(rowData) => (
                                <div className="flex gap-2">
                                    <Button label="Approve" severity="success" onClick={() => handleApprove(rowData)} />
                                    <Button label="Reject" severity="danger" onClick={() => handleReject(rowData)} />
                                </div>
                            )} />
                        </DataTable>
                    </TabPanel>

                    {/* History Tab */}
                    <TabPanel header="History" rightIcon="pi pi-history ml-2" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
                        <DataTable value={history} paginator rows={5} loading={loading} sortField="applicationSubmitted" sortOrder={-1}>
                            <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }} />
                            <Column field="applicationSubmitted" body={(rowData) => dateBodyTemplate(rowData, "applicationSubmitted")} header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }} />
                            <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }} />
                        </DataTable>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}
