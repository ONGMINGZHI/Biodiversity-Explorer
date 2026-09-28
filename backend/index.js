const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const speciesRoutes = require("./routes/speciesRoutes");
const conservationStatusRoutes = require("./routes/conservationStatusRoutes");
const habitatRoutes = require("./routes/habitatRoutes");
const locationRoutes = require("./routes/locationRoutes");
const sightingRoutes = require("./routes/sightingRoutes");
const conservationProjectRoutes = require("./routes/conservationProjectRoutes");
const { protect, adminOnly } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Species routes
app.use("/api/species", speciesRoutes);

// Conservation Status
app.use("/api/conservation-statuses", conservationStatusRoutes);

// Habitat Route
app.use("/api/habitats", habitatRoutes);

// Location Route
app.use("/api/locations", locationRoutes);

// Sighting Route
app.use("/api/sightings", sightingRoutes);

// Conservation Project Route
app.use("/api/conservation-projects", conservationProjectRoutes);

// Test protected route
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user,
    });
});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Biodiversity Explorer API!",
    });
});

// Admin Only
app.get("/api/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin!",
    });
});

// Connect MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
