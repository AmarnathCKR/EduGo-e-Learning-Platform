import { Navigate, Route, Routes } from "react-router-dom";

import CoursePage from "./pages/CoursePage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { subscribeCourse, subscribeTeacher, subscribeToken } from "../../store/store";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorProfileView from "./pages/InstructorProfileView";
import NewCourse from "./pages/NewCourse";

function TeacherRouter() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const localToken = localStorage.getItem("teacherToken");
    const localCourse = JSON.parse(localStorage.getItem("courses"));
    const localTeacher = JSON.parse(localStorage.getItem("teacherData"));

    if (localToken) {
      dispatch(subscribeTeacher(localTeacher));
      dispatch(subscribeToken(localToken));
      dispatch(subscribeCourse(localCourse))
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
        element={
          token ? <NewCourse /> : <Navigate to="/instructor" />
        }
      />
    </Routes>
  );
}

export default TeacherRouter;
