import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import TeacherRouter from "./components/instructor/TeacherRouter";
import HomeInstructor from "./components/instructor/pages/HomeInstructor";
import StudentRouter from "./components/student/StudentRouter";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { subscribeTeacher, subscribeToken, unsuscribeTeacher, unsuscribeToken } from "./store/store";
import { googleLogout } from "@react-oauth/google";
import AdminRouter from "./components/admin/AdminRouter";
import AdminLogin from "./components/admin/pages/AdminLogin";


function MainRouter() {
  const [token,setToken] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const adminToken = useSelector((state) => state.adminToken);
  useEffect(() => {
    const localToken = localStorage.getItem("teacherToken");
  
    if (localToken) {
      const url = "http://localhost:5000/instructor/fetch-user";
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localToken}`,
          },
        })
        .then((res) => {
          dispatch(subscribeTeacher(res.data.data.content.data));
        })
        .catch((err) => {
          if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
            localStorage.removeItem("StudentToken");
            dispatch(unsuscribeToken());
            localStorage.removeItem("teacherData");
  
            dispatch(unsuscribeTeacher());
            navigate("/instructor");
            googleLogout();
          }
        });
  
      dispatch(subscribeToken(localToken));
  
      setToken(true);
    } else {
      setToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(token===null){
    return
  }
  
  
  return (
    <Routes> 
      <Route path="/*" element={<StudentRouter />} />
      <Route path="/instructor" element={<HomeInstructor />} />
      <Route path="/instructor/*" element={<TeacherRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/admin" element={!adminToken?<AdminLogin /> : <Navigate to="/admin/dashboard" />} />
      <Route path="*" element={<h1>Error 404</h1>} />
    </Routes>
  );
}

export default MainRouter;
