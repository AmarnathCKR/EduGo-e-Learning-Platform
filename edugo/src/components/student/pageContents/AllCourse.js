import { Icon } from "@iconify/react";
import React, { useEffect } from "react";

function AllCourse(props) {
  const style = {
    width: "250px",
    height: "150px",
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
        <div class="local-wrapper mx-4 p-5 shadow antialiased text-gray-900">
          <div >
            <img
              className="w-100 h-100"
              style={style}
              src={data.image}
              alt=" random imgee"
              class="w-full object-cover object-center rounded-lg shadow-md"
            />

            <div class="relative  -mt-22  ">
              <div class="bg-white p-6 w-60 h-52 rounded-lg shadow-lg">
                <div class="flex items-center justify-center">
                  <span class="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
                    New
                  </span>
                </div>

                <h4 class="mt-1 text-xl font-semibold uppercase leading-tight truncate">
                  {data.name}
                </h4>

                <div class="mt-1">₹ {data.price}</div>
                <div class="mt-4">
                  <span class="text-sm text-clip text-gray-600">
                    {data.headline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  });

  return (
    <div className="relative border shadow py-5 bg-neutral-50">
      <h1 className="mx-9 text-start font-serif font-semibold text-3xl">
        Check out our courses{" "}
      </h1>
      <div id="scroll-container" className="text-center flex scroll-x p-12 ">
        {allCourse}
      </div>
      <button
        id="left-button"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 md:flex hidden"
      >
        <Icon className="w-20 h-auto" icon="material-symbols:arrow-left" />
      </button>
      <button
        id="right-button"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 md:flex hidden"
      >
        <Icon className="w-20 h-auto" icon="material-symbols:arrow-right" />
      </button>
    </div>
  );
}

export default AllCourse;
