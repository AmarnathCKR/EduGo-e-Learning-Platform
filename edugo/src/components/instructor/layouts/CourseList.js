import React from "react";

function CourseList(props) {
    const imageContainer = {
        height : "200px",
        width : "300px"
    }
  const list = props.course.map((data) => {
    return (
     
        <div className=" flex-col justify-center items-center mx-10 cursor-pointer p-5 rounded bg-neutral-100">
        <img style={imageContainer} src={data.image} alt="course" />
        <h1 className="text-center text-3xl">{data.name}</h1>
        <h1 className="text-center text-lg">Price : {data.price}</h1>
        {data.status==="active" ? <h1 className="text-center text-success text-lg">Active</h1>: <h1 className="text-center text-warning text-lg">{data.status}</h1>}
        </div>
      
    );
  });

  return <div className="w-full flex items-center ">
    {list}
  </div>;
}

export default CourseList;
