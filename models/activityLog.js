// models/ActivityLog.js
const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  userId: { type: String},
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  action: { type: String, enum: ["CREATE", "UPDATE", "DELETE","UPLOAD"], required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
module.exports = ActivityLog;
