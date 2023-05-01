import React, { useEffect, useState } from "react";

import { Navigate, Route, Routes} from "react-router-dom";

import FieldManage from "./pages/FieldManage";
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard";
import { subscribeAdminToken } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import CourseManage from "./pages/CourseManage";
import CouponManagement from "./pages/CouponsManagement";

function AdminRouter() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  

  useEffect(() => {
    const localToken = localStorage.getItem("adminToken");

    if (localToken) {
      dispatch(subscribeAdminToken(localToken));

      setToken(true);
    } else {
      setToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auth = useSelector((state) => state.adminToken);

  if (token === null) {
    return;
  }
  return (
    <>
      <Routes>
        <Route>
        <Route path="/" element={!auth ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />
        <Route path="/field" element={auth ? <FieldManage /> : <Navigate to="/admin" />} /> 
        <Route path="/dashboard" element={auth ?<AdminDashboard />: <Navigate to="/admin" />} />
        <Route path="/course" element={auth ?<CourseManage />: <Navigate to="/admin" />} /> 
        <Route path="/coupons" element={auth ?<CouponManagement />: <Navigate to="/admin" />} /> 
        
        
        </Route>
      </Routes>
    </>
  );
}

export default AdminRouter;
