const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    tags:[{ type: String }],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    color: { type: String }, // Color for each event 
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  });
  
  const Task = mongoose.model('Task', TaskSchema);

  module.exports = Task;