const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected Routes
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;