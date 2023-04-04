import React from "react";
import { useSelector } from "react-redux";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function InstructorProfileView() {
  const Instructor = useSelector((state) => state.InstructorProfile);

  const token = useSelector((state) => state.token);
  return (
    <>
      <ToastContainer />
      <Header token={token} Instructor={Instructor} />
      <div className="container mx-auto mt-32  shadow">
        <div>
          <div className="bg-neutral-50 relative mb-20 shadow rounded-lg w-90 md:w-90   mx-auto">
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
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 text-left px-6">
                    Profile Details
                  </h3>
                  <Link to="/instructor/profile">
                    <button className="bg-white border rounded px-1 mx-2 font-medium text-gray-900 text-left ">
                      Edit Profile
                    </button>
                  </Link>
                </div>
                <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                  <div className="grid grid-cols-2 w-full">
                    <div className="col-span-2 md:col-span-1 w-full">
                      <h1 className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3  block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Name : {Instructor.name}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Email : {Instructor.email}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Headline : {Instructor.headline}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Description : {Instructor.description}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Country : {Instructor.country}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Region : {Instructor.region}
                      </h1>
                    </div>
                    <div className="col-span-2 md:col-span-1 w-full">
                      <h1 className="border-t tex-center text-xl border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">Socials</h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Git : {Instructor.git}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Twitter : {Instructor.twitter}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Facebook : {Instructor.facebook}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Git : {Instructor.git}
                      </h1>
                      <h1 className=" border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                        <img
                          src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                          alt=""
                          className="rounded-full h-6 shadow-md inline-block mr-2"
                        />
                        Linkedin : {Instructor.linkedin}
                      </h1>
                    </div>
                  </div>
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
