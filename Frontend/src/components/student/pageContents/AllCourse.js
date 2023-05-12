import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function AllCourse(props) {
  const style = {
    width: "550px",
    height: "300px",
  };

  useEffect(() => {
    const left = document.getElementById("left-button");
    const container = document.getElementById("scroll-container");
    const right = document.getElementById("right-button");
    left.addEventListener("click", () => {
      container.scrollBy({ left: -310, behavior: "smooth" }); // scroll left by 100 pixels with smooth animation
    });

    right.addEventListener("click", () => {
      container.scrollBy({ left: 310, behavior: "smooth" }); // scroll right by 100 pixels with smooth animation
    });
  }, []);
  const allCourse = props.courses.map((data) => {
    return (
      <>
        <div class="local-wrapper mx-2 p-3 ">
          <div class="w-96 p-5 rounded overflow-hidden shadow-lg">
            <img
              style={style}
              class="w-full"
              src={data.image}
              alt="Sunset in the mountains"
            />
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{data.name}</div>
              <p class="text-gray-700 text-base">
                {data.headline}
              </p>
              <Link to="/courses">
                <p

                  class="text-body-color hover:border-primary hover:bg-primary inline-block rounded-full border border-[#E5E7EB] py-2 px-7 text-base font-medium transition hover:text-white"
                >
                  View Details
                </p>
              </Link>
            </div>

          </div>
        </div>
      </>
    );
  });

  return (
    <div className="relative border py-5 bg-white">
      <h1 className="mx-9 text-center md:text-5xl text-4xl font-semibold my-1">
        Check out our courses
      </h1>
      <div id="scroll-container" className="text-center flex scroll-x p-10 ">
        {allCourse}
      </div>
      <button
        id="left-button"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 md:flex hidden"
      >
        <Icon className="w-16 h-auto" icon="material-symbols:chevron-left" />
      </button>
      <button
        id="right-button"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 md:flex hidden"
      >
        <Icon className="w-16 h-auto" icon="material-symbols:chevron-right" />
      </button>
    </div>
  );
}

export default AllCourse;
