const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
    projectName: { type: String, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false }], // team that is created in this project.
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }, // optional status field
  });
  
  const Project = mongoose.model('Project', projectSchema);
  module.exports = Project;