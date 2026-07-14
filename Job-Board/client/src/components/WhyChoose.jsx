import {
  ShieldCheck,
  Clock3,
  BadgeCheck,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={42} />,
    title: "Verified Companies",
    description:
      "Every employer is verified to ensure genuine job opportunities.",
  },
  {
    icon: <Clock3 size={42} />,
    title: "Quick Hiring",
    description:
      "Apply with one click and receive faster interview responses.",
  },
  {
    icon: <BadgeCheck size={42} />,
    title: "Trusted Platform",
    description:
      "Thousands of students and professionals trust HireHub every day.",
  },
  {
    icon: <Users size={42} />,
    title: "Career Support",
    description:
      "Resume guidance, interview preparation, and career assistance.",
  },
];

function WhyChoose() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Why Choose HireHub?
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Everything you need to build your career with confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => (

            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="
              group
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-8
              shadow-md
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
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

              <p className="mt-4 text-gray-500 leading-7">
                {item.description}
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
                Learn More
                <ArrowRight size={18} />
              </button>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChoose;