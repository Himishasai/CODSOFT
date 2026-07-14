import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, Users, Settings } from "lucide-react";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function EmployerDashboard() {

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const jobsRes = await api.get("/jobs");
        const appRes = await api.get("/applications");

        setJobs(jobsRes.data.jobs);
        setApplications(appRes.data.applications);

      } catch (err) {

        console.error(err);

      }

    };

    fetchData();

  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-12">

        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">

            <div>

              <h1 className="text-4xl font-bold text-slate-800">
                Employer Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your job postings and find talented candidates
              </p>

            </div>

            <div className="flex gap-4">

              <Link
                to="/post-job"
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Post Job
              </Link>

              <Link
                to="/manage-jobs"
                className="btn-outline flex items-center gap-2"
              >
                <Settings size={20} />
                Manage Jobs
              </Link>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="card p-6">

              <Briefcase
                size={35}
                className="text-blue-600"
              />

              <h2 className="text-3xl font-bold mt-4">
                {jobs.length}
              </h2>

              <p className="text-gray-500">
                Active Jobs
              </p>

            </div>

            <div className="card p-6">

              <Users
                size={35}
                className="text-blue-600"
              />

              <h2 className="text-3xl font-bold mt-4">
                {applications.length}
              </h2>

              <p className="text-gray-500">
                Applications Received
              </p>

            </div>

            <div className="card p-6">

              <Briefcase
                size={35}
                className="text-blue-600"
              />

              <h2 className="text-3xl font-bold mt-4">
                {jobs.length}
              </h2>

              <p className="text-gray-500">
                Total Posted Jobs
              </p>

            </div>

          </div>

          <div className="mt-12">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Recent Job Posts
              </h2>

              <Link
                to="/manage-jobs"
                className="text-blue-600 hover:underline"
              >
                View All
              </Link>

            </div>

            {jobs.length === 0 ? (

              <div className="bg-white rounded-xl shadow p-10 text-center">

                <Briefcase
                  size={50}
                  className="mx-auto text-gray-400"
                />

                <h3 className="text-xl font-bold mt-4">
                  No Jobs Posted Yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Create your first job opportunity.
                </p>

                <Link
                  to="/post-job"
                  className="btn-primary inline-block mt-6"
                >
                  Create Job
                </Link>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-6">

                {jobs
                  .slice()
                  .reverse()
                  .slice(0, 4)
                  .map((job) => (

                    <div
                      key={job.id}
                      className="card p-6"
                    >

                      <h3 className="text-xl font-bold">
                        {job.title}
                      </h3>

                      <p className="text-blue-600 mt-1">
                        {job.company}
                      </p>

                      <p className="text-gray-500 mt-2">
                        {job.location}
                      </p>

                      <Link
                        to="/manage-jobs"
                        className="btn-outline inline-flex mt-5"
                      >
                        Manage
                      </Link>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}

export default EmployerDashboard;