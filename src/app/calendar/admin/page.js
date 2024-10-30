"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarView() {
    const [events, setEvents] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch('http://localhost:8080/api/v0.1/cleaningSession');
                const data = await response.json();
                console.log(data);
                // const formattedEvents = data.map(event => ({
                //     id: event.shiftId.toString(),
                //     title: event.sessionDescription || 'Untitled Session',
                //     start:`${event.sessionStartDate}T${event.sessionStartTime}`,
                //     backgroundColor:'green'
                // }));
                // setEvents(formattedEvents);
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
            </div>
        </div>
    )
}