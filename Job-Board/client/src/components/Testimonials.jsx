import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer @ Google",
    review:
      "HireHub helped me land my dream job within two weeks. The hiring process was smooth, and I received interview calls much faster than expected.",
    avatar: "R",
  },
  {
    name: "Priya Reddy",
    role: "Data Analyst @ Microsoft",
    review:
      "The platform is clean, intuitive, and offers high-quality job opportunities. I would definitely recommend it to fresh graduates.",
    avatar: "P",
  },
  {
    name: "Arjun Kumar",
    role: "Frontend Developer @ Amazon",
    review:
      "I loved the modern interface, quick application process, and excellent company listings. It made my job search effortless.",
    avatar: "A",
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            What Our Users Say
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Thousands of professionals trust HireHub to build their careers.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((user, index) => (

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

              <Quote
                className="text-blue-600 mb-6"
                size={34}
              />

              <div className="flex text-yellow-400 mb-5">

                {[...Array(5)].map((_, i) => (

                  <Star
                    key={i}
                    size={18}
                    fill="currentColor"
                  />

                ))}

              </div>

              <p className="text-gray-600 leading-7 italic">
                "{user.review}"
              </p>

              <div className="flex items-center gap-4 mt-8">

                <div
                  className="
                  w-14
                  h-14
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  text-blue-600
                  font-bold
                  text-xl
                  "
                >
                  {user.avatar}
                </div>

                <div>

                  <h3 className="font-bold text-lg text-slate-900">
                    {user.name}
                  </h3>

                  <p className="text-blue-600 text-sm">
                    {user.role}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;