// utils/logActivity.js
const ActivityLog = require("../models/activityLog");

async function logActivity(teamId, userId, userName, action, description) {
  try {
    const newLog = new ActivityLog({
      teamId,
      userId,
      userName,
      action,
      description,
    });
    await newLog.save();
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

module.exports = logActivity;
