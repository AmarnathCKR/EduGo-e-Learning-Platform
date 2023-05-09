/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,  useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import { IoIosArrowDropdown } from "react-icons/io";
import { TbCertificate } from "react-icons/tb";
import { getAnyDataStudentAPI } from "../../../api/studentAPI";
import HeaderLanding from "../layouts/HeaderLanding";
import FooterLanding from "../layouts/FooterLanding";
import { FaAngleRight } from "react-icons/fa";


function SingleStudentCourse() {
  const [courses, setCourse] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [active, setActive] = useState(false);
  const [owned, setOwned] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition >= 260) {
      // perform action when scroll position is greater than or equal to 500
      setActive(true)

    }
    if (scrollPosition <= 260) {
      setActive(false)
    }
  }, [scrollPosition]);


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

  useEffect(() => {
    getAnyDataStudentAPI(`get-status?course=${location.state}`, auth)
      .then((res) => {
        setOwned(true)
      })
      .catch((err) => console.log(err));
  }, [])

  const navigate = useNavigate();

  

  const contents = courses?.topics?.map((item, index) => (
    <div key={item.name} className=" w-full group ">
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

        <br />
        {item.description}

      </div>
    </div>
  ));

  return (
    <><div className="flex flex-col">
      <ToastContainer />
      <HeaderLanding token={auth} student={Instructor} search={search} />

      <div className="mt-20">
        {courses && (
          <>
            <div className={active ? "grid md:grid-cols-2 grid-cols-1  text-center text-white bg-gradient-to-r from-[#1f4077] to-[#588de2] p-1 w-full md:h-24 h-32 align-middle justify-items-center justify-center items-center fixed" : "grid md:grid-cols-2 grid-cols-1  text-center text-white bg-gradient-to-r from-[#1f4077] to-[#588de2] md:p-5 p-1 w-full h-96 align-middle justify-items-center justify-center items-center"} >
              <div className="flex flex-col md:p-5 p-1 md:px-1 px-5">
                <p className={active ? " text-left md:text-lg text-base md:my-3 my-0 align-middle items-center hidden" : " text-left md:text-lg text-base my-3 flex align-middle items-center"}>Browse<span><FaAngleRight /></span>{courses?.field?.name}<span><FaAngleRight /></span> </p>
                <p className={active ? "md:font-black font-bold text-left md:text-2xl text-lg md:my-3" : "font-black text-left md:text-3xl text-lg my-3"}>{courses.name}</p>

                <div className={active ? "hidden items-center my-2" : "flex items-center my-2"}>
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
                <p className={active ? "hidden md:text-lg text-left text-xs" : " md:text-lg text-left text-xs"}>{courses.headline}</p>
                <p className={active ? "hidden items-center my-3 tracking-wide font-lg" : "flex items-center my-3 tracking-wide font-lg"}><span>By</span> <img className="mx-2 rounded-full" height="40" width="40" src={courses?.instructor?.image} alt="inst" /><span className=' font-semibold'>{courses?.instructor?.name}</span></p>
              </div>
              <div className="w-full h-full flex-col font-semibold md:text-xl text-lg text-white flex justify-center items-center text-left ">

                {owned ? <button onClick={() => { navigate(`/owned-course/:${courses._id}`, { state: courses._id }) }} className="border-2 border-white rounded md:p-3 p-2 text-sm tracking-wide font-bold w-1/2 shadow-[#1f4077] hover:shadow-lg">Go back to Learning</button>
                  : <button onClick={() => { navigate(`/purchase-course/:${courses._id}`, { state: courses._id }) }} className="border-2 border-white rounded md:p-3 p-2 text-sm tracking-wide font-bold w-1/2 shadow-[#1f4077] hover:shadow-lg">Enroll Now</button>
                }

              </div>
            </div>

          </>
        )}
        <div className={active ? "md:scroll-mt-40 mt-96 h-fit z-30" : "z-30 h-fit"}>
          <div className="grid md:grid-cols-5 grid-cols-1 md:px-14 px-1 ">
            <div className="md:p-5 p-2 flex flex-col  md:col-span-3 col-span-5">
              <h1 className="my-2 font-bold md:text-2xl text-xl md:mx-0 mx-3">Course Description</h1>
              <p className="md:text-lg text-sm font-medium md:mx-0 mx-3 mb-5">{courses.description}</p>
              <h1 className="my-2 font-bold md:text-2xl text-xl md:mx-0 mx-3">Course Module Details</h1>
              {contents}
            </div>
            <div className="md:p-5 p-2 md:col-span-2 col-span-5 flex flex-col align-middle justify-start items-center">
              <p className="flex align-middle p-8 justify-center items-center w-full"><span className="border-[#baafaf] border p-2 mx-2 rounded-full"><TbCertificate size="35px" /></span><span className="flex flex-col"><h1 className="text-xl font-bold">Certificate</h1><h4>Earn a Certificate upon completion</h4></span></p>
              <p className="flex align-middle p-8 lg:ml-16 justify-center items-center w-full"><span className="border-[#baafaf] border p-2 mx-2 rounded-full"><TbCertificate size="35px" /></span><span className="flex flex-col"><h1 className="text-xl font-bold">100% online courses</h1><h4>Start instantly and learn at your own schedule.</h4></span></p>
              <p className="flex align-middle p-8 justify-center items-center w-full"><span className="border-[#baafaf] border p-2 mx-2 rounded-full"><TbCertificate size="35px" /></span><span className="flex flex-col"><h1 className="text-xl font-bold">Flexible Schedule</h1><h4>Set and maintain flexible deadlines.</h4></span></p>

              <div className="flex p-8 justify-center items-center w-full">

                <p className="items-center flex my-3 tracking-wide font-lg"><span>By</span> <img className="mx-2 rounded-full" height="40" width="40" src={courses?.instructor?.image} alt="inst" /><span className=' font-semibold'>{courses?.instructor?.name}</span></p>

              </div>

              <div className="w-full my-2 flex-col font-semibold md:text-xl text-lg text-white flex justify-center items-center text-left ">

                {owned ? <button onClick={() => { navigate(`/purcase-course/:${courses._id}`, { state: courses._id }) }} className="border-2 md:p-3 p-2 text-sm text-black tracking-wide w-3/4 font-bold shadow-[#1f4077] hover:shadow-lg">Go back to Learning</button>
                  : <button onClick={() => { navigate(`/purchase-course/:${courses._id}`, { state: courses._id }) }} className="border-2 md:p-3 p-2 text-sm text-black tracking-wide w-3/4 font-bold shadow-[#1f4077] hover:shadow-lg">Enroll Now for ₹{courses.price}</button>
                }
              </div>
            </div>
          </div>
        </div>
        <FooterLanding />
      </div>



    </div>
    </>
  );
}

export default SingleStudentCourse;
