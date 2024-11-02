const express = require("express");
const router = express.Router();
const Team = require("../models/team"); // Import the Team schema
const Project = require("../models/project"); // Import the Project schema
const User = require("../models/User"); // Assuming you have a user model

// Route to create a new team
router.post("/projects/:projectId/teams", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamName, leaderUserId,driveFolderId } = req.body;

    // Ensure the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Create a new team
    const newTeam = new Team({
      projectId,
      teamName,
      leaderUserId,
      driveFolderId,
      members:[leaderUserId],
      createdAt: Date.now(),
      
    });

    await newTeam.save();

    // Add the team to the project
    project.teams.push(newTeam._id);
    await project.save();

    res.status(201).json({
      success: true,
      team: newTeam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating team",
    });
  }
});


router.get("/projects/:projectId/teams", async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Find all teams associated with the project
      const teams = await Team.find({ projectId });
  
      if (!teams) {
        return res.status(404).json({ success: false, message: "Teams not found" });
      }
  
      res.status(200).json({
        success: true,
        teams,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error fetching teams",
      });
    }
  });


// Route to fetch a single team by teamId with members and leader
router.get("/teams/:teamId", async (req, res) => {
    try {
      const { teamId } = req.params;
  
      // Find the team and populate members and leader fields
      const team = await Team.findById(teamId)
        .populate("members", "name") // Populate member names
        .populate("leaderUserId", "name"); // Populate leader's name
  
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
  
      res.status(200).json({ success: true, team });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error fetching team" });
    }
  });



// Route to add a team member by email
router.post("/teams/:teamId/addMember", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { email } = req.body; // Email of the new team member
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Add the user to the team's members list
      const team = await Team.findByIdAndUpdate(
        teamId,
        { $addToSet: { members: user._id } }, // Prevent duplicates using $addToSet
        { new: true }
      ).populate("members", "name"); // Populate member names
  
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
  
      // Add the team to the user's teams list
      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { teams: teamId } }, // Add the team ID to the user's teams field
        { new: true }
      );
  
      res.status(200).json({ success: true, team });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error adding team member" });
    }
  });
  
  


  

module.exports = router;
