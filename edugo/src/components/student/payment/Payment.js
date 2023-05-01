
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getAnyDataStudentAPI, getSearchStudentAPI } from "../../../api/studentAPI";
import FooterLanding from "../layouts/FooterLanding";
import HeaderLanding from "../layouts/HeaderLanding";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { SlClose } from "react-icons/sl";
import { TbSquareRoundedCheck } from "react-icons/tb";
import { BiCheck, BiCheckCircle } from "react-icons/bi";

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
  const [input, setInput] = useState("")
  const [error, setError] = useState()
  const [coupon, setCoupon] = useState()
  const [payment, setPayment] = useState("paypal")

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
    const payButton = document.getElementById("paypal")
    payButton.checked = true;
  }, []);



  const navigate = useNavigate();





  const checkCoupon = () => {
    if (input) {
      getSearchStudentAPI("search-coupon", input, auth).then((res) => {
        setCoupon(res.data.data.content.data)
        setError((state) => ({ ...state, input: "" }))
      }).catch((err) => {

        setError((state) => ({ ...state, input: err.response.data.data.errors[0].message }))
      })
    } else {
      setError((state) => ({ ...state, input: "No coupon Entered" }))
    }
  }
  return (<>    <ToastContainer />
    <HeaderLanding token={auth} student={Instructor} search={search} />
    <div>
      <div className="grid sm:px-10 mt-24 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8 ">
          <p className="text-xl font-medium">Purchase Summary</p>
          <p className="text-gray-400">
            Complete the details. And select a suitable payment method.
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
            Complete your purchase by providing your payment details.
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
                onChange={(event) => setUser((state) => ({ ...state, email: event.target.value }))}
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
                  onChange={(event) => setUser((state) => ({ ...state, address: event.target.value }))}
                  name="billing-address"
                  className="w-full rounded-md bg-white border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
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
                  setUser((states) => ({ ...states, state: val }));
                }}
              />
            </div>

            <div className="flex items-center my-3 w-full h-13 pl-3 bg-white bg-gray-100 border rounded-full">
              {coupon ? <div className="flex justify-between w-full p-1"><h1 className=" text-success py-1 flex items-center align-middle text-center">Coupon "{coupon.name}" Applied<BiCheck color="green" size="30px" /></h1><button className="text-red-500 py-1 flex" onClick={() => { setCoupon(); setError((state) => ({ ...state, input: "" })) }}>Remove <SlClose color="red" size="25px" /></button></div> : <> <input type="coupon" name="code" id="coupon" placeholder="Apply coupon" onChange={(event) => { setInput(event.target.value); setError((state) => ({ ...state, input: "" })) }} value={input} className="w-full bg-white bg-gray-100 px-3 py-2 pl-2 text-sm  outline-none focus:z-10 " />
                <button onClick={checkCoupon} className="text-sm flex items-center px-3 py-1 text-white bg-gray-800 rounded-full outline-none md:px-4 hover:bg-gray-700 focus:outline-none active:outline-none">
                  <svg aria-hidden="true" data-prefix="fas" data-icon="gift" className="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>
                  <span className="font-medium">Apply coupon</span>
                </button></>}
            </div>
            {error?.input && <h1 className="text-red-500 ml-3">{error?.input}</h1>}


            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-lg text-gray-900">₹{courses.price}</p>
              </div>
              {coupon && <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-success">Coupon discount</p>
                <p className="font-semibold text-success">₹ -{(coupon.discount / 100) * courses.price} ({coupon.discount}%)</p>
              </div>}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">₹{coupon ? courses.price - (coupon.discount / 100) * courses.price : courses.price}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900">Choose Payment Method</p>
          </div>


          <div className="my-3 w-full p-2 text-lg font-semibold"><label className="mx-3"><input id="paypal" onChange={() => { setPayment("paypal") }} type="radio" name="payment" value="Paypal" />Paypal</label><label className="mx-3"><input onChange={() => { setPayment("razorpay") }} name="payment" type="radio" value="Razorpay" />Razorpay</label></div>
          <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
            {payment}
          </button>
        </div>
      </div>
    </div>
    <FooterLanding />
  </>

  );
}

export default Payment;
