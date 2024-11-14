"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Toast } from 'primereact/toast';

export default function CreateContractForm() {
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('');
    const [loading, setLoading] = useState(false);

    const [clientsWithProperties, setClientsWithProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [frequency] = useState(['WEEKLY', 'BIWEEKLY']);

    const startTimes = ['09:00', '13:00', '18:00'];
    const toast = useRef(null);
    const router = useRouter();

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    today.setHours(today.getHours());

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
        const clientSiteId = e.target.value;
        setSelectedProperty(clientSiteId);

        // Auto-select property type and number of rooms based on selected clientSiteId
        const property = filteredProperties.find(property => property.clientSiteId === parseInt(clientSiteId));
        if (property) {
            setPropertyType(property.propertyType);
            setNumberOfRooms(property.numberOfRooms.toString());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient || !selectedProperty || !startDate || !endDate || !startTime || !selectedFrequency) {
            setError('Please select a client, package type, property, and provide contract duration.');
            return;
        }
        setError('');

        if (startDate >= endDate) {
            setError('Start date must be before the end date.');
            return;
        }
        setLoading(true);

        // Prepare data for submission
        const formData = {
            clientId: parseInt(selectedClient),
            clientSiteId: parseInt(selectedProperty),
            contractStartDate: startDate,
            contractEndDate: endDate,
            sessionStartTime: startTime,
            frequency: selectedFrequency,
        };
        console.log(formData, selectedProperty)

        try {
            const response = await axios.post('http://localhost:8080/api/v0.1/contract/add-contract/', null,
                {
                    params: formData
                }
            );
            console.log('Response:', response.data);
            if (response.status === 202) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Contract created successfully!', life: 7000 });
                // Reset form fields
            }
            setLoading(false);
            // Delay the router.push call
            setTimeout(() => {
                router.push('/contract/summary');
            }, 6000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoading(false);
            setError('Failed to submit the application. Please try again.');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create contract. Please try again.', life: 4000 });
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <Toast ref={toast} />
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Create Contract For Client</h2>

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
                                {filteredProperties.map((property) => (
                                    <option key={property.clientSiteId} value={property.clientSiteId}>
                                        {`${property.unitNumber}, ${property.streetAddress}, Singapore ${property.postalCode}`}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Time</label>
                                <select
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Start Time</option>
                                    {startTimes.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    label="Create Contract"
                    className="mt-6 p-button-primary"
                    loading={loading}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </form>
    );
}
