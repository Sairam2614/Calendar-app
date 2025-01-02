const mongoose = require("mongoose");

const communicationSchema = mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: String,
});

module.exports = mongoose.model("Communication", communicationSchema);
