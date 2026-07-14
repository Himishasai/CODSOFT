import { useState } from "react";

import Navbar from "../components/Navbar";
import JobSearch from "../components/JobSearch";
import JobFilters from "../components/JobFilters";
import JobList from "../components/JobList";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [jobType, setJobType] = useState("All Job Types");
  const [salary, setSalary] = useState("Salary");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <JobSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <JobFilters
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          jobType={jobType}
          setJobType={setJobType}
          salary={salary}
          setSalary={setSalary}
        />

        <JobList
          searchTerm={searchTerm}
          location={location}
          category={category}
          jobType={jobType}
          salary={salary}
        />

        <Pagination />
      </main>

      <Footer />
    </>
  );
}

export default Jobs;