/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { IoIosArrowDropdown } from "react-icons/io";
import { BiPurchaseTag } from "react-icons/bi";
import { ControlBar, Player } from "video-react";
import { getAnyDataStudentAPI } from "../../../api/studentAPI";
import HeaderLanding from "../layouts/HeaderLanding";
import FooterLanding from "../layouts/FooterLanding";
import { BsArrowBarRight } from "react-icons/bs";
import { FaAngleRight, FaArrowRight } from "react-icons/fa";

function SingleStudentCourse() {
  const [courses, setCourse] = useState([]);

  const auth = useSelector((state) => state.studentToken);
  const Instructor = useSelector((state) => state.studentData);
  const search = useSelector((state) => state.studentSearch);
  const location = useLocation();

  useEffect(() => {
    getAnyDataStudentAPI(`get-course?course=${location.state}`, auth)
      .then((res) => {
        console.log(res.data.data.content.data);
        setCourse(res.data.data.content.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const modules = courses?.topics?.map((item, index) => (
    <div key={item.name} className="w-full group relative">
      <div className="grid grid-cols-3 py-3 w-full">
        <span className="text-start flex align-middle items-center col-span-2">
          <span className="font-medium flex items-center align-middle">
            <IoIosArrowDropdown className="mr-2" /> Module.{" "}
          </span>{" "}
          {index + 1} : {item.name}
        </span>
        <span className="text-end font-semibold col-span-1">
          {item.time} min
        </span>
      </div>
      <div className="hidden group-hover:block px-4 m-2 rounded border-t text-left">
        <span className="font-semibold">Description: </span>
        <br />
        {item.description}

      </div>
    </div>
  ));


  return (
    <>
      <ToastContainer />
      <HeaderLanding token={auth} student={Instructor} search={search} />
      <div className="">
        <div className="mt-20">
          {courses && (
            <>
              <div className="grid md:grid-cols-2 grid-cols-1  text-center text-white bg-gradient-to-r from-[#1f4077] to-[#588de2] md:p-5 p-1 w-full h-96 align-middle justify-items-center justify-center items-center fixed" >
                <div className="flex flex-col p-5">
                  <p className=" text-left text-xl my-3 flex align-middle items-center">Browse<span><FaAngleRight /></span>{courses?.field?.name}<span><FaAngleRight /></span> </p>
                  <p className="font-black text-left md:text-3xl text-xl my-3">{courses.name}</p>
                  
                  <div className="flex items-center my-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p className="text-white font-bold text-sm ml-1">
                      4.96
                      <span className="text-white font-normal">(76 reviews)</span>
                    </p>
                    
                  </div>
                  <p className=" md:text-lg text-left text-xs">{courses.headline}</p>
                  <p className="flex items-center my-3 tracking-wide font-lg"><span>By</span> <img className="mx-2 rounded-full" height="40" width="40" src={courses?.instructor?.image} alt="inst" /><span className=' font-semibold'>{courses?.instructor?.name}</span></p>
                </div>
                <div className="w-full h-full flex-col font-semibold md:text-xl text-lg text-white flex justify-center items-center text-left p-5">

                  <button className="bg-black border rounded p-3 tex-sm font-bold w-1/2">Enroll Now</button>
                  
                </div>
              </div>
              
            </>
          )}
        </div>
        <div className="h-screen mt-96">
          
        </div>
      </div>
      <FooterLanding />
    </>
  );
}

export default SingleStudentCourse;
