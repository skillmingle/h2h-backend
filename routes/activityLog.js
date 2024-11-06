// routes/activityLog.js
const express = require("express");
const ActivityLog = require("../models/activityLog");
const router = express.Router();
const logActivity = require("../utils/logActivity");
const Team = require("../models/team"); // Import the Team schema
const Admin = require("../models/admin");


router.get("/teams/:teamId/activityLogs", async (req, res) => {
  const { teamId } = req.params;
  try {
    const logs = await ActivityLog.find({ teamId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ success: false, message: "Error fetching activity logs" });
  }
});

// Route to log activity
router.post("/activity-log", async (req, res) => {
  try {
    const { teamId, userId, userName, action, description } = req.body;
    await logActivity(teamId, userId, userName, action, description);
    res.status(201).json({ success: true, message: "Activity logged successfully" });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ success: false, message: "Error logging activity" });
  }
});


// Create Notice API
router.post("/notices", async (req, res) => {
  try {
    const { title, description, selectedTeams, projectId, sendToAll, userId } = req.body;

    // Prepare the notice object
    const newNotice = {
      title,
      description,
      date: new Date(),
      userId
    };

    // Fetch teams based on selection
    let teamsToUpdate;
    if (sendToAll) {
      teamsToUpdate = await Team.find({}); // Include all teams
    } else {
      teamsToUpdate = await Team.find({ _id: { $in: selectedTeams } });
    }

    // Update each team by pushing the new notice to its notices array
    const updatePromises = teamsToUpdate.map(team =>
      Team.findByIdAndUpdate(team._id, { $push: { notices: newNotice } })
    );

    await Promise.all(updatePromises);

    res.status(201).json({ success: true, message: "Notice created and sent to selected teams." });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ success: false, message: "Error creating notice" });
  }
});


// routes/notices.js
router.get("/teams/:teamId/notices", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId, "notices");
    res.status(200).json({ success: true, notices: team.notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ success: false, message: "Error fetching notices" });
  }
});



router.post("/admin/accessToken", async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Find the first admin document or create a new one
    let admin = await Admin.findOne({});
    if (admin) {
      admin.accessToken = accessToken; // Update existing token
    } else {
      admin = new Admin({ accessToken }); // Create new token if not found
    }

    await admin.save();
    res.status(200).json({ success: true, message: "Access token stored successfully" });
  } catch (error) {
    console.error("Error storing access token:", error);
    res.status(500).json({ success: false, message: "Error storing access token" });
  }
});

// Route to fetch the accessToken
router.get("/admin/accessToken", async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    if (!admin) {
      return res.status(404).json({ success: false, message: "Access token not found" });
    }

    res.status(200).json({ success: true, accessToken: admin.accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).json({ success: false, message: "Error fetching access token" });
  }
});

module.exports = router;
