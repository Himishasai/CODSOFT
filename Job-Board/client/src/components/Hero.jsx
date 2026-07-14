import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";


function Hero() {

  return (

    <section className="pt-28 pb-16 bg-white">


      <div className="max-w-7xl mx-auto px-6">


        <div
          className="text-center max-w-4xl mx-auto"
          data-aos="fade-up"
        >


          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">


            Find Your

            <span className="text-blue-600">
              Dream Career
            </span>


            With HireHub


          </h1>





          <p className="mt-6 text-lg text-gray-600">


            Explore thousands of job opportunities from
            top companies and take the next step in your career.


          </p>







          {/* Search Bar */}


          <div className="mt-10 bg-white shadow-xl rounded-2xl p-4">


            <div className="grid md:grid-cols-3 gap-4">



              <div className="flex items-center gap-3 border rounded-xl px-4 py-3">


                <Search
                  size={22}
                  className="text-blue-600"
                />


                <input

                  type="text"

                  placeholder="Search job title"

                  className="outline-none w-full"

                />


              </div>





              <div className="flex items-center gap-3 border rounded-xl px-4 py-3">


                <MapPin

                  size={22}

                  className="text-blue-600"

                />


                <input

                  type="text"

                  placeholder="Location"

                  className="outline-none w-full"

                />


              </div>





              <button

                className="
                bg-blue-600
                text-white
                rounded-xl
                hover:bg-blue-700
                transition
                font-semibold
                "

              >

                Search Jobs


              </button>



            </div>



          </div>








          {/* Buttons */}


          <div className="mt-8 flex justify-center gap-5">


            <Link

              to="/jobs"

              className="
              bg-blue-600
              text-white
              px-7
              py-3
              rounded-xl
              hover:bg-blue-700
              transition
              "

            >

              Browse Jobs


            </Link>





            <Link

              to="/register"

              className="
              border
              border-blue-600
              text-blue-600
              px-7
              py-3
              rounded-xl
              hover:bg-blue-50
              transition
              "

            >

              Recruiter?


            </Link>


          </div>



        </div>






        {/* Stats Cards */}


        <div

          className="
          grid
          md:grid-cols-3
          gap-6
          mt-16
          "

          data-aos="fade-up"

        >



          <div className="
          p-6
          rounded-2xl
          bg-blue-50
          text-center
          hover:-translate-y-2
          transition
          ">

            <h3 className="text-3xl font-bold text-blue-600">
              10,000+
            </h3>

            <p className="text-gray-600 mt-2">
              Active Jobs
            </p>

          </div>





          <div className="
          p-6
          rounded-2xl
          bg-blue-50
          text-center
          hover:-translate-y-2
          transition
          ">


            <h3 className="text-3xl font-bold text-blue-600">
              500+
            </h3>


            <p className="text-gray-600 mt-2">
              Companies
            </p>


          </div>





          <div className="
          p-6
          rounded-2xl
          bg-blue-50
          text-center
          hover:-translate-y-2
          transition
          ">


            <h3 className="text-3xl font-bold text-blue-600">
              95%
            </h3>


            <p className="text-gray-600 mt-2">
              Success Rate
            </p>


          </div>




        </div>



      </div>


    </section>

  );

}


export default Hero;