import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";


function Footer() {

  return (

    <footer className="bg-slate-950 text-gray-300 pt-16 pb-8">


      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">



        {/* Company */}

        <div>

          <h2 className="text-3xl font-bold text-white">

            Hire<span className="text-blue-500">Hub</span>

          </h2>


          <p className="mt-5 text-gray-400 leading-7">

            HireHub connects talented professionals
            with top companies. Discover opportunities,
            build your career, and achieve success.

          </p>


        </div>





        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-5">

            Quick Links

          </h3>


          <ul className="space-y-3">


            <li className="hover:text-blue-400 cursor-pointer transition">

              Home

            </li>


            <li className="hover:text-blue-400 cursor-pointer transition">

              Jobs

            </li>


            <li className="hover:text-blue-400 cursor-pointer transition">

              Login

            </li>


            <li className="hover:text-blue-400 cursor-pointer transition">

              Register

            </li>


          </ul>


        </div>






        {/* Contact */}

        <div>


          <h3 className="text-xl font-semibold text-white mb-5">

            Contact

          </h3>



          <div className="space-y-5">


            <div className="flex items-center gap-3">

              <Mail 
                size={20}
                className="text-blue-400"
              />

              <span>

                support@hirehub.com

              </span>

            </div>





            <div className="flex items-center gap-3">


              <Phone
                size={20}
                className="text-blue-400"
              />


              <span>

                +91 98765 43210

              </span>


            </div>





            <div className="flex items-center gap-3">


              <MapPin
                size={20}
                className="text-blue-400"
              />


              <span>

                Hyderabad, India

              </span>


            </div>


          </div>


        </div>








        {/* Social Media */}

        <div>


          <h3 className="text-xl font-semibold text-white mb-5">

            Follow Us

          </h3>


          <p className="text-gray-400 mb-5">

            Stay connected with HireHub.

          </p>



          <div className="flex gap-4">


            <div
              className="
              w-10 h-10 rounded-full
              bg-slate-800
              flex items-center justify-center
              hover:bg-blue-600
              hover:text-white
              cursor-pointer
              transition
              "
            >

              f

            </div>





            <div
              className="
              w-10 h-10 rounded-full
              bg-slate-800
              flex items-center justify-center
              hover:bg-pink-500
              hover:text-white
              cursor-pointer
              transition
              "
            >

              ◎

            </div>





            <div
              className="
              w-10 h-10 rounded-full
              bg-slate-800
              flex items-center justify-center
              hover:bg-blue-500
              hover:text-white
              cursor-pointer
              transition
              "
            >

              in

            </div>





            <div
              className="
              w-10 h-10 rounded-full
              bg-slate-800
              flex items-center justify-center
              hover:bg-sky-400
              hover:text-white
              cursor-pointer
              transition
              "
            >

              𝕏

            </div>


          </div>



        </div>



      </div>






      {/* Bottom Footer */}


      <div className="max-w-7xl mx-auto px-6">


        <hr className="border-gray-800 my-10"/>



        <div className="text-center text-gray-500 text-sm">


          © {new Date().getFullYear()} HireHub.
          All Rights Reserved.


        </div>


      </div>




    </footer>

  );

}


export default Footer;