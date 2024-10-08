"use client";
import React, { useState, useRef } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

export default function CalendarPage() {
    const items = [
        { label: 'Calendar', icon: 'pi pi-calendar-clock' },
        { label: 'MC Submitted', icon: 'pi pi-file-arrow-up' },
        { label: 'Products', icon: 'pi pi-list' },
        { label: 'Messages', icon: 'pi pi-inbox' }
    ];

    const calendarRef = useRef();
    const [currentView, setCurrentView] = useState('month');

    const monthTemplate = (date) => {
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `<span>${monthName} ${year}</span>`;
    }

    const handlePrevMonth = () => {
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.prev();
    };

    const handleNextMonth = () => {
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.next();
    };

    const handleChangeView = (viewType) => {
        setCurrentView(viewType);
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.changeView(viewType, true);
        console.log(calendarInstance.getOptions());
    };

    return (
        <div>
            <div className="container">
                <TabMenu model={items} />
            </div>
            <br />
            <div className="sm:container border-4">
                <div className="flex justify-between mb-4">
                    <Button label="Previous Month" onClick={handlePrevMonth} icon="pi pi-chevron-left" severity="info" text />
                    
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
                        title: monthTemplate
                    }}
                    calendars={[]} 
                    events={[]} 
                />
            </div>
        </div>
    );
}
