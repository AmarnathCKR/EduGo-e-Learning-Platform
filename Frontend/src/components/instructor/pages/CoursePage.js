/* eslint-disable react-hooks/exhaustive-deps */
// import Footer from "../layouts/Footer";

import { useEffect, useState } from "react";
import CreateCourse from "../layouts/CreateCourse";
import Header from "../layouts/Header";
import { useDispatch, useSelector } from "react-redux";
import Curiculum from "../layouts/Curriculum";
import Video from "../layouts/Video";
import Course from "../layouts/Course";
import "../../../Assets/style.css";
import Footer from "../layouts/Footer";
import CourseList from "../layouts/CourseList";
import { Link, useNavigate } from "react-router-dom";

import {
  subscribeCourse,
  unsuscribeTeacher,
  unsuscribeToken,
} from "../../../store/store";
import { RotateSpinner } from "react-spinners-kit";
import { googleLogout } from "@react-oauth/google";
import { getAnyData } from "../../../api/instructorAPI";

function CoursePage() {
  const [state, setState] = useState(false);
  const [dropdown, setDrop] = useState("curriculum");
  const [loading, setLoading] = useState(false);
  const Instructor = useSelector((state) => state.InstructorProfile);
  const token = useSelector((state) => state.token);
  const course = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      setLoading(true);
      setState(true);

      getAnyData("fetch-course", token)
        .then((res) => {
          setLoading(false);
          dispatch(subscribeCourse(res.data.data.content.data));
          // setState(true)
        })
        .catch((err) => {
          setLoading(false);
          navigate("/instructor");
          if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
            localStorage.removeItem("teacherToken");
            dispatch(unsuscribeToken());
            localStorage.removeItem("teacherData");
            dispatch(unsuscribeTeacher());
            navigate("/instructor");
            googleLogout();
          }
          // setState(true)
        });
    }
  }, []);
  const search = useSelector((state) => state.instructorSearch);
  return (
    <>
      {state && (
        <>
          {loading ? (
            <div className="z-40  p-64 loader-local bg-secondary">
              <RotateSpinner size="60" color="#000000" />
            </div>
          ) : (
            ""
          )}
          <Header Instructor={Instructor} token={token} search={search}/>
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
          <div className=" pt-2  grid md:grid-cols-4 grid-cols-1 justify-center border-b">
            {!course[0] ? <div className="md:col-span-4 col-span-1 flex justify-center"><CreateCourse /></div> : <CourseList course={course} />}
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
