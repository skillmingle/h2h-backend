// routes/tasks.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task");
// const Team = require("../models/Team");
const logActivity = require("../utils/logActivity");

// Route to create a new task
router.post("/teams/:teamId/tasks", async (req, res) => {
  const { teamId } = req.params;
  const { title, description, assignedBy, resource, status, tags, progress, color, start, end , id, name} = req.body;

  try {
    const newTask = new Task({
      teamId,
      title,
      description,
      assignedBy,
      resource,
      status,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated tags to array
      progress,
      color,
      start,
      end,
    });

    await logActivity(
      teamId,
      id,
      name,
      "CREATE",
      `Created a task "${title}" .`
    );

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Error creating task" });
  }
});


// Fetch Tasks API
router.get("/teams/:teamId/tasks", async (req, res) => {
  const { teamId } = req.params;

  try {
    const tasks = await Task.find({ teamId })
      .populate("assignedBy", "name") // Populates assignedBy with user name
      .populate("resource", "name"); // Populates resource with user names

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
});


// Update Task API
router.put("/tasks/edit/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, resource, status, tags, progress, color, start, end, id, name, teamId } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        resource,
        status,
        tags: tags.split(",").map(tag => tag.trim()), // Parse comma-separated tags
        progress,
        color,
        start,
        end,
        updatedAt: new Date(),
      },
      { new: true } // Return the updated task
    ).populate("resource", "name"); // Populate resource names if necessary

    if (updatedTask) {
          await logActivity(
      teamId,
      id,
      name,
      "UPDATE",
      `Updated the task "${title}" .`
    );
      res.status(200).json({ success: true, task: updatedTask });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Error updating task" });
  }
});


  // Example using Express.js
router.put("/tasks/:id", async (req, res) => {

  const { id } = req.params;
  const { status,name,teamId,userId } = req.body;

  console.log("dragged",id, status)
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (updatedTask) {
      await logActivity(
  teamId,
  userId,
  name,
  "UPDATE",
  `Moved the task to ${status}.`
);
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete Task API
router.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { id, name, teamId,title } = req.body;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (deletedTask) {
      await logActivity(
        teamId,
        id,
        name,
        "DELETE",
        `Deleted the task ${title}`
      );
      res.status(200).json({ success: true, message: "Task deleted successfully", taskId });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
});




  
module.exports = router;
