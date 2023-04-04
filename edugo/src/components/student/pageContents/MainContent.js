import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { subscribeCourse } from "../../../store/store";
import { useDispatch } from "react-redux";
import { RotateSpinner } from "react-spinners-kit";

function MainContent() {
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    setState(true);
    const url = "http://localhost:5000/instructor/fetch-allCourse";
    axios
      .get(url)
      .then((res) => {
        setLoading(false);
        // dispatch(subscribeAllCourse(res.data.data.content.data));
        // setState(true)
      })
      .catch((err) => {
        setLoading(false);

        console.log(err.response.data.data.errors[0].message);
        // setState(true)
      });
  }, []);

  return (
    <>
      {state && (
        <>
        {loading ? <div className="z-40  p-64 loader-local bg-secondary"><RotateSpinner size="60" color="#000" /></div>: ""}
        <div className="grid grid-cols-6 gap-3 mt-20 w-full p-8 pr-16">
          <div className="flex align-middle justify-center items-center col-span-6 md:col-span-4">
            <div class="flex-col w-3/4 md:p-16 p-2">
              <h1 class="md:text-6xl text-4xl font-semibold text-centermy-6">
                Learn without limits
              </h1>
              <p class="md:text-2xl text-xl text-start my-5">
                Start, switch, or advance your career with more than 5,400
                courses, Professional Certificates, and degrees from world-class
                universities and companies.
              </p>
              <div className="flex justify-start">
                <button class="bg-black text-white text-xl py-3 px-5 rounded  mr-4 my-2">
                  Join for Free
                </button>
                <Link to="/instructor">
                  <button class="bg-primary text-xl text-white py-3 px-5 rounded  mx-4 my-2">
                    Teach on Edugo
                  </button>
                </Link>
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
      )}
    </>
  );
}

export default MainContent;
