import React, { useState } from "react";
import Layout from "../layouts/Layout";

import { ToastContainer } from "react-toastify";
import CourseDataTable from "../datatable/CourseDataTable";

function CourseManage() {
  const [show , setShow] = useState(false)
  const handleClick = () => {
    setShow(!show)
  }
  const style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)), url("https://res.cloudinary.com/dqrpxoouq/image/upload/v1681280195/j6o6dpipkewt0v8hzuyp.jpg")`,
    backgroundPosition: "70% 0%",
    backgroundSize: "cover"
  };

  return (
    <>
    <ToastContainer />
      <Layout pageTitle="Course Management">
        <div className="ml-0 md:ml-[250px] h-screen" style={style}>
          
          <h1 className="text-center text-white bg-black md:mt-0 mt-14 text-2xl py-5 font-bold ">
            Course Management
          </h1>
         
          <div className="p-5">
            <CourseDataTable show={show}/>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CourseManage;
