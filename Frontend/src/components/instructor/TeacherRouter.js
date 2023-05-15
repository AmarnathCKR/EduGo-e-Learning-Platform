import { Navigate, Route, Routes } from "react-router-dom";

import CoursePage from "./pages/CoursePage";
import { useSelector } from "react-redux";

import InstructorProfile from "./pages/InstructorProfile";
import InstructorProfileView from "./pages/InstructorProfileView";
import NewCourse from "./pages/NewCourse";
import SingleCourse from "./course/SingleCourse";
import UpdateCourse from "./course/UpdateCourse";
import ErrorPage from "../../helper/ErrorPage";
import InstructorChat from "./pages/InstructorChat";
import PaymentPage from "./pages/PaymentPage";

function TeacherRouter() {
  const token = useSelector((state) => state.token);

  return (
    <Routes>
      <Route>
        <Route
          path="/course-page"
          element={token ? <CoursePage /> : <Navigate to="/instructor" />}
        />
        <Route
          path="/profile"
          element={
            token ? <InstructorProfile /> : <Navigate to="/instructor" />
          }
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
          path="/update-course/:id"
          element={token ? <UpdateCourse /> : <Navigate to="/instructor" />}
        />
        <Route
          path="/coursePage/:id"
          element={token ? <SingleCourse /> : <Navigate to="/instructor" />}
        />
        <Route
          path="/chat"
          element={token ? <InstructorChat /> : <Navigate to="/instructor" />}
        />
        <Route
          path="/payments"
          element={token ? <PaymentPage /> : <Navigate to="/instructor" />}
        />
      </Route>
      <Route path="/*" element={<ErrorPage title="Page not found" />} />
    </Routes>
  );
}

export default TeacherRouter;
