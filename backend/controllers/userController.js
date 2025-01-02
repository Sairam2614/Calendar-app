const Company = require("../models/Company");
const Communication = require("../models/Communication");

// Log a new communication for a company
const logCommunication = async (req, res) => {
  const { companyId, type, date, notes } = req.body;
  try {
    const communication = new Communication({ companyId, type, date, notes });
    const savedCommunication = await communication.save();

    await Company.findByIdAndUpdate(
      companyId,
      { $push: { lastCommunications: { method: type, date, notes } } },
      { new: true }
    );

    res.status(201).json({
      message: "Communication logged successfully",
      communication: savedCommunication,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies with last and next communications
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean(); // Fetch all companies

    const today = new Date();

    const companiesWithCommunication = companies.map((company) => {
      const lastFiveCommunications = company.lastCommunications
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Get last 5 communications

      const nextCommunicationDate = lastFiveCommunications.length
        ? new Date(lastFiveCommunications[0].date)
        : null;

      if (nextCommunicationDate) {
        nextCommunicationDate.setDate(
          nextCommunicationDate.getDate() + company.communicationPeriodicity
        );
      }

      return {
        ...company,
        lastCommunications: lastFiveCommunications,
        nextCommunication: nextCommunicationDate
          ? {
              type: lastFiveCommunications[0].method,
              date: nextCommunicationDate,
            }
          : null,
        isOverdue:
          nextCommunicationDate && today > nextCommunicationDate
            ? true
            : false,
      };
    });

    res.status(200).json(companiesWithCommunication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get overdue communications
const getOverdueCommunications = async (req, res) => {
  try {
    const today = new Date();
    const companies = await Company.find();

    const overdueCompanies = companies.filter((company) => {
      const lastCommunication = company.lastCommunications.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];
      if (!lastCommunication) return true;
      const dueDate = new Date(lastCommunication.date);
      dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);
      return today > dueDate;
    });

    res.status(200).json(overdueCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's scheduled communications
const getTodaysCommunications = async (req, res) => {
  try {
    const today = new Date();
    const companies = await Company.find();

    const todaysCompanies = companies.filter((company) => {
      const lastCommunication = company.lastCommunications.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];
      if (!lastCommunication) return false;
      const dueDate = new Date(lastCommunication.date);
      dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);
      return (
        dueDate.getFullYear() === today.getFullYear() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getDate() === today.getDate()
      );
    });

    res.status(200).json(todaysCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logCommunication,
  getCompanies,
  getOverdueCommunications,
  getTodaysCommunications,
};
