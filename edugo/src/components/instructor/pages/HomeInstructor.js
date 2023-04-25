/* eslint-disable react-hooks/exhaustive-deps */
import "../../../Assets/style.css";
import teachIcon from "../../../Assets/teachYoWay.jpg";
import inspireIcon from "../../../Assets/Inspire.jpg";
import rewardIcon from "../../../Assets/rewarded.jpg";
import { useEffect, useState } from "react";
import Video from "../layouts/Video";
import Course from "../layouts/Course";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToken } from "../../../store/store";
import InstructorLoginModal from "../layouts/InstructorloginModal";
import { ToastContainer } from "react-toastify";
import ModalRegister from "../layouts/ModalRegister";
import FinalContent from "../layouts/FinalContent";
import Curiculum from "../layouts/Curriculum";

function HomeInstructor() {
  const dispatch = useDispatch();

  useEffect(() => {
    const localToken = localStorage.getItem("teacherToken");
    if (localToken) {
      dispatch(subscribeToken(localToken));
    }
  }, []);

 

  const [dropdown, setDrop] = useState("curriculum");
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleClose1 = () => {
    setShow1(false);
  };
  const style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)), url("https://s.udemycdn.com/teaching/billboard-desktop-2x-v4.jpg")`,
    backgroundPosition: "70% 0%",
  };
  const handleOpen = () => {
    setShow(true);
  };
  const handleOpen1 = () => {
    setShow1(true);
  };
  const Instructor = useSelector((state) => state.InstructorProfile);

  const token = useSelector((state) => state.token);

  const search = useSelector((state) => state.instructorSearch);
  return (
    <>
      <ToastContainer />
      <Header
        close={handleClose}
        show={show}
        show1={show1}
        open={handleOpen}
        open1={handleOpen1}
        close1={handleClose1}
        Instructor={Instructor}
        token={token}
        search={search}
      />
      <div
        className=" z-10 w-100% h-screen bg-no-repeat bg-cover mt-20  saturate-150 flex md:justify-start justify-center bg-center items-center"
        style={style}
      >
        <div className="w-80 mx-32">
          <h1 className="text-6xl text-neutral-50">Come teach with us</h1>
          <p className="my-4 text-neutral-50">
            Become an instructor and change <br></br>lives — including your own
          </p>
          <button
            onClick={() => {
              setShow(true);
            }}
            className="border bg-neutral-900 text-white p-2"
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="text-center">
          <p className="text-7xl text-center font-serif">
            So many reasons to start
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center mt-5">
          <div className="col-span-3 flex items-center flex-col mx-auto md:col-span-1 align-middle justify-center">
            <img width="40%" height="40%" src={teachIcon} alt="img" />
            <h1 className="text-xl text-black font-bold font-serif">
              Teach your way
            </h1>
            <p>
              Publish the course you want, in the way you want, and always have
              control of your own content.
            </p>
          </div>
          <div className="col-span-3 flex items-center flex-col mx-auto md:col-span-1 align-middle justify-center">
            <img width="40%" height="40%" src={inspireIcon} alt="img" />
            <h1 className="text-xl text-black font-bold font-serif">
              Inspire learners
            </h1>
            <p className="text-black">
              Publish the course you want, in the way you want, and always have
              control of your own content.
            </p>
          </div>
          <div className="col-span-3 flex items-center flex-col mx-auto md:col-span-1 align-middle justify-center">
            <img width="40%" height="40%" src={rewardIcon} alt="img" />
            <h1 className="text-xl text-black font-bold font-serif">
              Get rewarded
            </h1>
            <p className="text-black">
              Publish the course you want, in the way you want, and always have
              control of your own content.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 bg-primary p-10">
        <div className="grid grid-cols-2  md:grid-cols-5 gap-4">
          <div className="text-center p-3  col-span-2 md:col-span-1 text-white">
            <h1 className="font-bold  text-5xl">57M</h1>
            <p className="font-medium ">Students</p>
          </div>
          <div className="text-center  p-3 col-span-2 md:col-span-1 text-white">
            <h1 className="font-bold  text-5xl">75+</h1>
            <p className="font-medium ">Languages</p>
          </div>
          <div className="text-center  p-3 col-span-2 md:col-span-1 text-white">
            <h1 className="font-bold  text-5xl">773M</h1>
            <p className="font-medium ">Enrollments</p>
          </div>
          <div className="text-center p-3 text-white col-span-3 md:col-span-1">
            <h1 className="font-bold text-5xl">180+</h1>
            <p className="font-medium">Countries</p>
          </div>
          <div className="text-center p-3 text-white col-span-3 md:col-span-1">
            <h1 className="font-bold text-5xl">13,400+</h1>
            <p className="font-medium">Enterprise customers</p>
          </div>
        </div>
      </div>
      <h1 className="md:text-5xl text-3xl font-bold text-center mt-20">
        How to begin?
      </h1>

      <div className="flex justify-center mt-10 p-5 text-center">
        <div className="max-w-6xl grid grid-cols-3 gap-5 text-base md:text-3xl font-bold text-center border-b">
          <div
            onClick={() => {
              setDrop("curriculum");
            }}
            className={`${
              dropdown === "curriculum"
                ? "border-b border-neutral-900 py-3 cursor-pointer"
                : "py-3 cursor-pointer"
            }`}
          >
            Plan Your curriculum
          </div>
          <div
            onClick={() => {
              setDrop("video");
            }}
            className={`${
              dropdown === "video"
                ? "border-b border-neutral-900 py-3 cursor-pointer"
                : "py-3 cursor-pointer"
            }`}
          >
            Record Your Video
          </div>
          <div
            onClick={() => {
              setDrop("course");
            }}
            className={`${
              dropdown === "course"
                ? "border-b border-neutral-900 py-3 cursor-pointer"
                : "py-3 cursor-pointer"
            }`}
          >
            Launch Your Course
          </div>
        </div>
      </div>
      <div className="flex justify-center p-5 text-center">
        <div className="mt-2 p-5 max-w-4xl">
          {dropdown === "curriculum" ? <Curiculum /> : ""}
          {dropdown === "video" ? <Video /> : ""}
          {dropdown === "course" ? <Course /> : ""}
        </div>
      </div>
      <FinalContent close={handleClose} show={show} open={handleOpen} />
      <Footer />

      <ModalRegister close={handleClose} show={show} />
      <InstructorLoginModal close={handleClose1} show={show1} />
    </>
  );
}

export default HomeInstructor;
