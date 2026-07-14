import { Filter, MapPin, Briefcase, IndianRupee } from "lucide-react";

function JobFilters({
  location,
  setLocation,
  category,
  setCategory,
  jobType,
  setJobType,
  salary,
  setSalary,
}) {
  const clearFilters = () => {
    setLocation("All Locations");
    setCategory("All Categories");
    setJobType("All Job Types");
    setSalary("Salary");
  };

  return (
    <section className="bg-white border-b py-8">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="flex items-center gap-3 mb-6">

          <Filter
            className="text-blue-600"
            size={24}
          />

          <h2 className="text-2xl font-bold">
            Filter Jobs
          </h2>

        </div>

        {/* Filters */}

        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-5">

          {/* Location */}

          <div className="relative">

            <MapPin
              size={18}
              className="absolute left-4 top-4 text-blue-600"
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field pl-10"
            >
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Mumbai</option>
              <option>Chennai</option>
              <option>Gurgaon</option>
            </select>

          </div>

          {/* Category */}

          <div className="relative">

            <Briefcase
              size={18}
              className="absolute left-4 top-4 text-blue-600"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field pl-10"
            >
              <option>All Categories</option>
              <option>Software Development</option>
              <option>Data Analyst</option>
              <option>Business Analyst</option>
              <option>Cyber Security</option>
              <option>Cloud Computing</option>
              <option>UI / UX Design</option>
            </select>

          </div>

          {/* Job Type */}

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="input-field"
          >
            <option>All Job Types</option>
            <option>Full Time</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>

          {/* Salary */}

          <div className="relative">

            <IndianRupee
              size={18}
              className="absolute left-4 top-4 text-blue-600"
            />

            <select
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="input-field pl-10"
            >
              <option>Salary</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>

          </div>

          {/* Clear */}

          <button
            onClick={clearFilters}
            className="btn-outline"
          >
            Clear Filters
          </button>

        </div>

      </div>

    </section>
  );
}

export default JobFilters;