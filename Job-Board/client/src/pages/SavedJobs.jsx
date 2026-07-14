import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Building2, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function SavedJobs() {


  const [savedJobs, setSavedJobs] = useState(() => {

    return (
      JSON.parse(localStorage.getItem("savedJobs")) || []
    );

  });



  const removeJob = (id) => {


    const updatedJobs = savedJobs.filter(
      (job) => job.id !== id
    );


    setSavedJobs(updatedJobs);


    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );


  };



  return (

    <>

      <Navbar />


      <main className="bg-slate-50 min-h-screen py-12">


        <div className="max-w-6xl mx-auto px-6">


          <h1 className="text-4xl font-bold text-slate-800 mb-10">

            Saved Jobs

          </h1>



          {
            savedJobs.length === 0 ? (


              <div className="bg-white rounded-2xl shadow p-10 text-center">


                <Bookmark
                  size={60}
                  className="mx-auto text-gray-400"
                />


                <h2 className="text-2xl font-bold mt-5">

                  No Saved Jobs

                </h2>


                <p className="text-gray-500 mt-2">

                  Start saving jobs that interest you.

                </p>



                <Link

                  to="/jobs"

                  className="btn-primary inline-block mt-6"

                >

                  Browse Jobs

                </Link>


              </div>


            ) : (


              <div className="grid md:grid-cols-2 gap-8">



                {
                  savedJobs.map((job) => (


                    <div

                      key={job.id}

                      className="card p-7"

                    >



                      <div className="flex justify-between items-start">


                        <div className="flex gap-4">


                          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">


                            <Building2

                              size={28}

                              className="text-blue-600"

                            />


                          </div>



                          <div>


                            <h2 className="text-xl font-bold">

                              {job.title}

                            </h2>


                            <p className="text-blue-600">

                              {job.company}

                            </p>


                          </div>


                        </div>




                        <Trash2

                          onClick={() => removeJob(job.id)}

                          className="text-red-500 cursor-pointer"

                          size={22}

                        />


                      </div>




                      <p className="text-gray-600 mt-5">

                        📍 {job.location}

                      </p>



                      <p className="text-gray-600 mt-2">

                        💰 {job.salaryText}

                      </p>



                      <div className="flex gap-3 mt-6">


                        <Link

                          to={`/jobs/${job.id}`}

                          className="btn-outline"

                        >

                          View Details

                        </Link>



                        <Link

                          to={`/apply/${job.id}`}

                          className="btn-primary"

                        >

                          Apply

                        </Link>


                      </div>


                    </div>


                  ))

                }



              </div>


            )

          }


        </div>


      </main>


      <Footer />

    </>

  );

}


export default SavedJobs;