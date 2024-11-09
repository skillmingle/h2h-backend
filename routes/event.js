// routes/events.js
const logActivity = require("../utils/logActivity");

const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// Create a new event
router.post("/teams/:teamId/events", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, description, start, end, allDay, bufferBefore, color, status,id,name } = req.body;

    const newEvent = new Event({
      teamId,
      title,
      description,
      start,
      end,
      allDay,
      bufferBefore,
      color,
      status
    });

    await newEvent.save();

    await logActivity(
      teamId,
      id,
      name,
      "CREATE",
      `Created a Task "${title}" .`
    );

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
});

// Fetch events for a specific team
router.get("/teams/:teamId/events", async (req, res) => {
  try {
    const { teamId } = req.params;
    const events = await Event.find({ teamId }).sort({ start: 1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
});

// Update an event by ID
router.put("/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const newEvent = req.body;
    console.log(newEvent)

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

    await logActivity(
      newEvent.teamId,
      newEvent.id,
      newEvent.name,
      "UPDATE",
      `Updated a Event "${updatedEvent.title}" .`
    );
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Error updating event" });
  }
});

// Delete an event by ID
router.delete("/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const {id,name,teamId}=req.body;
    await Event.findByIdAndDelete(eventId);
    await logActivity(
      teamId,
      id,
      name,
      "DELETE",
      `Deleted a Event`
    );
    res.status(200).json({ success: true, message: "Event deleted successfully" });

  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Error deleting event" });
  }
});




module.exports = router;
