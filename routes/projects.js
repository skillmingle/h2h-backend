const express = require("express");
const router = express.Router();
const Project = require("../models/project"); // Import the Project schema
const User = require("../models/User"); // Import the User schema for linking projects to users

// Create a new project
router.post("/create-project", async (req, res) => {
  const { projectName, description, userId } = req.body;

  try {
    // Find the user who is creating the project
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create a new project
    const newProject = new Project({
      projectName,
      description,
      teams: [], // Initial empty team list
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Add this project to the user's project list
    user.projects.push(savedProject._id);
    await user.save();

    res.status(201).json({
      success: true,
      project: savedProject,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating project",
    });
  }
});

router.get("/user-projects", async (req, res) => {
    try {
  
      // Fetch the user along with their projects
      const user = await Project.find({});
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        projects: user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error fetching projects",
      });
    }
  });


  // Route to get a single project by its ID
router.get("/projects/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;

      console.log("got the project id: ",projectId)
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
  
      res.status(200).json({
        success: true,
        project,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error fetching project",
      });
    }
  });

module.exports = router;
