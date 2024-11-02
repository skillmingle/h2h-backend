

  // models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  bufferBefore: { type: Number, default: 0 },
  color: { type: String },
  status: { type: String, enum: ['busy', 'free'], default: 'busy' },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
