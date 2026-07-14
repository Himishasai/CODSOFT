import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  Building2,
  MapPin,
  IndianRupee,
  Clock3,
  ArrowLeft,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-600">
            Loading Job...
          </h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-4xl font-bold">
            Job Not Found
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
        <div className="max-w-5xl mx-auto px-6">

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-10">

            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-6">

              <div className="flex gap-5">

                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2
                    className="text-blue-600"
                    size={32}
                  />
                </div>

                <div>
                  <h1 className="text-4xl font-bold">
                    {job.title}
                  </h1>

                  <p className="text-blue-600 text-xl mt-2">
                    {job.company}
                  </p>
                </div>

              </div>

              <Link
                to={`/apply/${job.id}`}
                className="btn-primary"
              >
                Apply Now
              </Link>

            </div>

            {/* Details */}

            <div className="flex flex-wrap gap-6 mt-10 text-gray-600">

              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {job.location}
              </div>

              <div className="flex items-center gap-2">
                <IndianRupee size={20} />
                {job.salaryText}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={20} />
                {job.type}
              </div>

            </div>

            {/* Skills */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-5">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-3">

                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </div>

            {/* Description */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-5">
                Job Description
              </h2>

              <p className="text-gray-600 leading-8">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-5">
                Responsibilities
              </h2>

              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Develop high-quality software solutions.</li>
                <li>Collaborate with cross-functional teams.</li>
                <li>Write clean, maintainable code.</li>
                <li>Participate in code reviews.</li>
                <li>Solve real-world business problems.</li>
              </ul>
            </div>

            {/* Requirements */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-5">
                Requirements
              </h2>

              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Bachelor's Degree in Computer Science or related field.</li>
                <li>Strong communication skills.</li>
                <li>Knowledge of modern development tools.</li>
                <li>Ability to work in a team environment.</li>
                <li>Passion for learning new technologies.</li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default JobDetails;