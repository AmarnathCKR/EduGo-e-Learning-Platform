/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { getAnyData } from "../../../api/instructorAPI";
import { IoIosArrowDropdown, } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import ReactPlayer from 'react-player';


function SingleCourse() {
  const [courses, setCourse] = useState([]);
  const Instructor = useSelector((state) => state.InstructorProfile);



  const token = useSelector((state) => state.token);
  const location = useLocation();

  useEffect(() => {
    getAnyData(`get-course?course=${location.state}`, token)
      .then((res) => {
        console.log(res.data.data.content.data);
        setCourse(res.data.data.content.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate()

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
        <p className="text-center font-medium">Content Video</p>
        <ReactPlayer
          className={"md:h-96 h-full z-20"}
          url={item.video}
          width='100%'

          controls={true}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}

        />
      </div>
    </div>
  ));


  return (
    <>
      <ToastContainer />
      <Header Instructor={Instructor} token={token} />
      <div className="md:p-8 p-2">
        <div className="mt-24 border shadow">
          {courses && (
            <>
              <div className="mt-10 p-8  text-center">
                <div className="flex flex-col md:px-8 px-3 justify-center items-center">
                  <h1 className=" text-center font-semibold text-2xl py-6">
                    {courses.name}
                  </h1>
                  <div className="grid grid-cols-2  justify-center w-full">
                    <div className="md:col-span-1 col-span-2 flex justify-center items-center">
                      <img width={150} src={courses.image} alt="img" />
                    </div>

                    <div className="md:col-span-1 col-span-2">
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Experience Level :{" "}
                        </span>
                        {courses.experience}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Field of Study :{" "}
                        </span>{" "}
                        {courses?.field?.name}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">Price : </span> ₹
                        {courses.price}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">Total Time : </span>{" "}
                        {courses.total} minutes
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start w-full">
                    <h1 className=" text-start text-lg  py-2">
                      <span className="  font-semibold">Headline : </span>
                      {courses.headline}
                    </h1>
                    <h1 className=" text-start text-lg  py-2">
                      <span className="  font-semibold">Description : </span>
                      {courses.description}
                    </h1>

                    <h1 className=" text-start text-lg  py-2">
                      <span className="  font-semibold">Topics Covered : </span>{" "}
                    </h1>
                    <div className="flex flex-col divide-y-2 w-full">
                      {modules}
                    </div>
                    <div className="flex flex-col w-full">
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Course Overview :{" "}
                        </span>{" "}
                      </h1>
                      <ReactPlayer
                        className={"md:h-96 h-full z-20"}
                        url={courses.video}
                        width='100%'

                        controls={true}
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload',
                            },
                          },
                        }}

                      />
                    </div>
                    <div className="flex flex-col my-5 w-full">
                      <button onClick={() => { navigate(`/instructor/update-course/:${courses._id}`, { state: courses._id }) }} className="bg-black flex rounded border justify-center text-center text-2xl text-white p-3"><BiEditAlt size="30" color="white" /><h1 className="mx-3">Edit Course Details</h1></button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SingleCourse;
