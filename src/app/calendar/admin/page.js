"use client";
import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarView() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch('http://localhost:8080/api/v0.1/cleaningSession');
                const data = await response.json();
                const formattedEvents = data.map(cleaningSession => ({
                    id: cleaningSession.cleaningSessionId.toString(), 
                    title: cleaningSession.sessionDescription,
                    start: `${cleaningSession.sessionStartDate}T${cleaningSession.sessionStartTime}`,
                    end: `${cleaningSession.sessionEndDate}T${cleaningSession.sessionEndTime}`,
                    backgroundColor: cleaningSession.workersBudgeted === 0 ? "red" : "green",
                    url: `/session/${cleaningSession.cleaningSessionId}`
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEvents();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mx-10 mb-4">Calendar</h1>
            <div className="container border-4 mx-auto p-4">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    }}
                    fixedWeekCount={false}
                />
                <br/>
                <Button label="Add Session" icon="pi pi-plus-circle" iconPos="right" severity="help"/>
            </div>
        </div>
    )
}