/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {  getSearchStudentAPI } from '../../../api/studentAPI'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import HeaderLanding from '../layouts/HeaderLanding';
import FooterLanding from '../layouts/FooterLanding';
import { unsuscribeStudentData, unsuscribeStudentToken } from '../../../store/store';
import { googleLogout } from '@react-oauth/google';

function PaymentSuccess() {
    const [order, setOrder] = useState()
    const location = useLocation()
    const auth = useSelector((state) => state.studentToken);
    const Instructor = useSelector((state) => state.studentData);
    const search = useSelector((state) => state.studentSearch);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        getSearchStudentAPI("get-order", location.state, auth).then((res) => {
            setOrder(res.data.data.content.data)
        }).catch((err) => {
            if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                localStorage.removeItem("StudentToken");
                dispatch(unsuscribeStudentToken());
                localStorage.removeItem("StudentData");
      
                dispatch(unsuscribeStudentData());
                navigate("/");
                googleLogout();
            }
        })
    }, [])
    return (
        <div>
            <ToastContainer />
            <HeaderLanding token={auth} student={Instructor} search={search} />

            <div className="bg-white md:p-28 md:pt-20 pt-40 p-5 h-screen">
                <div className="bg-white h-full  p-20 md:mx-auto">
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                        </path>
                    </svg>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                        <p className="text-gray-600 my-2">Thank you for completing your secure online payment with order id : {order?.orderId}.</p>
                        <p> Have a great day!  </p>
                        <div className="py-10 text-center">
                            <Navigate to="/purchased-courses">
                            <p className="px-12 bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white font-semibold py-3">
                                GO TO PURCHASED COURSES
                            </p>
                            </Navigate>
                        </div>
                    </div>
                </div>
            </div>
            <FooterLanding />
        </div>

    )
}

export default PaymentSuccess