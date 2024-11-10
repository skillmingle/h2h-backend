const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamSchema = new Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    teamName: { type: String, required: true },
    driveFolderId: { type: String, required: true },
    githubRepo: {
      userName:{type:String},
      repo:{type:String}
    },
    mentor1: { type:String, required: true, default:'sachin@skillmingle'},
    mentor2: { type:String, required: true, default:'sahil@skillmingle' },
    leaderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }], // list of team members
    notices:[{
      title:{type: String},
      description:{type: String},
      date:{type: Date, default: Date.now},
      userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}

    }],
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }, // optional status field
    messageSeen:{type:Boolean,default:false}
  });
  
  const Team = mongoose.model('Team', teamSchema);

  module.exports = Team;
