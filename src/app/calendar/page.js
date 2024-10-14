"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

export default function CalendarPage() {

    const calendarRef = useRef();
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
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

    const monthTemplate = (date) => {
        return new Intl.DateTimeFormat('en-SG', { year: 'numeric', month: 'long' }).format(date);
    };

    return (
        <div>
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
                    calendars={[]} 
                    events={[]} 
                />
            </div>
        </div>
    );
}
