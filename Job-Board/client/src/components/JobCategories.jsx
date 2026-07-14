import {
  Code2,
  Database,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  BriefcaseBusiness,
  Palette,
  BarChart3,
  ArrowRight,
} from "lucide-react";

function JobCategories() {

  const categories = [

    {
      icon: <Code2 size={42} />,
      title: "Software Development",
      jobs: "1,250 Jobs",
    },

    {
      icon: <Database size={42} />,
      title: "Data Analyst",
      jobs: "820 Jobs",
    },

    {
      icon: <BrainCircuit size={42} />,
      title: "AI / Machine Learning",
      jobs: "610 Jobs",
    },

    {
      icon: <ShieldCheck size={42} />,
      title: "Cyber Security",
      jobs: "540 Jobs",
    },

    {
      icon: <Cloud size={42} />,
      title: "Cloud Computing",
      jobs: "710 Jobs",
    },

    {
      icon: <Palette size={42} />,
      title: "UI / UX Design",
      jobs: "430 Jobs",
    },

    {
      icon: <BarChart3 size={42} />,
      title: "Marketing",
      jobs: "690 Jobs",
    },

    {
      icon: <BriefcaseBusiness size={42} />,
      title: "Finance",
      jobs: "520 Jobs",
    },

  ];



  return (

    <section className="py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">


        <div
          className="text-center mb-14"
          data-aos="fade-up"
        >

          <h2 className="text-4xl font-bold text-slate-900">

            Explore Job Categories

          </h2>

          <p className="mt-4 text-gray-500 text-lg">

            Discover opportunities across today's fastest-growing industries.

          </p>

        </div>





        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


          {categories.map((item, index) => (

            <div

              key={index}

              data-aos="zoom-in"

              data-aos-delay={index * 100}

              className="
              bg-white
              rounded-2xl
              p-8
              shadow-md
              border
              border-gray-100
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              group
              cursor-pointer
              "

            >


              <div
                className="
                w-16
                h-16
                rounded-xl
                bg-blue-100
                flex
                items-center
                justify-center
                text-blue-600
                mb-6
                group-hover:bg-blue-600
                group-hover:text-white
                transition
                "
              >

                {item.icon}

              </div>



              <h3 className="text-xl font-bold text-slate-800">

                {item.title}

              </h3>



              <p className="mt-2 text-gray-500">

                {item.jobs}

              </p>



              <button
                className="
                mt-6
                flex
                items-center
                gap-2
                text-blue-600
                font-semibold
                group-hover:gap-3
                transition-all
                "
              >

                View Jobs

                <ArrowRight size={18} />

              </button>


            </div>

          ))}


        </div>


      </div>

    </section>

  );

}

export default JobCategories;