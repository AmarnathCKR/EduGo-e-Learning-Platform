/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import PaymentOption from '../payment/PaymentOption';
import { getAnyData } from '../../../api/instructorAPI';
import { subscribeCourse, subscribeTeacher, unsuscribeTeacher, unsuscribeToken } from '../../../store/store';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import PaymentCards from '../payment/PaymentCards';

function PaymentPage() {
    const [card, setCard] = useState(false)
    const Instructor = useSelector((state) => state.InstructorProfile);
    const token = useSelector((state) => state.token);
    const search = useSelector((state) => state.instructorSearch);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const course = useSelector((state) => state.course);
    useEffect(() => {
        if (token) {
          
          getAnyData("fetch-course", token)
            .then((res) => {
             
              dispatch(subscribeCourse(res.data.data.content.data));
              // setState(true)
            })
            .catch((err) => {
             
              navigate("/instructor");
              if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                localStorage.removeItem("teacherToken");
                dispatch(unsuscribeToken());
                localStorage.removeItem("teacherData");
                dispatch(unsuscribeTeacher());
                navigate("/instructor");
                googleLogout();
              }
              // setState(true)
            });
        }
      }, []);

    useEffect(() => {
        getAnyData("fetch-user", token)
            .then((res) => {
                dispatch(subscribeTeacher(res.data.data.content.data));
            })
            .catch((err) => {
                if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                    localStorage.removeItem("StudentToken");
                    dispatch(unsuscribeToken());
                    localStorage.removeItem("teacherData");

                    navigate("/instructor");
                    googleLogout();
                }
            });

    }, [card])

    return (
        <div>
            <Header Instructor={Instructor} token={token} search={search} />
            <div className='mt-24  justify-center'>
                {Instructor?.payment ? (<>

                    <div class="flex md:flex-row flex-col justify-center items-center">
                        <p className="mr-3 my-4">Click on the card to Change the payment details</p>
                        <div onClick={() => setCard(!card)} class="space-y-16">
                            <div class="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl">

                                <img class="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/kGkSg1v.png" alt="card" />

                                <div class="w-full px-8 absolute top-8">
                                    <div class="flex justify-between">
                                        <div class="">
                                            <p class="font-light">
                                                Name
                                            </p>
                                            <p class="font-bold tracking-widest font-mono">
                                                {Instructor?.payment.nameOnCard}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="pt-1">
                                        <p class="font-light">

                                        </p>
                                        <p class="font-medium tracking-more-wider font-mono">
                                            <strong>●●●●</strong>  ●●●● ●●●● <span class="bg-blue-700  rounded-full px-2 py-1 text-xs absolute">{Instructor?.payment.cardNumber.substr(-5)}</span>
                                        </p>

                                    </div>
                                    <div class="pt-6 pr-6">
                                        <div class="flex justify-between">

                                            <div class="">
                                                <p class="font-light text-xs">
                                                    Expires At
                                                </p>
                                                <p class="font-medium tracking-wider text-sm font-mono">
                                                    ●●/●●
                                                </p>
                                            </div>

                                            <div class="">
                                                <p class="font-light text-xs">
                                                    CVC
                                                </p>
                                                <p class="font-bold tracking-more-wider text-sm font-mono">
                                                    ●●●
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                </>) : <>
                    {!card && <div className='w-full flex justify-center'><p onClick={() => setCard(!card)} className='bg-black text-white text-center text-xl font-bold my-10 w-fit p-4 rounded cursor-pointer'>Add Payment Details to receive Payments</p></div>}
                </>}
                {card && <PaymentOption close={() => setCard(!card)} />}
            </div>
            <div className='flex flex-col'>
                {course[0] && course?.map((items) =>
                    <PaymentCards course={items} />
                )}
            </div>
            <Footer />

        </div>
    )
}

export default PaymentPage