import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function PostJob() {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    salaryText: "",
    type: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/jobs", {
        ...jobData,
        salary: Number(jobData.salary),
        skills: jobData.skills
          .split(",")
          .map((skill) => skill.trim()),
        posted: "Just now",
      });

      alert("Job posted successfully!");

      navigate("/manage-jobs");
    } catch (error) {
      console.error(error);

      alert("Failed to post job.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            <h1 className="text-4xl font-bold">
              Post a New Job
            </h1>

            <p className="text-gray-500 mt-2">
              Create a job opportunity for candidates
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              <input
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="input-field"
                required
              />

              <input
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="input-field"
                required
              />

              <input
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="Location"
                className="input-field"
                required
              />

              <input
                name="category"
                value={jobData.category}
                onChange={handleChange}
                placeholder="Category"
                className="input-field"
                required
              />

              <input
                name="salary"
                type="number"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="Salary (1200000)"
                className="input-field"
                required
              />

              <input
                name="salaryText"
                value={jobData.salaryText}
                onChange={handleChange}
                placeholder="₹12 LPA"
                className="input-field"
                required
              />

              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Job Type</option>
                <option>Full Time</option>
                <option>Internship</option>
                <option>Part Time</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>

              <input
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Express"
                className="input-field"
                required
              />

              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Job Description"
                className="input-field"
                required
              />

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Publish Job
              </button>

            </form>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PostJob;