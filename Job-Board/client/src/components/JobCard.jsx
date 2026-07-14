import { useState } from "react";

import {
  MapPin,
  IndianRupee,
  Clock3,
  Bookmark,
  Building2,
} from "lucide-react";

import { Link } from "react-router-dom";


function JobCard({ job }) {


  const [isSaved, setIsSaved] = useState(() => {

    const savedJobs =
      JSON.parse(localStorage.getItem("savedJobs")) || [];


    return savedJobs.some(
      (item) => item.id === job.id
    );

  });



  const saveJob = () => {


    let savedJobs =
      JSON.parse(localStorage.getItem("savedJobs")) || [];



    const alreadySaved = savedJobs.find(
      (item) => item.id === job.id
    );



    if (alreadySaved) {


      savedJobs = savedJobs.filter(
        (item) => item.id !== job.id
      );


      setIsSaved(false);


    } else {


      savedJobs.push(job);


      setIsSaved(true);


    }



    localStorage.setItem(
      "savedJobs",
      JSON.stringify(savedJobs)
    );


  };



  return (

    <div className="card p-7">


      {/* Header */}


      <div className="flex justify-between items-start">


        <div className="flex items-center gap-4">


          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">


            <Building2
              size={28}
              className="text-blue-600"
            />


          </div>



          <div>


            <h2 className="text-2xl font-bold text-slate-800">

              {job.title}

            </h2>



            <p className="text-blue-600 font-semibold mt-1">

              {job.company}

            </p>


          </div>


        </div>




        <Bookmark

          onClick={saveJob}

          className={`cursor-pointer transition ${
            isSaved
              ? "text-blue-600 fill-blue-600"
              : "text-gray-400 hover:text-blue-600"
          }`}

          size={24}

        />


      </div>





      {/* Details */}


      <div className="flex flex-wrap gap-5 mt-6 text-gray-600">


        <div className="flex items-center gap-2">

          <MapPin size={18} />

          {job.location}

        </div>



        <div className="flex items-center gap-2">

          <IndianRupee size={18} />

          {job.salaryText}

        </div>



        <div className="flex items-center gap-2">

          <Clock3 size={18} />

          {job.type}

        </div>


      </div>





      {/* Skills */}


      <div className="flex flex-wrap gap-3 mt-6">


        {job.skills.map((skill, index) => (


          <span

            key={index}

            className="badge"

          >

            {skill}

          </span>


        ))}


      </div>





      {/* Footer */}


      <div className="flex justify-between items-center mt-8">


        <span className="text-gray-500 text-sm">

          Posted {job.posted}

        </span>




        <div className="flex gap-3">



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

            Apply Now

          </Link>



        </div>


      </div>



    </div>

  );

}


export default JobCard;