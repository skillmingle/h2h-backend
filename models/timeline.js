const mongoose = require("mongoose");

const TimelineSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Timeline = mongoose.model('Timeline', TimelineSchema);

module.exports = Timeline;
