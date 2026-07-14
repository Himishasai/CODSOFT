const express = require("express");

const {
  createApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
} = require("../controllers/applicationController");

const upload = require("../middleware/upload");

const router = express.Router();

// Get all applications
router.get("/", getApplications);

// Get one application
router.get("/:id", getApplicationById);

// Apply for a job (with resume upload)
router.post(
  "/",
  upload.single("resume"),
  createApplication
);

// Delete application
router.delete("/:id", deleteApplication);

module.exports = router;