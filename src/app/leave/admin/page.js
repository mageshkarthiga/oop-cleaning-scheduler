"use client";
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';

const mockApiCall = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    workerId: 1,
                    workerName: "Karthiga",
                    leaveType: "medical",
                    dateSubmitted: "2024-10-19T00:00:00",
                    applicationStatus: "pending"
                },
                {
                    workerId: 2,
                    workerName: "John Doe",
                    leaveType: "annual",
                    dateSubmitted: "2024-10-20T00:00:00",
                    applicationStatus: "approved"
                },
                {
                    workerId: 3,
                    workerName: "Alice Smith",
                    leaveType: "medical",
                    dateSubmitted: "2024-10-18T00:00:00",
                    applicationStatus: "rejected"
                },
                {
                    workerId: 4,
                    workerName: "Bob Johnson",
                    leaveType: "annual",
                    dateSubmitted: "2024-10-21T00:00:00",
                    applicationStatus: "pending"
                },
                {
                    workerId: 5,
                    workerName: "Charlie Brown",
                    leaveType: "medical",
                    dateSubmitted: "2024-10-19T00:00:00",
                    applicationStatus: "approved"
                },
                {
                    workerId: 6,
                    workerName: "Diana Prince",
                    leaveType: "annual",
                    dateSubmitted: "2024-10-22T00:00:00",
                    applicationStatus: "pending"
                }
            ]);
        }, 2000);
    });
};

export default function Leave() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await mockApiCall();
            setApplications(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleApprove = (rowData) => {
        console.log(`Approved application for ${rowData.workerName}`);
        updateApplicationStatus(rowData.workerId, "approved");
    };

    const handleReject = (rowData) => {
        console.log(`Rejected application for ${rowData.workerName}`);
        updateApplicationStatus(rowData.workerId, "rejected");
    };

    const updateApplicationStatus = (workerId, status) => {
        const updatedApplications = applications.map(app =>
            app.workerId === workerId ? { ...app, applicationStatus: status } : app
        );
        setApplications(updatedApplications);
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button label="Approve" severity="success" onClick={() => handleApprove(rowData)} />
                <Button label="Reject" severity="danger" onClick={() => handleReject(rowData)} />
            </div>
        );
    };

    const statusBodyTemplate = (application) => {
        return <Tag value={application.applicationStatus} severity={getSeverity(application)}></Tag>;
    };

    const getSeverity = (application) => {
        switch (application.applicationStatus) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'danger';
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight underline text-gray-900 mx-10">Leave Applications</h1>
            <br />
            <div className='card m-4 border-4'>
                <TabView>
                    <TabPanel header="Pending Applications" rightIcon="pi pi-calendar-clock ml-2" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
                        <DataTable value={applications.filter(app => app.applicationStatus === "pending")} paginator rows={5} loading={loading} sortField="dateSubmitted" sortOrder={-1}>
                            <Column field="workerId" header="Worker ID" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="workerName" header="Worker Name" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="dateSubmitted" header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column header="Actions" body={actionTemplate} style={{ color: "black", backgroundColor: "white" }}></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="History" rightIcon="pi pi-history ml-2" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
                        <DataTable value={applications.filter(app => app.applicationStatus !== "pending")} paginator rows={5} loading={loading} sortField="dateSubmitted" sortOrder={-1}>
                            <Column field="workerId" header="Worker ID" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="workerName" header="Worker Name" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="leaveType" header="Leave Type" style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column field="dateSubmitted" header="Date Submitted" sortable style={{ color: "black", backgroundColor: "white" }}></Column>
                            <Column header="Status" body={statusBodyTemplate} style={{ color: "black", backgroundColor: "white" }}></Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    )
}
