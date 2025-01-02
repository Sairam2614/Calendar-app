const mongoose = require("mongoose");

const communicationMethodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  sequence: Number,
  mandatory: Boolean,
});

module.exports = mongoose.model("CommunicationMethod", communicationMethodSchema);
