import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import {
    getCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
} from "../services/companyService.js";
import {
    getCommunicationMethods,
    addMethod,
    updateMethod,
    deleteMethod,
} from "../services/methodService.js";

const AdminDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [methods, setMethods] = useState([]);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const token = localStorage.getItem("token"); // Admin's authentication token
    const navigate = useNavigate();

    // Fetch companies and methods on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesData = await getCompanies(token);
                const methodsData = await getCommunicationMethods(token);

                setCompanies(companiesData.sort((a, b) => a.name.localeCompare(b.name))); // Sort companies alphabetically
                setMethods(methodsData.sort((a, b) => a.sequence - b.sequence)); // Sort methods by sequence
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);

    // Save or update a company
    const handleSaveCompany = async (companyData) => {
        try {
            if (selectedCompany) {
                const updatedCompany = await updateCompany(selectedCompany._id, companyData, token);
                setCompanies(companies.map((c) => (c._id === selectedCompany._id ? updatedCompany : c)));
                alert("Company updated successfully!");
            } else {
                const newCompany = await addCompany(companyData, token);
                setCompanies([...companies, newCompany]);
                alert("Company added successfully!");
            }
            setIsCompanyModalOpen(false);
            setSelectedCompany(null);
        } catch (error) {
            console.error("Error saving company:", error);
        }
    };

    // Delete a company
    const handleDeleteCompany = async (companyId) => {
        try {
            await deleteCompany(companyId, token);
            setCompanies(companies.filter((c) => c._id !== companyId));
            alert("Company deleted successfully!");
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    // Save or update a method
    const handleSaveMethod = async (methodData) => {
        try {
            if (selectedMethod) {
                const updatedMethod = await updateMethod(selectedMethod._id, methodData, token);
                setMethods(methods.map((m) => (m._id === selectedMethod._id ? updatedMethod : m)));
                alert("Method updated successfully!");
            } else {
                const newMethod = await addMethod(methodData, token);
                setMethods([...methods, newMethod]);
                alert("Method added successfully!");
            }
            setIsMethodModalOpen(false);
            setSelectedMethod(null);
        } catch (error) {
            console.error("Error saving method:", error);
        }
    };

    // Delete a method
    const handleDeleteMethod = async (methodId) => {
        try {
            await deleteMethod(methodId, token);
            setMethods(methods.filter((m) => m._id !== methodId));
            alert("Method deleted successfully!");
        } catch (error) {
            console.error("Error deleting method:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.clear(); // Clears all localStorage keys
        navigate("/"); // Redirect to login page
    };

    return (
        <div className="p-4">
            {/* Header with Logout Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Company Management */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Company Management</h2>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
                    onClick={() => {
                        setSelectedCompany(null);
                        setIsCompanyModalOpen(true);
                    }}
                >
                    Add Company
                </button>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Location</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company._id}>
                                <td className="border border-gray-300 px-4 py-2">{company.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{company.location || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                        onClick={() => {
                                            setSelectedCompany(company);
                                            setIsCompanyModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDeleteCompany(company._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Communication Method Management */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Communication Method Management</h2>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
                    onClick={() => {
                        setSelectedMethod(null);
                        setIsMethodModalOpen(true);
                    }}
                >
                    Add Method
                </button>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Sequence</th>
                            <th className="border border-gray-300 px-4 py-2">Mandatory</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {methods.map((method) => (
                            <tr key={method._id}>
                                <td className="border border-gray-300 px-4 py-2">{method.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{method.description || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2">{method.sequence}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {method.mandatory ? "Yes" : "No"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                        onClick={() => {
                                            setSelectedMethod(method);
                                            setIsMethodModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDeleteMethod(method._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Company Modal */}
            {isCompanyModalOpen && (
                <Modal
                    isOpen={isCompanyModalOpen}
                    onClose={() => setIsCompanyModalOpen(false)}
                    title={selectedCompany ? "Edit Company" : "Add Company"}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const companyData = Object.fromEntries(formData.entries());
                            companyData.emails = companyData.emails.split(",").map((email) => email.trim());
                            companyData.phoneNumbers = companyData.phoneNumbers.split(",").map((phone) => phone.trim());
                            companyData.communicationPeriodicity = parseInt(companyData.communicationPeriodicity, 10);
                            handleSaveCompany(companyData);
                        }}
                    >
                        <div className="mb-4">
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={selectedCompany?.name || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Location</label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={selectedCompany?.location || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">LinkedIn Profile</label>
                            <input
                                type="url"
                                name="linkedinProfile"
                                defaultValue={selectedCompany?.linkedinProfile || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Emails (comma-separated)</label>
                            <input
                                type="text"
                                name="emails"
                                defaultValue={selectedCompany?.emails?.join(", ") || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Phone Numbers (comma-separated)</label>
                            <input
                                type="text"
                                name="phoneNumbers"
                                defaultValue={selectedCompany?.phoneNumbers?.join(", ") || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Comments</label>
                            <textarea
                                name="comments"
                                defaultValue={selectedCompany?.comments || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block">Communication Periodicity (weeks)</label>
                            <input
                                type="number"
                                name="communicationPeriodicity"
                                defaultValue={selectedCompany?.communicationPeriodicity || 2}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </form>
                </Modal>
            )}

            {/* Method Modal */}
            {isMethodModalOpen && (
                <Modal
                    isOpen={isMethodModalOpen}
                    onClose={() => setIsMethodModalOpen(false)}
                    title={selectedMethod ? "Edit Method" : "Add Method"}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const methodData = Object.fromEntries(formData.entries());
                            methodData.sequence = parseInt(methodData.sequence, 10);
                            methodData.mandatory = methodData.mandatory === "true";
                            handleSaveMethod(methodData);
                        }}
                    >
                        <div className="mb-4">
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={selectedMethod?.name || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Description</label>
                            <textarea
                                name="description"
                                defaultValue={selectedMethod?.description || ""}
                                className="w-full px-4 py-2 border rounded-lg"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block">Sequence</label>
                            <input
                                type="number"
                                name="sequence"
                                defaultValue={selectedMethod?.sequence || methods.length + 1}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Mandatory</label>
                            <select
                                name="mandatory"
                                defaultValue={selectedMethod?.mandatory ? "true" : "false"}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </form>
                </Modal>
            )}

        </div>
    );
};

export default AdminDashboard;
