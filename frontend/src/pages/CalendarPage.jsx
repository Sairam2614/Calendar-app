import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CommunicationCalendar from "../components/Calendar";
import "../components/CalendarStyles.css";

const CalendarPage = () => {
    const location = useLocation();
    const { companies } = location.state || { companies: [] };

    const [selectedDate, setSelectedDate] = useState(null);
    const [communicationsForDate, setCommunicationsForDate] = useState([]);

    const allCommunications = companies.flatMap((company) => [
        ...company.lastCommunications.map((comm) => ({
            companyName: company.name,
            date: comm.date,
            type: comm.method,
            notes: comm.notes,
        })),
        {
            companyName: company.name,
            type: "Scheduled",
            date: company.nextCommunication?.date,
        },
    ]);

    const handleDateClick = (date) => {
        const filteredCommunications = allCommunications.filter(
            (comm) =>
                new Date(comm.date).toLocaleDateString() ===
                new Date(date).toLocaleDateString()
        );
        setSelectedDate(date);
        setCommunicationsForDate(filteredCommunications);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Calendar</h1>
            <div className="flex">
                {/* Calendar Section */}
                <div className="w-3/4 pr-4">
                    <h2 className="text-xl font-semibold mb-4">Scheduled Communications</h2>
                    <CommunicationCalendar
                        communications={allCommunications.map((comm) => ({
                            companyName: comm.companyName,
                            type: comm.type,
                            date: comm.date,
                        }))}
                        onDateClick={handleDateClick}
                    />
                </div>

                {/* Communications Info Section */}
                <div className="w-1/4 pl-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Communications for {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Selected Date"}
                    </h2>
                    <div className="overflow-y-auto max-h-screen">
                        {communicationsForDate.length > 0 ? (
                            <ul className="space-y-4">
                                {communicationsForDate.map((comm, index) => (
                                    <li
                                        key={index}
                                        className="p-4 border rounded shadow-sm bg-gray-100"
                                    >
                                        <p className="text-sm text-gray-500">
                                            <strong>{comm.companyName}</strong>
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Type:</strong> {comm.type}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Notes:</strong> {comm.notes || "No notes"}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No communications found for this date.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
