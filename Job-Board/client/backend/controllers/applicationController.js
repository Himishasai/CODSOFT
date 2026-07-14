const fs = require("fs");
const path = require("path");

const applicationsFile = path.join(
  __dirname,
  "../data/applications.json"
);

// Read applications
const readApplications = () => {
  const data = fs.readFileSync(applicationsFile, "utf8");
  return JSON.parse(data);
};

// Write applications
const writeApplications = (applications) => {
  fs.writeFileSync(
    applicationsFile,
    JSON.stringify(applications, null, 2),
    "utf8"
  );
};

// Apply for a Job
const createApplication = (req, res) => {
  try {
    const applications = readApplications();

    const newApplication = {
      id:
        applications.length > 0
          ? Math.max(...applications.map((a) => a.id)) + 1
          : 1,

      ...req.body,

      // Save uploaded resume filename
      resume: req.file ? req.file.filename : "",

      appliedAt: new Date().toLocaleString(),
    };

    applications.push(newApplication);

    writeApplications(applications);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all applications
const getApplications = (req, res) => {
  try {
    const applications = readApplications();

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one application
const getApplicationById = (req, res) => {
  try {
    const applications = readApplications();

    const id = Number(req.params.id);

    const application = applications.find(
      (a) => a.id === id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete application
const deleteApplication = (req, res) => {
  try {
    const applications = readApplications();

    const id = Number(req.params.id);

    const filtered = applications.filter(
      (a) => a.id !== id
    );

    writeApplications(filtered);

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
};