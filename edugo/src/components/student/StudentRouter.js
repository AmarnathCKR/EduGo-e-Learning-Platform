import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import StudentLanding from "./pages/StudentLanding";
import { useDispatch, useSelector } from "react-redux";
import { subscribeStudentData, subscribeStudentToken } from "../../store/store";
import StudentProfile from "./pages/StudentProfile";
import EditProfile from "./pages/EditProfile";

function StudentRouter() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    const localToken = localStorage.getItem("StudentToken");

    const localTeacher = JSON.parse(localStorage.getItem("StudentData"));

    if (localToken) {
      dispatch(subscribeStudentData(localTeacher));
      dispatch(subscribeStudentToken(localToken));

      setToken(true);
    } else {
      setToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auth = useSelector((state) => state.studentToken);

  if (token === null) {
    return;
  }
  return (
    <Routes>
      <Route path="/" element={<StudentLanding />} />

      <Route path="/view-profile" element={auth ?<StudentProfile /> : <Navigate to="/" />} />
      <Route path="/edit-profile" element={auth ?<EditProfile /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default StudentRouter;
