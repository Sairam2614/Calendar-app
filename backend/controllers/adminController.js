const Company = require("../models/Company");
const Method = require("../models/CommunicationMethod")
const mongoose = require('mongoose')
// Add a new company
const addCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a company
const editCompany = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    // Validate the format of the MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    
    if(!req.body){
      return res.status(404).json({ message: "request not found" });
    }
    // Perform the update
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure updated document is returned and validators run
    );

    // Check if the company exists
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Return the updated company
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error editing company:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete a company
const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    const companiesWithLastFiveComms = companies.map((company) => ({
      ...company,
      lastCommunications: company.lastCommunications.slice(-5),
    }));
    res.status(200).json(companiesWithLastFiveComms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const initializeDefaultMethods = async () => {
  const defaultMethods = [
    { name: 'LinkedIn Post', description: 'Post on LinkedIn', sequence: 1, mandatory: true },
    { name: 'LinkedIn Message', description: 'Message via LinkedIn', sequence: 2, mandatory: true },
    { name: 'Email', description: 'Send an email', sequence: 3, mandatory: true },
    { name: 'Phone Call', description: 'Make a phone call', sequence: 4, mandatory: false },
    { name: 'Other', description: 'Other communication methods', sequence: 5, mandatory: false },
  ];

  try {
    for (const method of defaultMethods) {
      const existingMethod = await Method.findOne({ name: method.name });
      if (!existingMethod) {
        await Method.create(method);
      }
    }
    console.log('Default communication methods initialized.');
  } catch (error) {
    console.error('Error initializing default methods:', error.message);
  }
};


const addMethod = async (req,res) =>{
  try {
    const newMethod = new Method(req.body);
    await newMethod.save();
    res.status(201).json(newMethod);
  } catch (error) {
    res.status(400).json({ message: "Failed to add method", error });
  }
}


const getMethods = async (req,res) =>{
  try {
    const methods = await Method.find();
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch methods" });
  }
}

const editMethod = async (req,res) =>{
  try {
    const updatedMethod = await Method.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMethod);
  } catch (error) {
    res.status(400).json({ message: "Failed to update method", error });
  }
}

const deleteMethod = async (req,res) =>{
  try {
    await Method.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Method deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete method", error });
  }
}



module.exports = { addCompany, editCompany, deleteCompany, getCompanies,getMethods,addMethod,deleteMethod,editMethod,initializeDefaultMethods};
