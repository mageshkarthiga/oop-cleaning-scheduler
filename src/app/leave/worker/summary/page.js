"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import axios from 'axios';

export default function Leave() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workerId, setWorkerId] = useState(4);
    const [workers, setWorkers] = useState([]);
    const [isMounted, setIsMounted] = useState(false);  // Added state to track mount
    const toast = useRef(null);

    useEffect(() => {
            setIsMounted(true);  // Set to true after mount
        }, []);

    // Fetch the list of workers
    const fetchWorkers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v0.1/workers');
            setWorkers(response.data);
        } catch (error) {
            console.error('Error fetching workers:', error);
        }
    };

    // Fetch all historical leave applications for the selected worker
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v0.1/leave-applications/${workerId}`);
            setApplications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers(); // Fetch the list of workers on component mount
        fetchData(); // Fetch data for the default worker (ID 4)
    }, [workerId]); // Re-fetch data when selectedWorkerId changes

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

    return (<form className="m-4 border-4 p-4">
                <Toast ref={toast} />
                <div className="space-y-6">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">
                        Leave Application Form
                    </h2>
                    {/* Worker Selection Dropdown */}
                    <div className="flex-1">
                        <label htmlFor="worker" className="block text-md font-medium leading-6 text-gray-900">
                            Worker
                        </label>
                        <div className="mt-2">
                            <select
                                id="worker"
                                value={workerId}
                                onChange={(e) => setWorkerId(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Worker</option>
                                {workers.map((worker) => (
                                    <option key={worker.workerId} value={worker.workerId}>
                                        {worker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DataTable Component */}
                    <DataTable
                        value={applications}
                        paginator
                        rows={4}
                        loading={loading}
                        sortField="dateSubmitted"
                        sortOrder={-1}
                    >
                        <Column
                            field="leaveType"
                            header="Leave Type"
                            style={{
                                color: "black",
                                backgroundColor: "white",
                                fontWeight: "bold",
                            }}
                        />
                        <Column
                            field="leaveStartDate"
                            header="Leave Start Date"
                            sortable
                            style={{ color: "black", backgroundColor: "white" }}
                            body={(rowData) => dateBodyTemplate(rowData, "leaveStartDate")}
                        />
                        <Column
                            field="leaveEndDate"
                            header="Leave End Date"
                            sortable
                            style={{ color: "black", backgroundColor: "white" }}
                            body={(rowData) => dateBodyTemplate(rowData, "leaveEndDate")}
                        />
                        <Column
                            field="applicationStatus"
                            header="Application Status"
                            body={statusBodyTemplate}
                            style={{ color: "black", backgroundColor: "white" }}
                        />
                    </DataTable>
                </div>
            </form>
    );
}
