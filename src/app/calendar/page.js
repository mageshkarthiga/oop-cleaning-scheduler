"use client";
import React from 'react';
import { useRef, useEffect } from 'react';
import Calendar from '@toast-ui/react-calendar'; 
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default function CalendarPage() {
    const calendarRef = useRef(null);

    const calendars = [{ id: 'cal1', name: 'Personal', backgroundColor: '#ffccff'},{ id: 'cal2', name: 'Work', backgroundColor: '#ccffcc' }];

    const initialEvents = [
        {
            id: '1',
            calendarId: 'cal1',
            title: 'Lunch',
            category: 'time',
            start: '2024-10-28T12:00:00',
            end: '2024-10-28T13:30:00'
        },
        {
            id: '2',
            calendarId: 'cal2',
            title: 'Team Meeting',
            category: 'time',
            start: '2024-10-28T15:00:00',
            end: '2024-10-28T16:00:00'
        },
    ];
    
    const onAfterRenderEvent = (event) => {
        console.log(event.title);
    };

    useEffect(() => {
        const calendarInstance = calendarRef.current.getInstance(); 
        if (calendarInstance) {
            calendarInstance.setOptions({
                useFormPopup: true,
                useDetailPopup: true,
            });
        }
    }, []);

    return (
        <div>
            <Calendar
                ref={calendarRef}
                height="500px"
                view="month"
                month={{
                    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    visibleWeeksCount: 5,
                }}
                calendars={calendars}
                events={initialEvents}
                onAfterRenderEvent={onAfterRenderEvent}
            />
        </div>
    );
}