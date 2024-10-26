"use client";
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Example() {
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [date, setDate] = useState(null);

    const leaveTypes = [
        { name: 'Medical Leave', code: 'medical' },
        { name: 'Annual Leave', code: 'annual' },
    ];

    return (
        <form className="mx-4 border-4 p-4">
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Leave Application Form</h2>

                {/* Leave Type and Leave Period on the same row */}
                <div className="flex flex-row space-x-8">
                    <div className="flex-1">
                        <label htmlFor="leave-type" className="block text-sm font-medium leading-6 text-gray-900">
                            Leave Type
                        </label>
                        <div className="mt-2">
                            <Dropdown
                                id="leave-type"
                                value={selectedLeave}
                                onChange={(e) => setSelectedLeave(e.value)}
                                options={leaveTypes}
                                optionLabel="name"
                                placeholder="Select Leave Type"
                                className="w-full"
                            />
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
                                panelStyle={{ minWidth: '300px', width: 'auto', top: '10px', left: '0px' }} // Direct inline styling
                            />
                        </div>
                    </div>
                </div>

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
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
