import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import api from "../api/api";

function JobList({
  searchTerm,
  location,
  category,
  jobType,
  salary,
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data.jobs);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      location === "All Locations" || job.location === location;

    const matchesCategory =
      category === "All Categories" || job.category === category;

    const matchesJobType =
      jobType === "All Job Types" || job.type === jobType;

    const matchesSalary =
      salary === "Salary" ||
      job.salary >= Number(salary);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesJobType &&
      matchesSalary
    );
  });

  if (loading) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-600">
          Loading Jobs...
        </h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl text-red-600">{error}</h2>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Featured Opportunities
          </h2>

          <p>
            Showing <strong>{filteredJobs.length}</strong> Jobs
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h3 className="text-2xl font-bold">
              No Jobs Found
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default JobList;