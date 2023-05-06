import React from "react";
import { useNavigate } from "react-router-dom";

function CourseList(props) {
  const navigate = useNavigate()
  const imageContainer = {
    height: "200px",
    width: "300px",
  };
  const list = props.course.map((data) => {
    return (
      <div onClick={()=>{navigate(`/instructor/coursePage/:${data._id}`, {state : data._id})}}>
        <div className="md:col-span-1 col-span-4 flex-col justify-center items-center md:m-10 mx-auto my-8 cursor-pointer p-5 rounded bg-white border shadow">
          <img style={imageContainer} src={data.image} alt="course" />
          <h1 className="text-center text-3xl">{data.name}</h1>
          <h1 className="text-center text-lg">Price : {data.price}</h1>
          {data.status === "active" ? (
            <h1 className="text-center text-success text-lg">Active</h1>
          ) : (
            <h1 className="text-center text-warning text-lg">{data.status}</h1>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="md:w-3/4 w-full grid md:grid-cols-3 grid-cols-4  ">
      {list}
    </div>
  );
}

export default CourseList;
