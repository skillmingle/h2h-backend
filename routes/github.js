// routes/team.js
const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const logActivity = require("../utils/logActivity");

// Fetch GitHub username and repo for a team
router.get("/team/:teamId/github", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId, "githubRepo");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.status(200).json({ success: true, githubRepo: team.githubRepo });
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    res.status(500).json({ success: false, message: "Error fetching GitHub repo" });
  }
});

// Add or update GitHub username and repo
router.put("/team/:teamId/github", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userName, repo,name,id } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { githubRepo: { userName, repo } },
      { new: true, runValidators: true }
    );

    await logActivity(
        teamId,
        id,
        name,
        "UPDATE",
        `Edited a repo "${repo}" .`
      );

    if (!updatedTeam) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, githubRepo: updatedTeam.githubRepo });
  } catch (error) {
    console.error("Error updating GitHub repo:", error);
    res.status(500).json({ success: false, message: "Error updating GitHub repo" });
  }
});

module.exports = router;
