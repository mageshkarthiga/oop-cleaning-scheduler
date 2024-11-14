"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';

export default function CreateClientForm() {
    const [selectedNoOfRooms, setselectedNoOfRooms] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [error, setError] = useState('');
    const [roomOptions, setRoomOptions] = useState([]);
    const [clientName, setClientName] = useState('');
    const propertyTypes = {
        HDB: ['3-Room', '4-Room'],
        CONDOMINIUM: ['2 Bedrooms and Below', '3 Bedrooms']
    };

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
        setSelectedProperty(propertyType);

        if (propertyTypes[propertyType]) {
            setRoomOptions(propertyTypes[propertyType]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!selectedProperty || !selectedNoOfRooms || !clientName || !place || !postalCode) {
            setError('Please fill in all required fields.');
            return;

        }
        setError('');

        // Prepare data for submission
        const formData = {
            client: selectedClient,
            property: selectedProperty,
            address: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        try {
            // Make API call to submit the form data
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
                <h2 className="text-xl font-bold leading-7 text-gray-900 mb-5">Add New Client</h2>

                <div className='flex items-center gap-4'>
                    <div className="w-full">
                        <label htmlFor="client-name" className="block text-md font-medium leading-6 text-gray-900">
                            Client Name
                        </label>
                        <div className="mt-2">
                            <input type="text" id="client-name" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={clientName} onChange={(e) => setClientName(e.target.value)}/>
                        </div>
                    </div>
                </div>

                <label htmlFor="client-prop" className="block text-md font-medium leading-6 text-gray-900">
                    Client Property Address
                </label>
                <div className='flex items-center gap-4'>
                    <div className="w-1/2">
                        <label htmlFor="unit-number" className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Number
                        </label>
                        <input type="text" id="unit-number" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Enter unit no."/>

                    </div>
                    <div className="w-1/2">
                        <label htmlFor="street-name" className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label htmlFor="package-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type
                        </label>
                        <select
                            id="package-type"
                            value={selectedProperty}
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
                                onChange={(e) => setselectedNoOfRooms(e.target.value)}
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
                    label="Add Client &nbsp;"
                    className="mt-6 p-button-primary"
                    icon="pi pi-plus-circle"
                    iconPos='right'
                />
            </div>
        </form>
    );
}
