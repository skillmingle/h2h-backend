const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false }], // project that user has created
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false }], // teams that user has joined
    last_login: { 
      type: Date,
      default: Date.now,
    },
  });
  
  
  const User = mongoose.model('User', userSchema);
  
  module.exports =User;
  