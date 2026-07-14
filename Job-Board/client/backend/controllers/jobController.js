const fs = require("fs");
const path = require("path");

// Path to jobs.json
const jobsFilePath = path.join(__dirname, "../data/jobs.json");

// Read jobs from JSON file
const readJobs = () => {
  const data = fs.readFileSync(jobsFilePath, "utf8");
  return JSON.parse(data);
};

// Write jobs to JSON file
const writeJobs = (jobs) => {
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), "utf8");
};

// GET All Jobs
const getJobs = (req, res) => {
  try {
    const jobs = readJobs();

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET Single Job
const getJobById = (req, res) => {
  try {
    const jobs = readJobs();

    const id = parseInt(req.params.id);

    const job = jobs.find((job) => job.id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE Job
const createJob = (req, res) => {
  try {
    const jobs = readJobs();

    const newJob = {
      id: jobs.length
        ? Math.max(...jobs.map((job) => job.id)) + 1
        : 1,
      ...req.body,
    };

    jobs.push(newJob);

    writeJobs(jobs);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE Job
const updateJob = (req, res) => {
  try {
    const jobs = readJobs();

    const id = parseInt(req.params.id);

    const index = jobs.findIndex((job) => job.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    jobs[index] = {
      ...jobs[index],
      ...req.body,
      id,
    };

    writeJobs(jobs);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: jobs[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE Job
const deleteJob = (req, res) => {
  try {
    const jobs = readJobs();

    const id = parseInt(req.params.id);

    const index = jobs.findIndex((job) => job.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const deletedJob = jobs.splice(index, 1);

    writeJobs(jobs);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      job: deletedJob[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};