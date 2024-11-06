const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({ 
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    unique: true,
    required: true,
  },
  
  messages: [{
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      senderName: {
        type: String,
        required: true,
      },
      text: String,
      replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },
      type: {
        type: String,
        enum: ["text", "image", "file"],
        required: true,
        default: "text",
      },
      fileUrl: String, // URL for file or image if type is "image" or "file"
      createdAt: {
        type: Date,
        default: Date.now,
      },
}],
});

module.exports = mongoose.model("Chat", ChatSchema);