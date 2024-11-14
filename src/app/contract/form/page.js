"use client";
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';

export default function CreateContractForm() {
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('');

    const [clientsWithProperties, setClientsWithProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [roomOptions, setRoomOptions] = useState([]);
    const [frequency] = useState(['Weekly', 'Bi-Weekly']);

    const propertyTypes = {
        HDB: ['3-Room', '4-Room'],
        CONDOMINIUM: ['2-Room and Below', '3-Room']
    };

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    today.setHours(today.getHours());
    const minTime = today.toTimeString().split(' ')[0].slice(0, 5);

    // Fetch clients and their properties
    const fetchClientsWithProperties = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v0.1/client/get-clients-with-client-sites');
            console.log('Response:', response.data);
            setClientsWithProperties(response.data);
        } catch (error) {
            console.error('Error fetching clients and properties:', error);
            setError('Failed to load clients and properties. Please try again later.');
        }
    };

    useEffect(() => {
        fetchClientsWithProperties();
    }, []);

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClient(clientId);
        setSelectedProperty('');
        setPropertyType('');
        setNumberOfRooms('');

        // Filter properties based on the selected client ID and format the property details
        const clientProperties = clientsWithProperties
            .find(client => client.clientId === parseInt(clientId))?.clientSites || [];

        setFilteredProperties(clientProperties);
    };

    const handlePropertyChange = (e) => {
        const selectedPropertyAddress = e.target.value;
        setSelectedProperty(selectedPropertyAddress);

        // Auto-select property type and number of rooms based on selected address
        const property = filteredProperties.find(property => property.streetAddress === selectedPropertyAddress);
        if (property) {
            setPropertyType(property.propertyType);
            setNumberOfRooms(property.numberOfRooms.toString());
        }
    };

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
            client: selectedClient,
            package: selectedPackage,
            property: selectedProperty,
            frequency: selectedFrequency,
            startDate,
            endDate,
            startTime,
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
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Create Contract For Existing Client</h2>

                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="client-name" className="block text-md font-medium leading-6 text-gray-900">
                            Client Name
                        </label>
                        <div className="mt-2">
                            <select
                                id="client-name"
                                value={selectedClient}
                                onChange={handleClientChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Client</option>
                                {clientsWithProperties.map((client) => (
                                    <option key={client.clientId} value={client.clientId}>
                                        {client.clientName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="client-prop" className="block text-md font-medium leading-6 text-gray-900">
                            Existing Client Property
                        </label>
                        <div className="mt-2">
                            <select
                                id="client-prop"
                                value={selectedProperty}
                                onChange={handlePropertyChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select Existing Property</option>
                                {filteredProperties.map((property, index) => (
                                    <option key={index} value={property.streetAddress}>
                                        {`${property.streetAddress}, ${property.postalCode}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <label htmlFor="package-details" className="block text-md font-medium leading-6 text-gray-900">
                    Package Details
                </label>
                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-2">
                            Property Type
                        </label>
                        <input
                            type="text"
                            id="property-type"
                            value={propertyType}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="no-of-rooms" className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Rooms
                        </label>
                        <input
                            type="text"
                            id="no-of-rooms"
                            value={numberOfRooms}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="package-freq" className="block text-sm font-medium text-gray-700">
                            Package Frequency
                        </label>
                        <div className="mt-2">
                            <select
                                id="package-freq"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={minDate}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || minDate}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    min={minTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    label="Create Contract"
                    className="mt-6 p-button-primary"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </form>
    );
}
