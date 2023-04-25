import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import StudentLanding from "./pages/StudentLanding";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeStudentData,
  subscribeStudentToken,
  unsuscribeStudentData,
  unsuscribeStudentToken,
} from "../../store/store";
import StudentProfile from "./pages/StudentProfile";
import EditProfile from "./pages/EditProfile";

import { googleLogout } from "@react-oauth/google";
import AllCoursesBrowse from "./pages/AllCoursesBrowse";
import { getAnyDataStudentAPI } from "../../api/studentAPI";

function StudentRouter() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("StudentToken");

    if (localToken) {
      getAnyDataStudentAPI("fetch-student", localToken)
        .then((res) => {
          dispatch(subscribeStudentData(res.data.data.content.data));
        })
        .catch((err) => {
          if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
            localStorage.removeItem("StudentToken");
            dispatch(unsuscribeStudentToken());
            localStorage.removeItem("StudentData");

            dispatch(unsuscribeStudentData());
            navigate("/");
            googleLogout();
          }
        });

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
      <Route>
        <Route path="/" element={<StudentLanding />} />

        <Route
          path="/view-profile"
          element={auth ? <StudentProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-profile"
          element={auth ? <EditProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/courses"
          element={auth ? <AllCoursesBrowse /> : <Navigate to="/" />}
        />
      </Route>
      <Route path="/*" element={<h1>Error 404</h1>} />
    </Routes>
  );
}

export default StudentRouter;
