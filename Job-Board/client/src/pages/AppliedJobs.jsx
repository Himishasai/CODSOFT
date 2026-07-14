import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Building2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications");
        setApplications(response.data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const deleteApplication = async (id) => {
    try {
      await api.delete(`/applications/${id}`);

      setApplications((prev) =>
        prev.filter((application) => application.id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-600">
            Loading Applications...
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
        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-4xl font-bold text-slate-800 mb-10">
            Applied Jobs
          </h1>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

              <FileText
                size={60}
                className="mx-auto text-gray-400"
              />

              <h2 className="text-2xl font-bold mt-5">
                No Applications Yet
              </h2>

              <p className="text-gray-500 mt-2">
                Apply for jobs and track them here.
              </p>

              <Link
                to="/jobs"
                className="btn-primary inline-block mt-6"
              >
                Browse Jobs
              </Link>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">

              {applications.map((application) => (

                <div
                  key={application.id}
                  className="card p-7"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Building2
                        size={28}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {application.jobTitle}
                      </h2>

                      <p className="text-blue-600">
                        {application.company}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6 space-y-2 text-gray-600">

                    <p>
                      📅 Applied:
                      {" "}
                      {application.appliedAt}
                    </p>

                    <p>
                      📧
                      {" "}
                      {application.email}
                    </p>

                    <p>
                      📱
                      {" "}
                      {application.phone}
                    </p>

                  </div>

                  <div className="mt-6">
                    <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Application Submitted
                    </span>
                  </div>

                  <div className="flex gap-3 mt-6">

                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="btn-outline"
                    >
                      View Job
                    </Link>

                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
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

export default AppliedJobs;