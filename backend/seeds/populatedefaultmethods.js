const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CommunicationMethod = require("../models/CommunicationMethod");

dotenv.config();

const initializeDefaultMethods = async () => {
  const defaultMethods = [
    { name: "LinkedIn Post", description: "Post on LinkedIn", sequence: 1, mandatory: true },
    { name: "LinkedIn Message", description: "Message via LinkedIn", sequence: 2, mandatory: true },
    { name: "Email", description: "Send an email", sequence: 3, mandatory: true },
    { name: "Phone Call", description: "Make a phone call", sequence: 4, mandatory: false },
    { name: "Other", description: "Other communication methods", sequence: 5, mandatory: false },
  ];

  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected. Initializing default methods...");
    for (const method of defaultMethods) {
      const existingMethod = await CommunicationMethod.findOne({ name: method.name });
      if (!existingMethod) {
        await CommunicationMethod.create(method);
        console.log(`Added: ${method.name}`);
      } else {
        console.log(`Skipped (already exists): ${method.name}`);
      }
    }

    console.log("Default methods initialized successfully.");
    process.exit(0); // Exit the process
  } catch (error) {
    console.error("Error initializing default methods:", error.message);
    process.exit(1); // Exit with failure
  }
};

// Run the function
initializeDefaultMethods();
