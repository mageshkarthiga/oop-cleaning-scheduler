"use client";
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios'; // Import Axios

export default function ContractForm() {
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');

    const [clients, setClients] = useState([]);
    const [properties, setProperties] = useState([]);
    const [packages] = useState([
        '2 Bedrooms and Below HDB',
        '3-Room HDB',
        '4-Room HDB',
        '5 Bedrooms or More HDB',
        '2 Bedroom Condo',
        '3 Bedroom Condo',
        '4 Bedrooms or More Condo',
        'Landed Property'
    ]);
    const [frequency] = useState([ 
        'Weekly',
        'Bi-Weekly'
    ]);

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    today.setHours(today.getHours());
    const minTime = today.toTimeString().split(' ')[0].slice(0, 5);

    // Fetch clients
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v0.1/client');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setError('Failed to load clients. Please try again later.');
        }
    };

    // Fetch properties
    const fetchProperties = async () => {
        try {
            // const response = await axios.get('https://yourapi.com/properties'); 
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError('Failed to load properties. Please try again later.');
        }
    };

    useEffect(() => {
        fetchClients();
        fetchProperties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient || !selectedPackage || !selectedProperty || !startDate || !endDate || !startTime) {
            setError('Please select a client, package type, property, and provide contract duration.');
            return;
        }
        setError('');

        if (startDate >= endDate) {
            setError('Start date must be before the end date.');
            return;
        }

        // Prepare data for submission
        const formData = {

        };

        try {
            // const response = await axios.post('https://yourapi.com/leaves', formData);
            // console.log('Response:', response.data);
            setStartDate('');
            setEndDate('');
            setStartTime('');
            alert('Contract submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to submit the application. Please try again.');
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Contract Form</h2>

                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="client-name" className="block text-md font-medium leading-6 text-gray-900">
                            Client Name
                        </label>
                        <div className="mt-2">
                            <select
                                id="client-name"
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.clientId} value={client.name}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="client-property" className="block text-md font-medium leading-6 text-gray-900">
                            Client Property
                        </label>
                        <div className="mt-2">
                            <select
                                id="client-property"
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Property</option>
                                {properties.map((property) => (
                                    <option key={property.id} value={property.name}>
                                        {property.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <label htmlFor="period" className="block text-md font-medium leading-6 text-gray-900">
                    Package Details
                </label>
                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="package-type" className="block text-sm font-medium text-gray-700">
                            Property Type
                        </label>
                        <div className="mt-2">
                            <select
                                id="property-type"
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Package Type</option>
                                {packages.map((pkg, index) => (
                                    <option key={index} value={pkg}>
                                        {pkg}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <label htmlFor="package-freq" className="block text-sm font-medium text-gray-700">
                            Package Frequency
                        </label>
                        <div className="mt-2">
                            <select
                                id="property-freq"
                                value={selectedFrequency}
                                onChange={(e) => setSelectedFrequency(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Package Frequency</option>
                                {frequency.map((pkg, index) => (
                                    <option key={index} value={pkg}>
                                        {pkg}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <label htmlFor="period" className="block text-md font-medium leading-6 text-gray-900">
                        Contract Duration
                    </label>
                    <div className="mt-2 space-y-4">
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
                                <label className="block text-sm font-medium text-gray-700">Preferred Session Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    min={minTime}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Error message display */}
                {error && <div className="text-red-600">{error}</div>}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Button label="Submit" type="submit" />
            </div>
        </form>
    );
}
