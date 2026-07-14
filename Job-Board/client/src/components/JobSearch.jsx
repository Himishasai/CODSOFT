import { Search, MapPin } from "lucide-react";

function JobSearch({ searchTerm, setSearchTerm }) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-sky-500 py-20">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-5xl font-bold text-white">
          Find Your Dream Job
        </h1>

        <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto">
          Explore thousands of job opportunities from top companies
          across India and around the world.
        </p>

        {/* Search Box */}

        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-12">

          <div className="grid lg:grid-cols-3 gap-5">

            {/* Job Search */}

            <div className="flex items-center border rounded-xl px-4 py-3">

              <Search
                className="text-blue-600"
                size={22}
              />

              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-3 w-full outline-none"
              />

            </div>

            {/* Location Preview */}

            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">

              <MapPin
                className="text-blue-600"
                size={22}
              />

              <span className="ml-3 text-gray-600">
                Use filters below
              </span>

            </div>

            {/* Search Button */}

            <button className="btn-primary w-full">

              Search Jobs

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default JobSearch;