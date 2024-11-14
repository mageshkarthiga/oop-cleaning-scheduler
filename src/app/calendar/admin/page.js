"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ProgressSpinner } from "primereact/progressspinner";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarView() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get('http://localhost:8080/api/v0.1/cleaningSession/calendar-view');
                const data = response.data;
                const formattedEvents = data.map(cleaningSession => ({
                    id: cleaningSession.cleaningSessionId.toString(),
                    title: `Session - ${cleaningSession.clientName.split(' ')[0]} ${cleaningSession.clientName.split(' ')[1].charAt(0)}.`,
                    start: `${cleaningSession.sessionStartDate}T${cleaningSession.sessionStartTime}`,
                    end: `${cleaningSession.sessionEndDate}T${cleaningSession.sessionEndTime}`,
                    backgroundColor: cleaningSession.planningStage === "EMBER" 
                        ? "orange" 
                        : cleaningSession.planningStage === "GREEN" 
                        ? "green" 
                        : "red",
                    url: `/session/${cleaningSession.cleaningSessionId}`
                }));
                setEvents(formattedEvents);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEvents();
    }, []);

    if (loading) return <ProgressSpinner className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50' />;

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mx-20 mb-4">Calendar</h1>
            <div className="container mx-auto p-4 card border-4">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay'
                    }}
                    fixedWeekCount={false}
                />
            </div>
        </div>
    )
}