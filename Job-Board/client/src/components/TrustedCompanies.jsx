function TrustedCompanies() {

  const companies = [
    {
      name: "Google",
      logo: "G",
    },
    {
      name: "Microsoft",
      logo: "M",
    },
    {
      name: "Amazon",
      logo: "A",
    },
    {
      name: "Adobe",
      logo: "A",
    },
    {
      name: "Netflix",
      logo: "N",
    },
    {
      name: "Deloitte",
      logo: "D",
    },
    {
      name: "TCS",
      logo: "T",
    },
    {
      name: "Infosys",
      logo: "I",
    },
  ];


  return (

    <section className="py-16 bg-white">

      <div className="max-w-7xl mx-auto px-6">


        <div data-aos="fade-up">

          <h2 className="text-center text-3xl font-bold text-slate-800">

            Trusted by Leading Companies

          </h2>


          <p className="text-center text-gray-500 mt-3 mb-10">

            Join thousands of professionals hired by the world's top companies.

          </p>

        </div>





        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">


          {
            companies.map((company, index) => (

              <div

                key={company.name}

                data-aos="zoom-in"

                data-aos-delay={index * 100}

                className="
                bg-slate-50
                border
                rounded-xl
                p-6
                flex
                flex-col
                items-center
                justify-center
                gap-4
                hover:shadow-xl
                hover:-translate-y-2
                transition
                "

              >


                <div className="
                w-16
                h-16
                rounded-full
                bg-blue-100
                flex
                items-center
                justify-center
                text-3xl
                font-bold
                text-blue-600
                ">

                  {company.logo}

                </div>



                <h3 className="text-lg font-semibold text-slate-700">

                  {company.name}

                </h3>


              </div>

            ))

          }


        </div>


      </div>


    </section>

  );

}


export default TrustedCompanies;