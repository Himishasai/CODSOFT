import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);

        const job = response.data.job;

        setJobData({
          title: job.title,
          company: job.company,
          location: job.location,
          category: job.category,
          salary: job.salary,
          salaryText: job.salaryText,
          type: job.type,
          skills: job.skills.join(", "),
          description: job.description,
        });
      } catch (error) {
        console.error(error);
        alert("Job not found");
        navigate("/manage-jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/jobs/${id}`, {
        ...jobData,
        salary: Number(jobData.salary),
        skills: jobData.skills
          .split(",")
          .map((skill) => skill.trim()),
      });

      alert("Job updated successfully!");

      navigate("/manage-jobs");
    } catch (error) {
      console.error(error);
      alert("Failed to update job");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <h2 className="text-3xl font-bold">
            Loading...
          </h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            <h1 className="text-4xl font-bold">
              Edit Job
            </h1>

            <p className="text-gray-500 mt-2">
              Update your job details
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              <input
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Job Title"
                required
              />

              <input
                name="company"
                value={jobData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="Company"
                required
              />

              <input
                name="location"
                value={jobData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Location"
                required
              />

              <input
                name="category"
                value={jobData.category}
                onChange={handleChange}
                className="input-field"
                placeholder="Category"
                required
              />

              <input
                type="number"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                className="input-field"
                placeholder="Salary"
                required
              />

              <input
                name="salaryText"
                value={jobData.salaryText}
                onChange={handleChange}
                className="input-field"
                placeholder="₹12 LPA"
                required
              />

              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className="input-field"
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>

              <input
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                className="input-field"
                placeholder="React, Node.js"
              />

              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="6"
                className="input-field"
              />

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Update Job
              </button>

            </form>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default EditJob;