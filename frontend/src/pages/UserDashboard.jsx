import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBadge from "../components/NotificationBadge";
import Modal from "../components/Modal";
import CommunicationCalendar from "../components/Calendar"
import {
    getCompanies,
    getOverdueCommunications,
    getTodaysCommunications,
    logCommunication,
} from "../services/communicationService";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const UserDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [overdueCount, setOverdueCount] = useState(0);
    const [dueTodayCount, setDueTodayCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [communicationType, setCommunicationType] = useState("");
    const [communicationDate, setCommunicationDate] = useState("");
    const [communicationNotes, setCommunicationNotes] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesData = await getCompanies(token);
                const today = new Date();

                let overdue = 0;
                let dueToday = 0;

                const updatedCompanies = companiesData.map((company) => {
                    const baseDate = company.lastCommunications.length > 0
                        ? new Date(company.lastCommunications[0].date)
                        : new Date(company.createdAt || today);

                    const nextCommunicationDate = new Date(baseDate);
                    nextCommunicationDate.setDate(
                        nextCommunicationDate.getDate() + company.communicationPeriodicity
                    );

                    const isDueToday = nextCommunicationDate.toDateString() === today.toDateString();
                    const isOverdue = nextCommunicationDate < today && !isDueToday;

                    if (isDueToday) dueToday++;
                    if (isOverdue) overdue++;

                    return {
                        ...company,
                        nextCommunication: {
                            date: nextCommunicationDate,
                            type: company.lastCommunications[0]?.method || "Default Periodicity",
                        },
                        isOverdue,
                        isDueToday,
                    };
                });


                setCompanies(updatedCompanies);
                setOverdueCount(overdue);
                setDueTodayCount(dueToday);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleOpenModal = (company) => {
        setSelectedCompany(company);
        setCommunicationType("");
        setCommunicationDate("");
        setCommunicationNotes("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleSubmitCommunication = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                companyId: selectedCompany._id,
                type: communicationType,
                date: communicationDate,
                notes: communicationNotes,
            };

            await logCommunication(payload, token);

            const updatedCompanies = companies.map((company) => {
                if (company._id === selectedCompany._id) {
                    const newLastCommunication = {
                        method: communicationType,
                        date: communicationDate,
                        notes: communicationNotes,
                    };

                    const updatedLastCommunications = [
                        newLastCommunication,
                        ...company.lastCommunications,
                    ].slice(0, 5);

                    const nextCommunicationDate = new Date(communicationDate);
                    nextCommunicationDate.setDate(
                        nextCommunicationDate.getDate() + (company.communicationPeriodicity || 14)
                    );

                    const isDueToday =
                        nextCommunicationDate.toDateString() === new Date().toDateString();
                    const isOverdue = nextCommunicationDate < new Date() && !isDueToday;

                    return {
                        ...company,
                        lastCommunications: updatedLastCommunications,
                        nextCommunication: {
                            date: nextCommunicationDate,
                            type: communicationType,
                        },
                        isOverdue,
                        isDueToday,
                    };
                }
                return company;
            });

            setCompanies(updatedCompanies);

            const overdue = updatedCompanies.filter((company) => company.isOverdue).length;
            const dueToday = updatedCompanies.filter((company) => company.isDueToday).length;

            setOverdueCount(overdue);
            setDueTodayCount(dueToday);

            alert("Communication logged successfully!");
            handleCloseModal();
        } catch (error) {
            console.error("Error logging communication:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.clear(); // Clears all localStorage keys
        navigate("/");
    };

    const handleNavigateToCalendar = () => {
        navigate("/user/calendar", { state: { companies } }); // Pass companies as state
    };

    return (
        <div className="p-4 ">
            <div className="flex justify-between items-center mb-6 mt-2 font-poppins p-3">
                <h1 className="text-4xl font-bold">User Dashboard</h1>

                <div className="flex space-x-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleNavigateToCalendar}
                    >
                        Calendar
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>


            {/* Notifications */}
            <div className="flex justify-center items-center mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 w-11/12 md:w-8/12 lg:w-6/12">
                    <NotificationBadge count={overdueCount} label="Overdue Tasks" color="red" />
                    <NotificationBadge count={dueTodayCount} label="Today's Tasks" color="yellow" />
                </div>
            </div>


            {/* Company Grid */}
            <div className="mb-6 font-inter p-3">
                <h2 className="text-2xl font-semibold mb-4">Companies</h2>
                <table className="w-full border-collapse border border-slate-900">
                    <thead>
                        <tr className="bg-teal-300 ">
                            <th className="border border-slate-900 px-4 py-5">Company Name</th>
                            <th className="border border-slate-900 px-4 py-5">Last Communications</th>
                            <th className="border border-slate-900 px-4 py-5">Next Communication</th>
                            <th className="border border-slate-900 px-4 py-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => {
                            const rowClass = company.isDueToday
                                ? "bg-yellow-200"
                                : company.isOverdue
                                    ? "bg-red-200"
                                    : "";

                            return (
                                <tr key={company._id} className={`${rowClass} transition`}>
                                    <td className="border border-slate-900 px-4 py-2">{company.name}</td>
                                    <td
                                        className="border border-slate-900 px-4 py-2"
                                        data-tooltip-id={`tooltip-${company._id}`}
                                        data-tooltip-content={
                                            company.lastCommunications.length > 0
                                                ? company.lastCommunications
                                                    .map((comm) => comm.notes || "No notes")
                                                    .join(", ")
                                                : "No communication logged"
                                        }
                                    >
                                        {company.lastCommunications.length > 0
                                            ? company.lastCommunications
                                                .slice(0, 5)
                                                .map(
                                                    (comm) =>
                                                        `${comm.method} (${new Date(comm.date).toLocaleDateString()})`
                                                )
                                                .join(", ")
                                            : "No communication logged"}
                                    </td>
                                    <td className="border border-slate-900 px-4 py-2">
                                        {company.nextCommunication
                                            ? `${company.nextCommunication.type} (${new Date(
                                                company.nextCommunication.date
                                            ).toLocaleDateString()})`
                                            : "N/A"}
                                    </td>
                                    <td className="border border-slate-900 px-4 py-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => handleOpenModal(company)}
                                        >
                                            Log Communication
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Tooltip */}
            {companies.map((company) => (
                <ReactTooltip key={company._id} id={`tooltip-${company._id}`} />
            ))}

            {/* Calendar
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                <CommunicationCalendar
                    communications={companies.flatMap((company) =>
                        company.lastCommunications.map((comm) => ({
                            date: comm.date,
                            type: comm.method,
                            notes: comm.notes,
                        }))
                    )}
                />
            </div> */}



            {/* Modal */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <h2>Log Communication for {selectedCompany?.name}</h2>
                    <form onSubmit={handleSubmitCommunication}>
                        <div className="mb-4">
                            <label className="block">Type</label>
                            <select
                                className="w-full px-2 py-1 border rounded"
                                value={communicationType}
                                onChange={(e) => setCommunicationType(e.target.value)}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Email">Email</option>
                                <option value="Phone Call">Phone Call</option>
                                <option value="LinkedIn Post">LinkedIn Post</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block">Date</label>
                            <input
                                type="date"
                                className="w-full px-2 py-1 border rounded"
                                value={communicationDate}
                                onChange={(e) => setCommunicationDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Notes</label>
                            <textarea
                                rows="3"
                                className="w-full px-2 py-1 border rounded"
                                value={communicationNotes}
                                onChange={(e) => setCommunicationNotes(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default UserDashboard;
