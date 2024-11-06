const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");

// Route to fetch all messages for a specific team
router.get("/chat/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const chat = await Chat.findOne({ teamId }).populate("messages.senderId", "name");

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to send a new message
router.post("/chat", async (req, res) => {
  try {
    const { teamId, senderId, senderName, text, replyTo, type, fileUrl } = req.body;

    console.log(teamId, senderId, senderName, text, replyTo, type, fileUrl)

    // Find the chat document for the team, or create a new one if it doesn't exist
    let chat = await Chat.findOne({ teamId });
    if (!chat) {
      // Create a new chat document for the team if it doesn't already exist
      chat = new Chat({ teamId, messages: [] });
    }

    // Construct the new message
    const newMessage = {
      senderId:senderId,
      senderName:senderName,
      text:text,
      replyTo: replyTo || null,
      type,
      fileUrl,
      createdAt: new Date(),
    };

    console.log(newMessage)
    // Add the new message to the messages array
    chat.messages? chat.messages.push(newMessage):chat.messages=newMessage;

    // Save the updated chat document
    await chat.save();

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Delete a message by ID in a specific chat
router.delete("/chat/:teamId/message/:messageId", async (req, res) => {
  const { teamId, messageId } = req.params;

  try {
    const chat = await Chat.findOneAndUpdate(
      { teamId },
      { $pull: { messages: { _id: messageId } } }, // Remove message by ID from messages array
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat or message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully", chat });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Error deleting message" });
  }
});

module.exports = router;
