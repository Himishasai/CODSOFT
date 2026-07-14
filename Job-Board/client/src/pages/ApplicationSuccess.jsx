import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function ApplicationSuccess() {

  return (

    <>

      <Navbar />


      <main className="bg-slate-50 min-h-screen flex items-center justify-center px-6">


        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl text-center">


          <CheckCircle
            size={80}
            className="text-green-500 mx-auto"
          />


          <h1 className="text-4xl font-bold text-slate-800 mt-6">

            Application Submitted!

          </h1>


          <p className="text-gray-600 mt-4 text-lg">

            Your application has been successfully submitted.
            The recruiter will review your profile and contact you
            if you are shortlisted.

          </p>



          <div className="flex gap-4 justify-center mt-8">


            <Link
              to="/jobs"
              className="btn-outline"
            >

              Browse More Jobs

            </Link>



            <Link
              to="/"
              className="btn-primary"
            >

              Go Home

            </Link>


          </div>


        </div>


      </main>


      <Footer />

    </>

  );

}


export default ApplicationSuccess;