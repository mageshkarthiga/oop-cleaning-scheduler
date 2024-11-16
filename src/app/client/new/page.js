"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

export default function CreateClientForm() {
    const [selectedNoOfRooms, setSelectedNoOfRooms] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');
    const [error, setError] = useState('');
    const [roomOptions, setRoomOptions] = useState([]);
    const [clientName, setClientName] = useState('');
    const [clientPhoneNumber, setClientPhoneNumber] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const propertyTypes = {
        HDB: ['3-Room', '4-Room'],
        CONDOMINIUM: ['2-Room and Below', '3-Room']
    };
    const router = useRouter();
    const toast = useRef(null);

    const [place, setPlace] = useState(null);
    const addressInputRef = useRef(null);
    const [postalCode, setPostalCode] = useState('');

    const loadGoogleMapsAPI = () => {
        // Check if the script is already loaded
        if (!document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
            // Create the script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initializeAutocomplete`;
            script.async = true;
            script.defer = true;  // Ensures that the script will not block rendering
            script.onerror = () => {
                console.error('Failed to load Google Maps API');
                setError('Failed to load Google Maps API. Please try again later.');
            };
            document.head.appendChild(script);
        }
    };

    // This function will be called once the Google Maps API script is loaded
    window.initializeAutocomplete = () => {
        if (window.google && window.google.maps) {
            const googleMaps = window.google.maps;
            const autocomplete = new googleMaps.places.Autocomplete(addressInputRef.current, {
                types: ['geocode'],
                componentRestrictions: { country: 'SG' }
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    setPlace(place);
                    console.log('Selected address:', place);
                    // Extract postal code from address components
                    const addressComponents = place.address_components;
                    const postalCodeComponent = addressComponents.find(component => component.types.includes('postal_code'));
                    if (postalCodeComponent) {
                        setPostalCode(postalCodeComponent.long_name);
                    }
                }
            });
        } else {
            // Retry initialization if google.maps is not yet available
            setTimeout(window.initializeAutocomplete, 500);
        }
    };


    useEffect(() => {
        loadGoogleMapsAPI();
    }, []);

    const handlePropertyTypeChange = (e) => {
        const propertyType = e.target.value;
        setSelectedPropertyType(propertyType);

        if (propertyTypes[propertyType]) {
            setRoomOptions(propertyTypes[propertyType]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPropertyType || !selectedNoOfRooms || !clientName || !place || !postalCode) {
            setError('Please fill in all required fields.');
            return;
        }

        if (clientPhoneNumber.length !== 8) {
            setError('Phone number must be 8 digits long.');
            return;
        }

        if (postalCode.length !== 6) {
            setError('Postal code must be 6 digits long.');
            return;
        }

        setError('');

        // Prepare data for submission
        const clientData = {
            name: clientName,
            phone: clientPhoneNumber,
            homeAddress: place.name,
            postalCode: postalCode,
            unitNumber: unitNumber,
            numberOfRooms: parseInt(selectedNoOfRooms.split('-')[0]),
            propertyType: selectedPropertyType
        };
        setLoading(true);
        try {
            // Make API call to create the client
            const clientResponse = await axios.post('http://localhost:8080/api/v0.1/client/add-client/', null,
                {
                    params: clientData
                }
            );
            console.log('Client Response:', clientResponse);

            if (clientResponse.status === 202) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Client created!', life: 4000 });

                // Search for the client by name to get the clientId
                const searchResponse = await axios.get(`http://localhost:8080/api/v0.1/client/${clientName}`);
                console.log('Search Response:', searchResponse);

                if (searchResponse.status === 200) {
                    const clientId = searchResponse.data.clientId;

                    // Prepare data for client site creation
                    const clientSiteData = {
                        clientId: clientId,
                        streetAddress: place.name,
                        postalCode: postalCode,
                        unitNumber: unitNumber,
                        numberOfRooms: parseInt(selectedNoOfRooms.split('-')[0]),
                        propertyType: selectedPropertyType
                    };

                    // Make API call to add the client site
                    const clientSiteResponse = await axios.post(`http://localhost:8080/api/v0.1/client/${clientId}/add-client-site/`, null,
                        {
                            params: clientSiteData
                        }
                    );
                    console.log('Client Site Response:', clientSiteResponse);

                    if (clientSiteResponse.status === 202) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Client and client site created successfully!', life: 4000 });
                        setLoading(false);

                        // Delay the router.push call
                        setTimeout(() => {
                            router.push('/client/summary');
                        }, 3000); // 3 seconds delay
                    }
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoading(false);
            setError('Failed to submit the application. Please try again.');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create client and client site. Please try again.', life: 4000 });
        }
    };

    return (
        <form className="m-4 border-4 p-4" onSubmit={handleSubmit}>
            <div className="space-y-6">
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Add New Client</h2>

                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="client-name" className="block text-md font-medium leading-6 text-gray-900">
                            Client Name
                        </label>
                        <div className="mt-2">
                            <input type="text" id="client-name" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="client-phone" className="block text-md font-medium leading-6 text-gray-900">
                            Client Phone Number
                        </label>
                        <div className="mt-2">
                            <input type="number" id="client-phone" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={clientPhoneNumber} onChange={(e) => setClientPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                </div>

                <label htmlFor="client-prop" className="block text-md font-medium leading-6 text-gray-900">
                    Client Property Address
                </label>
                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="unit-number" className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Number
                        </label>
                        <input type="text" id="unit-number" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Enter unit no." value={unitNumber}
                            onChange={(e) => setUnitNumber(e.target.value)} />

                    </div>
                    <div className="w-1/2">
                        <label htmlFor="street-name" className="block text-sm font-medium text-gray-700 mb-2">
                            Street Name
                        </label>
                        <input
                            ref={addressInputRef}
                            type="text"
                            id="street-name"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Enter address"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                            Postal Code
                        </label>
                        <div className="mt-2">
                            <input
                                type='number'
                                id="postal-code"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="Enter postal code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                    </div>
                </div>


                <label className="block text-md font-medium leading-6 text-gray-900">
                    Property Details
                </label>
                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-2">
                            Property Type
                        </label>
                        <select
                            id="property-type"
                            value={selectedPropertyType}
                            onChange={handlePropertyTypeChange}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        >
                            <option value="" disabled>Select Property Type</option>
                            <option value="HDB">HDB</option>
                            <option value="CONDOMINIUM">CONDOMINIUM</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="no-of-rooms" className="block text-sm font-medium text-gray-700">
                            Number of Rooms
                        </label>
                        <div className="mt-2">
                            <select
                                id="no-of-rooms"
                                value={selectedNoOfRooms}
                                onChange={(e) => setSelectedNoOfRooms(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="" disabled>Select No. of Rooms</option>
                                {roomOptions.map((room, index) => (
                                    <option key={index} value={room}>
                                        {room}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <Button
                    type="submit"
                    label="Add Client"
                    className="mt-6 p-button-primary"
                    loading={loading}
                />
            </div>
            <Toast ref={toast} position="top-right" />
        </form>
    );
}
