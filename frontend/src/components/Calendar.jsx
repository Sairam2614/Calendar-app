import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarStyles.css";

const CommunicationCalendar = ({ communications, onDateClick }) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={communications.map((comm) => ({
                title: `${comm.companyName} - ${comm.type}`, // Display company name and method
                date: new Date(comm.date).toISOString().split("T")[0], // Ensure proper date format
                textColor : "#000"
            }))}
            dateClick={(info) => {
                if (onDateClick) {
                    onDateClick(info.dateStr); // Trigger callback when a date is clicked
                }
            }}
            eventClick={(info) => {
                info.jsEvent.preventDefault(); // Prevent default navigation
                if (onDateClick) {
                    onDateClick(info.event.startStr); // Trigger callback for event clicks
                }
            }}
            eventDisplay="block" // Ensure events display correctly
            editable={false} // Disable dragging of events
        />
    );
};

export default CommunicationCalendar;
