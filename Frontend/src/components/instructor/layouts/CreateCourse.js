import React from "react";
import { Link } from "react-router-dom";

function CreateCourse() {
  return (
    <>
    
      <Link to="/instructor/new-course">
        <button
          className=" p-3 px-16 text-white  hover:transition-all transition-opacity duration-500 ease-in-out 
                       bg-neutral hover:opacity-75 transform 
                       hover:-translate-y-1 hover:scale-110 
                       rounded-lg  border "
        >
          Create Course
        </button>
      </Link>
    </>
  );
}

export default CreateCourse;
