const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import your user schema

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("login request recieved")
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
  
      res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: "Login failed" });
    }
  });

  

  // for h2h clients

  // routes/auth.js (or wherever your login route is defined)
router.post("/login/client", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received");

  try {
    // Find the user by email and populate the teams
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if the provided password matches the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Extract the first team ID if available
    const teamId = user.teams.length > 0 ? user.teams[0]._id : null;

    // Send user data along with the first team ID to the frontend
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, teamId },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Login failed" });
  }
});


module.exports = router;
