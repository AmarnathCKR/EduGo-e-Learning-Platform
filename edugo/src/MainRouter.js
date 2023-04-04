import { Route, Routes } from "react-router-dom";

import TeacherRouter from "./components/instructor/TeacherRouter";
import HomeInstructor from "./components/instructor/pages/HomeInstructor";
import StudentRouter from "./components/student/StudentRouter";

function MainRouter() {
  return (
    <Routes>
      <Route path="/*" element={<StudentRouter />} />
      <Route path="/instructor" element={<HomeInstructor />} />
      <Route path="/instructor/*" element={<TeacherRouter />} />
    </Routes>
  );
}

export default MainRouter;
