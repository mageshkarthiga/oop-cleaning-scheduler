"use client";
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Button } from 'primereact/button';
import axios from 'axios'; // Import Axios

export default function LeaveForm() {
    const [selectedLeave, setSelectedLeave] = useState('');
    const [date, setDate] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const leaveTypes = [
        { name: 'Medical Leave', code: 'medical' },
        { name: 'Annual Leave', code: 'annual' },
    ];

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
        if (!selectedLeave || !date) {
            setError('Please select a leave type and leave period.');
            return;
        }
        setError('');

        // Create FormData object to hold the data
        const formData = new FormData();
        formData.append('leaveType', selectedLeave);
        formData.append('leavePeriod', date); // Format as needed, e.g., JSON.stringify(date)
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
            setDate(null);
            setFile(null);
            setFileUploaded(false);
            setUploadedFileName('');
            alert('Leave application submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (e.g., show error message)
            setError('Failed to submit the application. Please try again.');
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Leave Application Form</h2>

                {/* Leave Type and Leave Period on the same row */}
                <div className="flex flex-row space-x-8">
                    <div className="flex-1">
                        <label htmlFor="leave-type" className="block text-sm font-medium leading-6 text-gray-900">
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
                        <label htmlFor="period" className="block text-sm font-medium leading-6 text-gray-900">
                            Leave Period
                        </label>
                        <div className="mt-2">
                            <Calendar 
                                id="period" 
                                value={date} 
                                onChange={(e) => setDate(e.value)} 
                                dateFormat="dd/mm/yy" 
                                selectionMode="range" 
                                readOnlyInput 
                                className="w-full" 
                                hideOnRangeSelection 
                                showTime 
                                hourFormat="12" 
                            />
                        </div>
                    </div>
                </div>

                {/* Error message display */}
                {error && <div className="text-red-600">{error}</div>}

                {/* Upload Medical Certificate */}
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
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
