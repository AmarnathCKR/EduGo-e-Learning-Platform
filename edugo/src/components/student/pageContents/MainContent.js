/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function MainContent(props) {
  const navigate = useNavigate()
  const token = useSelector((state) => state.studentToken);
  const handleNav = () =>{
    navigate("/courses")
  }
  return (
    <>
      <div className="grid grid-cols-6 gap-3 mt-20 w-full p-8 pr-16">
        <div className="flex align-middle justify-center items-center col-span-6 md:col-span-4">
          <div class="flex-col md:w-3/4 w-full md:p-16 p-2">
            <h1 class="md:text-6xl text-4xl font-semibold text-centermy-6">
              Learn without limits
            </h1>
            <p class="md:text-2xl text-xl text-start my-5">
              Start, switch, or advance your career with more than 5,400
              courses, Professional Certificates, and degrees from world-class
              universities and companies.
            </p>
            <div className="flex justify-start">
              {token ? (
                <button
                  onClick={handleNav}
                  class="bg-black text-white text-xl md:py-3 py-2 px-5 rounded hover:-translate-y-1 md:mr-4 md:my-2"
                >
                  Browse Courses
                </button>
              ) : (
                <>
                  <button
                    onClick={props.show}
                    class="bg-black text-white text-xl md:py-3 py-2 px-5 rounded hover:-translate-y-1 md:mr-4 md:my-2"
                  >
                    Get Started
                  </button>
                  <Link to="/instructor">
                    <button class="bg-primary text-xl text-white hover:-translate-y-1 md:py-3 py-2 px-5 rounded  md:mx-4 mx-2 md:my-2">
                      Teach on Edugo
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className=" justify-center items-center md:col-span-2 col-span-6 md:flex hidden">
          <img
            src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5CFC8u8XiXcbSOlVv6JZQx/4e6f898f57f9d798437b3aa22026e30b/CourseraLearners_C_Composition_Hillary_copy__3_.png?auto=format%2Ccompress&dpr=2&w=459&h=497&q=40"
            alt="efsf"
          />
        </div>
      </div>
    </>
  );
}

export default MainContent;
