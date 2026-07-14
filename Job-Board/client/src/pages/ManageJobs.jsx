import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${id}`);

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete job.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex justify-between items-center mb-10">

            <div>
              <h1 className="text-4xl font-bold">
                Manage Jobs
              </h1>

              <p className="text-gray-500 mt-2">
                Edit or remove your posted jobs
              </p>
            </div>

            <Link
              to="/post-job"
              className="btn-primary"
            >
              + Post Job
            </Link>

          </div>

          {jobs.length === 0 ? (

            <div className="bg-white p-10 rounded-xl shadow text-center">

              <h2 className="text-2xl font-bold">
                No Jobs Available
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first job posting.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {jobs.map((job) => (

                <div
                  key={job.id}
                  className="card p-7 flex justify-between items-center"
                >

                  <div>

                    <h2 className="text-2xl font-bold">
                      {job.title}
                    </h2>

                    <p className="text-blue-600">
                      {job.company}
                    </p>

                    <p className="text-gray-500 mt-2">
                      {job.location}
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <Link
                      to={`/edit-job/${job.id}`}
                      className="flex items-center gap-2 btn-outline"
                    >
                      <Edit size={18} />
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteJob(job.id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ManageJobs;