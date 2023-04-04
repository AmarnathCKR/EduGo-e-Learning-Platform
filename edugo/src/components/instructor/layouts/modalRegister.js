import React, { useState } from "react";
import "../../../Assets/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Google from "../../../google";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToken,
  unsuscribeToken,
  subscribeTeacher,
  unsuscribeTeacher,
} from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalRegister(props) {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [hide, setHide] = useState(false);
  const [otp, setOTP] = useState(false);
  const [error, setError] = useState("");
  const [inputOTP,setInputOTP] = useState("")
  const [newData, setData]=useState()

  const showToastOTP = () => {
    toast.success("OTP send Successfully");
  };

  const showToastSuccess = () => {
    toast.success("Registetered Successfully");
  };

  const dispatch = useDispatch();
  if (!props.show) {
    return null;
  }
  const data = {
    name: input.name,
    email: input.email,
    password: input.password,
    google: false,
  };

  const signUp = () => {
    if (input.name === "" || input.email === "" || input.password === "") {
      setError("Please fill all fields");
    } else {
      axios
        .post(`http://localhost:5000/instructor/signup`, data)
        .then((res) => {
          
          setData(res.data.data.content.data.token)
          setOTP(true)
          setError("")
          showToastOTP()
        })
        .catch((err) => setError(err.response.data.data.errors[0].message));
    }
  };

  const verifyOTP = ()=>{
    axios
        .post(`http://localhost:5000/instructor/verify`, {otp : inputOTP, token : newData, user : data})
        .then((res) => {
          dispatch(subscribeToken(res.data.data.content.meta.access_token));
              localStorage.setItem(
                "teacherToken",
                res.data.data.content.meta.access_token
              );
              dispatch(subscribeTeacher(res.data.data.content.data));

              localStorage.setItem(
                "teacherData",
                JSON.stringify(res.data.data.content.data)
              );
          
          setError("")
          showToastSuccess()
          props.close()
        })
        .catch((err) => setError(err.response.data.data.errors[0].message));
  }

  return (
    <>
    <ToastContainer />
    <div className="z-40 modal-local">
      <div className="modal-local-content">
        <div className="modal-local-header">
          <h4 className="modal-local-title text-center font-bold text-xl">
            Register
          </h4>
        </div>
        <div className="modal-local-body text-center">
          {otp ? (
            <>
              <h2 className="py-3 text-lg font-medium">
              {error ? error : "Please Enter the OTP"}
              </h2>
              <div className="flex flex-col my-4 mx-2">
              <input
                  className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                  type="text"
                  placeholder="OTP"
                  value={inputOTP}
                  onChange={(event) => {
                    setInputOTP(event.target.value);
                  }}
                />
                
              </div>
              <div className="flex flex-col my-4 mx-2 justify-center">
                <button
                  onClick={verifyOTP}
                  className="border bg-neutral-900 text-white p-2"
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="py-3 text-lg font-medium">
                {error ? error : "Please Enter your Details"}
              </h2>
              <div className="flex flex-col my-4 mx-2">
                <input
                  className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                  type="text"
                  placeholder="Full Name"
                  value={input.name}
                  onChange={(event) => {
                    setInput({ ...input, name: event.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col my-4 mx-2">
                <input
                  className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                  type="text"
                  value={input.email}
                  placeholder="Email"
                  onChange={(event) => {
                    setInput({ ...input, email: event.target.value });
                  }}
                />
              </div>
              <div className="flex my-4 mx-2">
                <input
                  className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                  type={hide ? "text" : "password"}
                  placeholder="Password"
                  value={input.password}
                  onChange={(event) => {
                    setInput({ ...input, password: event.target.value });
                  }}
                />
                <label
                  className="cursor-pointer"
                  onClick={() => {
                    setHide(!hide);
                  }}
                >
                  {hide ? "Hide" : "show"}
                </label>
              </div>
              <div className="flex flex-col my-4 mx-2 justify-center">
                <button
                  onClick={signUp}
                  className="border bg-neutral-900 text-white p-2"
                >
                  Register
                </button>
              </div>

              <h1 className="text-center font-semibold text-lg">OR</h1>

              <GoogleOAuthProvider clientId="635264642318-284aift53keao63nan68r055p302hmjv.apps.googleusercontent.com">
                <Google close={props.close} />
              </GoogleOAuthProvider>
            </>
          )}
        </div>
        <div className="modal-local-footer">
          <button onClick={props.close} className="button">
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default ModalRegister;
