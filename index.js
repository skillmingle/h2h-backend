// Import required modules
const express = require("express");
const mongooseConnection = require("./models/MoongooseConnection");
const app = express();
const cors = require("cors");


// Set up CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://hackathon-platform-h2h.vercel.app",
  "https://hackathon.skillmingle.in",
  "https://adminh2h.skillmingle.in",
  // Add more origins as needed
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/uploads", express.static("uploads"));


// Parse JSON requests
app.use(express.json());

// Define API routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/projects"));
app.use("/api", require("./routes/teams"));
app.use("/api", require("./routes/activityLog"));
app.use("/api", require("./routes/task"));
app.use("/api", require("./routes/event"));
app.use("/api", require("./routes/timeline"));
app.use("/api", require("./routes/chat"));
app.use("/api", require("./routes/github"));


// Define a test route
app.get("/", async (req, res) => {
  res.send("harsh");
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
