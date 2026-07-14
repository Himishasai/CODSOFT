import { useState, useEffect } from "react";
import { User, FileText, Bookmark, Briefcase } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function Profile() {
  const [profile] = useState({
    name: "Sai Himisha",
    email: "candidate@email.com",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Node.js",
    ],
    resume: "https://drive.google.com/",
  });

  const savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApplications(res.data.applications);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={50} className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-4xl font-bold">{profile.name}</h1>
                <p className="text-gray-500 mt-2">{profile.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">

              <div className="card p-6 text-center">
                <Bookmark className="mx-auto text-blue-600" size={35} />
                <h2 className="text-3xl font-bold mt-3">
                  {savedJobs.length}
                </h2>
                <p className="text-gray-500">
                  Saved Jobs
                </p>
              </div>

              <div className="card p-6 text-center">
                <Briefcase className="mx-auto text-blue-600" size={35} />
                <h2 className="text-3xl font-bold mt-3">
                  {applications.length}
                </h2>
                <p className="text-gray-500">
                  Applied Jobs
                </p>
              </div>

              <div className="card p-6 text-center">
                <FileText className="mx-auto text-blue-600" size={35} />
                <h2 className="text-xl font-bold mt-4">
                  Resume
                </h2>

                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>

            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-5">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;