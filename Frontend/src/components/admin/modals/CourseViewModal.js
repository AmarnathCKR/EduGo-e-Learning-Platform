import { IoIosArrowDropdown } from "react-icons/io";
import React from "react";
import ReactPlayer from 'react-player';

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleAnyPatch } from "../../../api/adminAPI";

function CourseViewModal(props) {
  const modules = props.data?.topics.map((item, index) => (
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

  const token = useSelector((state) => state.adminToken);
  const showToastSuccess = () => {
    toast.success("Course Approved Successfully");
  };

  const showToastReject = () => {
    toast.error("Course Rejected Successfully");
  };

  const handleClick = (id, status) => {
    const data = {
      id: id,
      status: status,
    };

    handleAnyPatch("course-status", data, token)
      .then((res) => {
        props.click();
        props.stat();
        if (status === "active") {
          showToastSuccess();
        } else {
          showToastReject();
        }
      })
      
  };

  return (
    <>
      {props.show && (
        <>
          <div className="z-40 modal-local md:p-10 p-3">
            <div className="modal-local-content-111 rounded md:w-2/3 w-full">
              <div className="modal-local-header flex justify-center right-2 items-center w-full  fixed">
                <h4 className="modal-local-title text-center font-bold text-xl">
                  Course Details
                </h4>
              </div>
              <div className="modal-local-body mt-10 p-8 h-5/6 overflow-y-scroll text-center">
                <div className="flex flex-col md:px-8 px-3 justify-center items-center">
                  <h1 className=" text-center font-semibold text-2xl py-6">
                    {props.data.name}
                  </h1>
                  <div className="grid grid-cols-2  justify-center w-full">
                    <div className="md:col-span-1 col-span-2 flex justify-center items-center">
                      <img width={150} src={props.data.image} alt="img" />
                    </div>

                    <div className="md:col-span-1 col-span-2">
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Instructor Name :{" "}
                        </span>
                        {props.data.instructor.name}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Experience Level :{" "}
                        </span>
                        {props.data.experience}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">
                          Field of Study :{" "}
                        </span>{" "}
                        {props.data.field.name}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">Price : </span> ₹
                        {props.data.price}
                      </h1>
                      <h1 className=" text-start text-lg  py-2">
                        <span className="  font-semibold">Total Time : </span>{" "}
                        {props.data.total} minutes
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start w-full">
                    <h1 className=" text-start text-lg  py-2">
                      <span className="  font-semibold">Headline : </span>
                      {props.data.headline}
                    </h1>
                    <h1 className=" text-start text-lg  py-2">
                      <span className="  font-semibold">Description : </span>
                      {props.data.description}
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
                        url={props.data.video}
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

                    <div className=" text-start grid grid-cols-2 text-lg  py-5 w-full">
                      {props.data.status === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              handleClick(props.data._id, "active");
                            }}
                            className="bg-success md:col-span-1 my-2 border rounded p-2 md:mr-5 col-span-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              handleClick(props.data._id, "reject");
                            }}
                            className="bg-red-500 md:col-span-1 my-2 border rounded p-2 md:ml-5 col-span-2"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          {props.data.status !== "blocked" ? (
                            <button
                              onClick={() => {
                                handleClick(props.data._id, "blocked");
                              }}
                              className="bg-red-500  my-2 border rounded p-2  col-span-2"
                            >
                              Block Course
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleClick(props.data._id, "active");
                              }}
                              className="bg-success my-2 border rounded p-2  col-span-2"
                            >
                              Unblock Course
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-local-footer">
                <button onClick={props.click} className="button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CourseViewModal;
