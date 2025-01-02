const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  linkedinProfile: String,
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  communicationPeriodicity: { type: Number, default: 14 },
  lastCommunications: [
    {
      method: String,
      date: Date,
      notes: String,
    },
  ],
});

module.exports = mongoose.model("Company", companySchema);
