// import Footer from "../layouts/Footer";

import { useEffect, useState } from "react";
import CreateCourse from "../layouts/CreateCourse";
import Header from "../layouts/Header";
import { useDispatch, useSelector } from "react-redux";
import Curiculum from "../layouts/curriculum";
import Video from "../layouts/video";
import Course from "../layouts/course";
import "../../../Assets/style.css";
import Footer from "../layouts/Footer";
import CourseList from "../layouts/CourseList";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { subscribeCourse } from "../../../store/store";
import { RotateSpinner } from "react-spinners-kit";

function CoursePage() {
  const [state,setState] = useState(false)
  const [dropdown, setDrop] = useState("curriculum");
  const [loading,setLoading] = useState(false)
  const Instructor = useSelector((state) => state.InstructorProfile);
  const token = useSelector((state) => state.token);
  const course = useSelector((state) => state.course);
  const dispatch =useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      setLoading(true)
      setState(true)
      const url = "http://localhost:5000/instructor/fetch-course";
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false)
          dispatch(subscribeCourse(res.data.data.content.data));
          // setState(true)
        })
        .catch((err) => {
          setLoading(false)
          navigate("/instructor");
          console.log(err.response.data.data.errors[0].message);
          // setState(true)
        });
    }
  }, []);

  return (
    <>
    {state && (
      <>
      {loading ? <div className="z-40  p-64 loader-local bg-secondary"><RotateSpinner size="60" color="#000" /></div>: ""}
      <Header Instructor={Instructor} token={token} />
      {!course[0] && !loading ? (
        <h1 className="mt-20 my-4 pt-10 text-2xl border-b text-center">
          You have not created any Courses
        </h1>
      ) : (
        <div className="flex justify-between align-middle mt-24 my-4 border-b">
          <h1 className="  text-2xl ml-10 text-start">Your courses</h1>
          <Link to="/instructor/new-course">
            {" "}
            <button className="bg-black text-white p-2 border rounded mx-4">
              Create Course
            </button>
          </Link>
        </div>
      )}
      <div className=" pt-2  flex justify-center border-b">
        {!course[0]  ? <CreateCourse /> : <CourseList course={course} />}
      </div>
      <div className="flex justify-center mt-10 text-center">
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
      <div className="flex justify-center text-center">
        <div className="mt-2 max-w-4xl">
          {dropdown === "curriculum" ? <Curiculum /> : ""}
          {dropdown === "video" ? <Video /> : ""}
          {dropdown === "course" ? <Course /> : ""}
        </div>
      </div>
      <Footer />
      </>
    )}
    </>
  );
}

export default CoursePage;
