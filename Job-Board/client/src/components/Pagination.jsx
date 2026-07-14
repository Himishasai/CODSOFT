import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination() {
  return (
    <section className="py-12 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-center items-center gap-3">

          {/* Previous */}

          <button
            className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            hover:bg-blue-600
            hover:text-white
            transition
            "
          >

            <ChevronLeft size={18} />

            Previous

          </button>

          {/* Pages */}

          <button className="w-11 h-11 rounded-lg bg-blue-600 text-white font-semibold">
            1
          </button>

          <button className="w-11 h-11 rounded-lg border hover:bg-blue-600 hover:text-white transition">
            2
          </button>

          <button className="w-11 h-11 rounded-lg border hover:bg-blue-600 hover:text-white transition">
            3
          </button>

          <button className="w-11 h-11 rounded-lg border hover:bg-blue-600 hover:text-white transition">
            4
          </button>

          {/* Next */}

          <button
            className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            hover:bg-blue-600
            hover:text-white
            transition
            "
          >

            Next

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default Pagination;