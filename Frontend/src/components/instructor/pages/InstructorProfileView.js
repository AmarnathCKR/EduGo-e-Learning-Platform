import React from "react";
import { useSelector } from "react-redux";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function InstructorProfileView() {
  const Instructor = useSelector((state) => state.InstructorProfile);

  const token = useSelector((state) => state.token);
  const search = useSelector((state) => state.instructorSearch);
  return (
    <>
      <ToastContainer />
      <Header token={token} Instructor={Instructor} search={search}/>
      <div className="container mx-auto mt-32 md:px-48 px-5">
        <div>
          <div className="bg-white relative mb-20 shadow rounded-lg w-90 md:w-90   mx-auto">
            <div className="flex justify-center">
              <img
                width="20%"
                className=""
                src={Instructor.image}
                alt="profile"
              />
            </div>

            <div className="mt-16 ">
              <h1 className="font-bold text-center text-3xl mb-16 text-gray-900">
                {Instructor.name}
              </h1>

              <p>
                <span></span>
              </p>

              <div className="w-full">
                <div className="flex justify-between border-b">
                  <h3 className="font-semibold text-gray-900 text-xl text-left px-6">
                    About
                  </h3>
                  <Link to="/instructor/profile">
                    <button className="bg-white border text-xl p-1 rounded px-1 mx-2 font-medium text-gray-900 text-left ">
                      Edit Profile
                    </button>
                  </Link>
                </div>
                <div className="mt-5 w-full grid grid-cols-6 align-top items-start md:p-6 p-3 text-lg">
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-b h-full">HeadLine: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-b h-full break-normal">{Instructor.headline}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Description: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.description}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Country: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.country}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Region: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.region}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">git: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.git}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Linkedin: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.linkedin}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Facebook: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.facebook}</span>
                  <span className="md:col-span-1 col-span-2 font-medium text-center my-3 border-y h-full">Twitter: </span>
                  <span className="md:col-span-5 col-span-4 text-center my-3 border-y h-full break-normal">{Instructor.twitter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default InstructorProfileView;
