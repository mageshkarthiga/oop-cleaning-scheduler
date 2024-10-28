"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import Calendar from '@toast-ui/react-calendar';
import { useRouter } from 'next/navigation';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default function CalendarPage() {
    const calendarRef = useRef();
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        // Fetch events from an API
        async function fetchEvents() {
            try {
                const response = await fetch('http://localhost:8080/api/v0.1/shift/worker/1');
                const data = await response.json();
                console.log(data);
                const formattedEvents = data.map(event => ({
                    id: event.shiftId.toString(),
                    calendarId: 'G',
                    title: event.sessionDescription || 'Untitled Session',
                    category: 'time',
                    start: `${event.sessionStartDate}T${event.sessionStartTime}`,
                    end: `${event.sessionEndDate}T${event.sessionEndTime}`
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEvents();

        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.on('afterRender', updateMonthYear);
    }, []);

    const updateMonthYear = () => {
        const calendarInstance = calendarRef.current.getInstance();
        const currentDate = calendarInstance.getDate();
        setCurrentDate(currentDate);
    };

    const handlePrevMonth = () => {
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.prev();
        updateMonthYear();
    };

    const handleNextMonth = () => {
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.next();
        updateMonthYear();
    };

    const handleChangeView = (viewType) => {
        setCurrentView(viewType);
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.changeView(viewType, true);
        updateMonthYear();
    };

    const handleEventClick = (event) => {
        router.push(`/some-path/${event.id}`);
    };

    const monthTemplate = (date) => {
        return new Intl.DateTimeFormat('en-SG', { year: 'numeric', month: 'long' }).format(date);
    };

    const calendars = [
        {
            id: 'G',
            name: 'Green Calendar',
            color: '#4CAF50',
            backgroundColor: '#A5D6A7',
            dragBackgroundColor: '#81C784',
            borderColor: '#388E3C'
        },
        {
            id: 'R',
            name: 'Red Calendar',
            color: '#D32F2F',
            backgroundColor: '#FFCDD2',
            dragBackgroundColor: '#EF5350',
            borderColor: '#C62828'
        },
        {
            id: 'Y',
            name: 'Yellow Calendar',
            color: '#FFEB3B',
            backgroundColor: '#FFF176',
            dragBackgroundColor: '#FFCA28',
            borderColor: '#FBC02D'
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mx-10">Calendar</h1>
            <br />
            <div className="sm:container border-4 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <Button label="Previous Month" onClick={handlePrevMonth} icon="pi pi-chevron-left" severity="info" text />
                    <h2 className="text-xl text-center font-bold">{monthTemplate(currentDate)}</h2>
                    <Button label="Next Month" onClick={handleNextMonth} icon="pi pi-chevron-right" severity="info" text />
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                    <Button label="Day View" severity="help" onClick={() => handleChangeView('day')} />
                    <Button label="Week View" severity="help" onClick={() => handleChangeView('week')} />
                    <Button label="Month View" severity="help" onClick={() => handleChangeView('month')} />
                </div>
                <Calendar
                    ref={calendarRef}
                    view={currentView}
                    month={{
                        dayNames: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                        isAlways6Weeks: false,
                    }}
                    calendars={calendars}
                    events={events}
                    // useDetailPopup={true}
                    onClickEvent={handleEventClick} // Add event click handler
                />
            </div>
        </div>
    );
}
