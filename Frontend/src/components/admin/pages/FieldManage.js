import React, { useState } from "react";
import Layout from "../layouts/Layout";
import DataTable from "../DataTable";
import AddFieldModal from "../modals/AddFieldModal";
import { ToastContainer } from "react-toastify";

function FieldManage() {
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
      <Layout pageTitle="Field Of Study Management">
        <div className="ml-0 md:ml-[250px] h-screen" style={style}>
          <AddFieldModal show={show} click={handleClick} link="create-field" />
          <h1 className="text-center text-white bg-black md:mt-0 mt-14 text-2xl py-5 font-bold ">
            Field of Study Management
          </h1>
         <div className="flex justify-center "><button onClick={handleClick} className="my-2 mx-auto px-10 py-3 rounded hover:translate-y-1 bg-black text-white border border-white">Create New Field Category</button></div> 
          <div className="p-5">
            <DataTable show={show}/>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default FieldManage;
