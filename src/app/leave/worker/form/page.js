"use client";
import React, { useState, useRef, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

export default function LeaveForm() {
    const [workers, setWorkers] = useState([]);
    const [workerId, setWorkerId] = useState(1);
    const [selectedLeave, setSelectedLeave] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [isMounted, setIsMounted] = useState(false);  // Added state to track mount
    const toast = useRef(null);

    useEffect(() => {
                setIsMounted(true);  // Set to true after mount
            }, []);

    const leaveTypes = [
        { name: 'Medical Leave', code: 'medical' },
        { name: 'Annual Leave', code: 'annual' },
    ];

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    let minTime = today.toTimeString().split(' ')[0].slice(0, 5); // Default minTime is the current time

    // Compare if leaveStartDate is today
    if (startDate === todayDate) {
        today.setHours(today.getHours() + 3);  // Add 3 hours to current time
        minTime = today.toTimeString().split(' ')[0].slice(0, 5);  // Set minTime to 3 hours ahead
    } else {
        minTime = '00:00';  // Allow any time if leaveStartDate is not today
    }

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v0.1/workers');
                setWorkers(response.data);
            } catch (error) {
                console.error('Error fetching workers:', error);
            }
        };
        fetchWorkers();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setUploadedFileName(selectedFile.name);
            setFileUploaded(true);
        } else {
            setFileUploaded(false);
            setUploadedFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLeave || !startDate || !endDate || !startTime || !endTime || (selectedLeave === 'medical' && !file)) {
            setError('Please select a leave type and leave period. Upload a medical certificate if applying for medical leave.');
            return;
        }
        setError('');

        if (startDate >= endDate) {
            setError('Start date must be before the end date.');
            return;
        }

        if (startTime >= endTime) {
            setError('Start time must be before the end time.');
            return;
        }

        const formData = {
            workerId: workerId,
            startDate: startDate,
            endDate: endDate,
        }

        try {
            let response;
            if (selectedLeave === 'medical') {
                response = await axios.post(`http://localhost:8080/api/v0.1/leave-applications/${workerId}/apply-medical-leave/`, null,
                    {
                        params: formData
                    }
                );
            } else if (selectedLeave === 'annual') {
                response = await axios.post(`http://localhost:8080/api/v0.1/leave-applications/${workerId}/apply-annual-leave/`, null,
                    {
                        params: formData
                    }
                );
            }

            console.log('Response:', response.data);
            if(response.status == 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave submitted successfully!', life: 4000 });
            }
            setFile(null);
            setFileUploaded(false);
            setUploadedFileName('');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data || 'Failed to submit leave application. Please try again.';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 4000 });
            setError(errorMessage);
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <Toast ref={toast} /> 
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Leave Application Form</h2>

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

                <div className="flex-1">
                    <label htmlFor="leave-type" className="block text-md font-medium leading-6 text-gray-900">
                        Leave Type
                    </label>
                    <div className="mt-2">
                        <select
                            id="leave-type"
                            value={selectedLeave}
                            onChange={(e) => setSelectedLeave(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        >
                            <option value="" disabled>Select Leave Type</option>
                            {leaveTypes.map((leave) => (
                                <option key={leave.code} value={leave.code}>
                                    {leave.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1">
                    <label htmlFor="period" className="block text-md font-medium leading-6 text-gray-900">
                        Leave Period
                    </label>
                    <div className="mt-2 space-y-4">
                        {/* Start Date and Time in One Row */}
                        <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={todayDate}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    min={minTime}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* End Date and Time in One Row */}
                        <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Error message display */}
                {error && <div className="text-red-600">{error}</div>}

                {/* Upload Medical Certificate */}
                {selectedLeave === 'medical' && (
                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-md font-medium leading-6 text-gray-900">
                            Medical Certificate
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {/* Success Message */}
                        {fileUploaded && (
                            <p className="mt-2 text-green-600">File "{uploadedFileName}" uploaded successfully!</p>
                        )}
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-x-6">
                <Button label="Submit Leave" type="submit" />
            </div>
        </form>
    );
}
