import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    resume: "",
    coverLetter: "",
  });

  // Fetch job from backend
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/applications", {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        ...formData,
      });

      navigate("/application-success");
    } catch (error) {
      console.error(error);

      alert("Failed to submit application");
    }
  };

  if (!job) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-4xl font-bold">Loading...</h2>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-14">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
          >
            <ArrowLeft size={20} />
            Back to Job Details
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h1 className="text-4xl font-bold">
              Apply for {job.title}
            </h1>

            <p className="text-gray-500 mt-2">
              {job.company} • {job.location}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
              <div>
                <label className="font-semibold">
                  Full Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field mt-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold">
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field mt-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field mt-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold">
                  Current Location
                </label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Years of Experience
                </label>

                <input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Resume Link
                </label>

                <input
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Cover Letter
                </label>

                <textarea
                  name="coverLetter"
                  rows="6"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="input-field mt-2"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ApplyJob;