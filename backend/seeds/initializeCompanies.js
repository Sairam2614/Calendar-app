const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Company = require("../models/Company");

dotenv.config();

const initializeDefaultCompanies = async () => {
  const defaultCompanies = [
    {
      "name": "Google",
      "location": "Mountain View, CA",
      "linkedinProfile": "https://www.linkedin.com/company/google/",
      "emails": ["contact@google.com", "partners@google.com"],
      "phoneNumbers": ["+1-800-555-1212", "+1-800-555-3434"],
      "comments": "Tech giant with global outreach.",
      "communicationPeriodicity": 14,
      "lastCommunications": [
        { "method": "Email", "date": "2024-12-15T00:00:00.000Z", "notes": "Sent project proposal." },
        { "method": "LinkedIn Message", "date": "2024-12-10T00:00:00.000Z", "notes": "Followed up on email." }
      ]
    },
    {
      "name": "Microsoft",
      "location": "Redmond, WA",
      "linkedinProfile": "https://www.linkedin.com/company/microsoft/",
      "emails": ["info@microsoft.com"],
      "phoneNumbers": ["+1-800-555-5678"],
      "comments": "Leader in software and cloud solutions.",
      "communicationPeriodicity": 7,
      "lastCommunications": [
        { "method": "Phone Call", "date": "2024-12-20T00:00:00.000Z", "notes": "Discussed collaboration." }
      ]
    },
    {
      "name": "Amazon",
      "location": "Seattle, WA",
      "linkedinProfile": "https://www.linkedin.com/company/amazon/",
      "emails": ["partners@amazon.com"],
      "phoneNumbers": ["+1-888-280-4331"],
      "comments": "E-commerce and cloud leader.",
      "communicationPeriodicity": 30,
      "lastCommunications": [
        { "method": "LinkedIn Post", "date": "2024-11-25T00:00:00.000Z", "notes": "Tagged in promotional post." }
      ]
    },
    {
      "name": "Apple",
      "location": "Cupertino, CA",
      "linkedinProfile": "https://www.linkedin.com/company/apple/",
      "emails": ["contact@apple.com"],
      "phoneNumbers": ["+1-800-692-7753"],
      "comments": "Innovator in consumer technology.",
      "communicationPeriodicity": 14,
      "lastCommunications": []
    },
    {
      "name": "Tesla",
      "location": "Palo Alto, CA",
      "linkedinProfile": "https://www.linkedin.com/company/tesla/",
      "emails": ["investors@tesla.com"],
      "phoneNumbers": ["+1-800-332-8686"],
      "comments": "Electric vehicle and clean energy innovator.",
      "communicationPeriodicity": 10,
      "lastCommunications": [
        { "method": "Email", "date": "2024-12-05T00:00:00.000Z", "notes": "Shared product roadmap." }
      ]
    },
    {
      "name": "Facebook",
      "location": "Menlo Park, CA",
      "linkedinProfile": "https://www.linkedin.com/company/facebook/",
      "emails": ["contact@facebook.com"],
      "phoneNumbers": ["+1-800-555-7890"],
      "comments": "Leader in social media and advertising.",
      "communicationPeriodicity": 15,
      "lastCommunications": [
        { "method": "Phone Call", "date": "2024-11-30T00:00:00.000Z", "notes": "Discussed marketing strategies." }
      ]
    },
    {
      "name": "IBM",
      "location": "Armonk, NY",
      "linkedinProfile": "https://www.linkedin.com/company/ibm/",
      "emails": ["partners@ibm.com"],
      "phoneNumbers": ["+1-800-555-9988"],
      "comments": "Pioneers in AI and enterprise solutions.",
      "communicationPeriodicity": 21,
      "lastCommunications": []
    },
    {
      "name": "Oracle",
      "location": "Austin, TX",
      "linkedinProfile": "https://www.linkedin.com/company/oracle/",
      "emails": ["contact@oracle.com"],
      "phoneNumbers": ["+1-800-555-5643"],
      "comments": "Enterprise software and database leader.",
      "communicationPeriodicity": 20,
      "lastCommunications": [
        { "method": "LinkedIn Message", "date": "2024-12-01T00:00:00.000Z", "notes": "Followed up on database project." }
      ]
    },
    {
      "name": "Netflix",
      "location": "Los Gatos, CA",
      "linkedinProfile": "https://www.linkedin.com/company/netflix/",
      "emails": ["content@netflix.com"],
      "phoneNumbers": ["+1-800-555-1234"],
      "comments": "Streaming platform with global reach.",
      "communicationPeriodicity": 12,
      "lastCommunications": [
        { "method": "LinkedIn Post", "date": "2024-12-01T00:00:00.000Z", "notes": "Shared content partnership updates." }
      ]
    },
    {
      "name": "Spotify",
      "location": "New York, NY",
      "linkedinProfile": "https://www.linkedin.com/company/spotify/",
      "emails": ["partners@spotify.com"],
      "phoneNumbers": ["+1-800-555-3333"],
      "comments": "Global leader in audio streaming.",
      "communicationPeriodicity": 14,
      "lastCommunications": [
        { "method": "Email", "date": "2024-11-28T00:00:00.000Z", "notes": "Discussed podcast expansion." }
      ]
    }
  ]
  

  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected. Initializing default companies...");
    for (const company of defaultCompanies) {
      const existingCompany = await Company.findOne({ name: company.name });
      if (!existingCompany) {
        await Company.create(company);
        console.log(`Added: ${company.name}`);
      } else {
        console.log(`Skipped (already exists): ${company.name}`);
      }
    }

    console.log("Default companies initialized successfully.");
    process.exit(0); // Exit the process
  } catch (error) {
    console.error("Error initializing default companies:", error.message);
    process.exit(1); // Exit with failure
  }
};

// Run the function
initializeDefaultCompanies();
