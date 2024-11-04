"use client";
import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Button } from 'primereact/button';
import axios from 'axios'; // Import Axios

export default function LeaveForm() {
    const [selectedLeave, setSelectedLeave] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const leaveTypes = [
        { name: 'Medical Leave', code: 'medical' },
        { name: 'Annual Leave', code: 'annual' },
    ];

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    today.setHours(today.getHours() + 3); 
    const minTime = today.toTimeString().split(' ')[0].slice(0, 5);

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
        if (!selectedLeave || !startDate || !endDate || !startTime || !endTime) {
            setError('Please select a leave type and leave period.');
            return;
        }
        setError('');

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (startDateTime >= endDateTime) {
            setError('Start date and time must be before the end date and time.');
            return;
        }


        const formData = new FormData();
        formData.append('leaveType', selectedLeave);
        const formattedStartDateTime = new Date(`${startDate}T${startTime}`).toISOString();
        const formattedEndDateTime = new Date(`${endDate}T${endTime}`).toISOString();
        formData.append('startDate', formattedStartDateTime);
        formData.append('endDate', formattedEndDateTime);
        console.log(formData);
        if (file) {
            formData.append('medicalCertificate', file);
        }

        try {
            // Make the API request
            // const response = await axios.post('https://yourapi.com/leaves', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data', // Set appropriate headers for file upload
            //     },
            // });
            // console.log('Response:', response.data);
            // Handle success (e.g., reset form or show success message)
            setSelectedLeave('');
            setFile(null);
            setFileUploaded(false);
            setUploadedFileName('');
            alert('Leave application submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to submit the application. Please try again.');
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Leave Application Form</h2>

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
                                    min={minDate}
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
                </div>
                {/* Success Message */}
                {fileUploaded && (
                    <p className="mt-2 text-green-600">File "{uploadedFileName}" uploaded successfully!</p>
                )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Button label="Submit" type="submit" outlined />
            </div>
        </form>
    );
}
