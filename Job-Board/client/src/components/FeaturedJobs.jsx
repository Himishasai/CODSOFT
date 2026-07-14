import {
  MapPin,
  Briefcase,
  IndianRupee,
  Bookmark,
  ArrowRight,
} from "lucide-react";

const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "₹12–18 LPA",
    type: "Full Time",
    experience: "2–4 Years",
    logo: "G",
  },
  {
    title: "Data Analyst",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹10–15 LPA",
    type: "Remote",
    experience: "1–3 Years",
    logo: "M",
  },
  {
    title: "Backend Developer",
    company: "Amazon",
    location: "Pune",
    salary: "₹15–20 LPA",
    type: "Full Time",
    experience: "3–5 Years",
    logo: "A",
  },
  {
    title: "UI / UX Designer",
    company: "Adobe",
    location: "Mumbai",
    salary: "₹8–12 LPA",
    type: "Hybrid",
    experience: "1–3 Years",
    logo: "A",
  },
];

function FeaturedJobs() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="text-center mb-14"
          data-aos="fade-up"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Featured Jobs
          </h2>

          <p className="mt-4 text-gray-500 text-lg">
            Apply for the latest opportunities from leading companies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {jobs.map((job, index) => (

            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="
              bg-white
              rounded-2xl
              shadow-md
              border
              border-gray-100
              p-8
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              "
            >

              <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">

                  <div className="
                  w-14
                  h-14
                  rounded-xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  text-blue-600
                  font-bold
                  text-2xl
                  ">
                    {job.logo}
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {job.title}
                    </h3>

                    <p className="text-blue-600 font-semibold">
                      {job.company}
                    </p>

                  </div>

                </div>

                <Bookmark
                  className="text-gray-400 hover:text-blue-600 cursor-pointer"
                  size={22}
                />

              </div>

              <div className="mt-8 space-y-4 text-gray-600">

                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  {job.location}
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee size={18} />
                  {job.salary}
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase size={18} />
                  {job.type}
                </div>

              </div>

              <div className="mt-6 flex justify-between items-center">

                <span className="
                bg-blue-100
                text-blue-700
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                ">
                  {job.experience}
                </span>

                <button className="
                flex
                items-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-lg
                transition
                ">

                  Apply Now

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default FeaturedJobs;