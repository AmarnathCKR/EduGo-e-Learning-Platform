/* eslint-disable react-hooks/exhaustive-deps */
import HeaderLanding from "../layouts/HeaderLanding";
import FooterLanding from "../layouts/FooterLanding";
import MainContent from "../pageContents/MainContent";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { subscribeAllCourse } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { RotateSpinner } from "react-spinners-kit";
import AllCourse from "../pageContents/AllCourse";
import LandingConclude from "../pageContents/LandingConclude";
import StudentRegisterModal from "../register/StudentRegisterModal";
import StudentLoginModal from "../loginAuth/StudentLoginModal";
import { ToastContainer } from "react-toastify";
function StudentLanding() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setShow(true);
  };
  
  const handleOpen1 = () => {
    setShow1(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleClose1 = () => {
    setShow1(false);
  };
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    setState(true);
    const url = "http://localhost:5000/fetch-allCourse";
    axios
      .get(url)
      .then((res) => {
        setLoading(false);
        dispatch(subscribeAllCourse(res.data.data.content.data));
      })
      .catch((err) => {
        setLoading(false);

        console.log(err.response.data.data.errors[0].message);
      });
  }, []);
  const allCourse = useSelector((state) => state.AllCourse);
  const token = useSelector((state) => state.studentToken);
  const student = useSelector((state) => state.studentData);

  return (
    <>
    <ToastContainer />
      {state && (
        <>
          {loading ? (
            <div className="z-40  p-64 loader-local bg-secondary">
              <RotateSpinner size="60" color="#000" />
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-col min-h-screen">
            <HeaderLanding
              close={handleClose}
              close1={handleClose1}
              show={show}
              show1={show1}
              open={handleOpen}
              open1={handleOpen1}
              student={student}
              token={token}
            />
            <MainContent show={handleOpen} />
            <AllCourse courses={allCourse} />
            <LandingConclude />
            <FooterLanding />
            <StudentRegisterModal close={handleClose} show={show} />
            <StudentLoginModal close={handleClose1} show={show1} />
          </div>
        </>
      )}
    </>
  );
}

export default StudentLanding;
