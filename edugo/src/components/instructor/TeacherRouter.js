import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CoursePage from "./pages/CoursePage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  subscribeCourse,
  subscribeTeacher,
  subscribeToken,
} from "../../store/store";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorProfileView from "./pages/InstructorProfileView";
import NewCourse from "./pages/NewCourse";
import axios from "axios";
import TestMode from "./test/TestMode";
import UploadVideo from "./test/TestMode";
import VideoUploader from "./test/TestMode";

function TeacherRouter() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const course = useSelector((state) => state.course);

  useEffect(() => {
    const localToken = localStorage.getItem("teacherToken");

    const localTeacher = JSON.parse(localStorage.getItem("teacherData"));

    if (localToken) {
      dispatch(subscribeTeacher(localTeacher));
      dispatch(subscribeToken(localToken));

      setToken(true);
    } else {
      setToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (token === null) {
    return;
  }

  return (
    <Routes>
      <Route
        path="/course-page"
        element={token ? <CoursePage /> : <Navigate to="/instructor" />}
      />
      <Route
        path="/profile"
        element={token ? <InstructorProfile /> : <Navigate to="/instructor" />}
      />
      <Route
        path="/view-profile"
        element={
          token ? <InstructorProfileView /> : <Navigate to="/instructor" />
        }
      />
      <Route
        path="/new-course"
        element={token ? <NewCourse /> : <Navigate to="/instructor" />}
      />

      <Route
        path="/test"
        element={<VideoUploader />}
      />
    </Routes>
  );
}

export default TeacherRouter;
