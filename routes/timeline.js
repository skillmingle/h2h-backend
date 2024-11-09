const express = require("express");
const router = express.Router();
const Timeline = require("../models/timeline");
const Team = require("../models/team"); // Import the Team schema
const logActivity = require("../utils/logActivity");

// Create a new timeline
router.post("/teams/:teamId/timelines", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, description, start, end, resource, progress, color,id,name } = req.body;

    const newTimeline = new Timeline({
      teamId,
      title,
      description,
      start,
      end,
      resource,
      progress,
      color,
    });

    await newTimeline.save();

    await logActivity(
      teamId,
      id,
      name,
      "CREATE",
      `Created a Timeline "${title}" .`
    );

    res.status(201).json({ success: true, timeline: newTimeline });
  } catch (error) {
    console.error("Error creating timeline:", error);
    res.status(500).json({ success: false, message: "Error creating timeline" });
  }
});

// Fetch timelines for a specific team
router.get("/teams/:teamId/timelines", async (req, res) => {
  try {
    const { teamId } = req.params;
    const timelines = await Timeline.find({ teamId }).sort({ start: 1 });

    res.status(200).json({ success: true, timelines });
  } catch (error) {
    console.error("Error fetching timelines:", error);
    res.status(500).json({ success: false, message: "Error fetching timelines" });
  }
});

// Update an timeline by ID
router.put("/timelines/:timelineId", async (req, res) => {
  try {
    const { timelineId } = req.params;
    const updates = req.body;
    console.log(updates)

    const updatedTimeline = await Timeline.findByIdAndUpdate(timelineId, updates, { new: true });

    await logActivity(
      updates.teamId,
      updates.id,
      updates.name,
      "UPDATE",
      `Updated a timeline "${updates.title}".`
    );
    res.status(200).json({ success: true, timeline: updatedTimeline });
  } catch (error) {
    console.error("Error updating timeline:", error);
    res.status(500).json({ success: false, message: "Error updating timeline" });
  }
});

// Delete an timeline by ID
// router.delete("/timelines/:timelineId", async (req, res) => {
//   try {
//     const { timelineId } = req.params;

//     await Timeline.findByIdAndDelete(timelineId);
//     res.status(200).json({ success: true, message: "Timeline deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting timeline:", error);
//     res.status(500).json({ success: false, message: "Error deleting timeline" });
//   }
// });

  // Route to get all members of a specific team
  router.get("/teams/:teamId/members", async (req, res) => {
    try {
      const { teamId } = req.params;
  
      // Find team by ID and populate the members field
      const team = await Team.findById(teamId).populate("members", "name");
  
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
  
      // Map members to a format compatible with Mobiscroll resources
      const resources = team.members.map(member => ({
        id: member._id.toString(), // Mobiscroll requires string IDs
        name: member.name,
        title:"developer",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color for each member
      }));
  
      res.status(200).json({ success: true, resources });
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ success: false, message: "Error fetching team members" });
    }
  });


  router.delete("/timeline2/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      const {id,name,teamId}=req.body;
      await Timeline.findByIdAndDelete(eventId);
      await logActivity(
        teamId,
        id,
        name,
        "DELETE",
        `Deleted a timeleine`
      );
      res.status(200).json({ success: true, message: "Event deleted successfully" });
  
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ success: false, message: "Error deleting event" });
    }
  });
  
  

module.exports = router;
