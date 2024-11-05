"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

export default function CalendarView() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get('http://localhost:8080/api/v0.1/shift/worker/2');
                const data = response.data;
                console.log(data);
                const formattedEvents = data.map(event => ({
                    id: event.shiftId.toString(),
                    title: 'Shift ' + event.shiftId,
                    start:`${event.sessionStartDate}T${event.sessionStartTime}`,
                    end:`${event.sessionEndDate}T${event.sessionEndTime}`,
                    backgroundColor:"red",
                    url: `/shift/${event.shiftId}`
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
            </div>
        </div>
    )
}