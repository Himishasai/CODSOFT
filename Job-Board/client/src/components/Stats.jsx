import {
  Briefcase,
  Building2,
  Users,
  Award
} from "lucide-react";

import { useEffect, useState } from "react";


function AnimatedNumber({ number, suffix }) {

  const [count, setCount] = useState(0);


  useEffect(() => {

    let start = 0;

    const duration = 2000;

    const increment = number / (duration / 20);


    const timer = setInterval(() => {

      start += increment;


      if (start >= number) {

        start = number;

        clearInterval(timer);

      }


      setCount(Math.floor(start));


    }, 20);



    return () => clearInterval(timer);


  }, [number]);



  return (

    <>

      {count.toLocaleString()}

      {suffix}

    </>

  );

}




function Stats() {


  const stats = [

    {
      icon: <Briefcase size={40} />,
      number: 50000,
      suffix: "+",
      title: "Jobs Available",
    },

    {
      icon: <Building2 size={40} />,
      number: 12000,
      suffix: "+",
      title: "Companies",
    },

    {
      icon: <Users size={40} />,
      number: 1000000,
      suffix: "+",
      title: "Candidates",
    },

    {
      icon: <Award size={40} />,
      number: 95,
      suffix: "%",
      title: "Hiring Success",
    },

  ];




  return (

    <section className="bg-blue-600 py-20">


      <div className="max-w-7xl mx-auto px-6">


        <div className="grid md:grid-cols-4 gap-8">



          {
            stats.map((item, index) => (


              <div

                key={index}

                data-aos="zoom-in"

                data-aos-delay={index * 100}

                className="
                bg-white
                rounded-2xl
                p-8
                text-center
                shadow-lg
                hover:-translate-y-2
                transition
                duration-300
                "

              >



                <div className="
                text-blue-600
                flex
                justify-center
                mb-5
                ">

                  {item.icon}

                </div>





                <h2 className="
                text-4xl
                font-bold
                text-slate-900
                ">


                  <AnimatedNumber

                    number={item.number}

                    suffix={item.suffix}

                  />


                </h2>





                <p className="mt-2 text-gray-600">

                  {item.title}

                </p>




              </div>


            ))

          }



        </div>


      </div>


    </section>


  );

}


export default Stats;