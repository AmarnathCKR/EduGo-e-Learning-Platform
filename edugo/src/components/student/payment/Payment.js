
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getAnyDataStudentAPI } from "../../../api/studentAPI";
import FooterLanding from "../layouts/FooterLanding";
import HeaderLanding from "../layouts/HeaderLanding";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
function Payment() {
  const [courses, setCourse] = useState([]);
  const [user, setUser] = useState({
    email: "",
    address: "",
    country: "",
    state: "",
    
  })
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  
  const auth = useSelector((state) => state.studentToken);
  const Instructor = useSelector((state) => state.studentData);
  const search = useSelector((state) => state.studentSearch);
  const location = useLocation();

  useEffect(() => {
    getAnyDataStudentAPI(`get-course?course=${location.state}`, auth)
      .then((res) => {
        console.log(res.data.data.content.data);
        setCourse(res.data.data.content.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate();
  return (<>    <ToastContainer />
    <HeaderLanding token={auth} student={Instructor} search={search} />
    <div>
      <div className="grid sm:px-10 mt-24 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8 ">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">

            <div className="flex flex-col rounded-lg align-middle items-center bg-white sm:flex-row">
              <img
                className="m-2 h-24 w-28 rounded-md border object-cover  object-center"
                src={courses.image}
                alt=""
              />
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold my-2">
                  {courses.name}
                </span>
                <span className="font-normal my-2">
                  {courses.headline}
                </span>

                <p className="mt-auto text-lg font-bold">₹{courses.price}</p>
              </div>
            </div>
          </div>


        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <label for="email" className="mt-4 mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                value={user.email}
                onChange={(event)=>setUser((state) => ({ ...state, email: event.target.value }))}
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@gmail.com"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            <label
              for="billing-address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Billing Address
            </label>
            <div className="flex flex-col sm:flex-row">
              <div className="relative flex-shrink-0 sm:w-7/12">
                <input
                  type="text"
                  id="billing-address"
                  value={user.address}
                  onChange={(event)=>setUser((state) => ({ ...state, address : event.target.value }))}
                  name="billing-address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street Address"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <img
                    className="h-4 w-4 object-contain"
                    src="https://flagpack.xyz/_nuxt/4c829b6c0131de7162790d2f897a90fd.svg"
                    alt=""
                  />
                </div>
              </div>
              <CountryDropdown
                className="w-full rounded-md border border-gray-200 px-4 py-3  text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                value={country}
                required
                onChange={(val) => {
                  setCountry(val);
                  setUser((state) => ({ ...state, country: val }));
                }}
              />

              <RegionDropdown
                className="w-full rounded-md border border-gray-200 px-4 py-3  text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                country={country}
                value={region}
                required
                placeholder="region"
                onChange={(val) => {
                  setRegion(val);
                  setUser((states) => ({ ...states, state : val }));
                }}
              />
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">₹{courses.price}</p>
              </div>

            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">₹{courses.price}</p>
            </div>
          </div>
          <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
    <FooterLanding />
  </>

  );
}

export default Payment;
