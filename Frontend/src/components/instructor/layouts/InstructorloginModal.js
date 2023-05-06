import React, { useState } from "react";
import "../../../Assets/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useDispatch } from "react-redux";
import {
  subscribeToken,
  subscribeTeacher,
  subscribeCourse,
} from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleInstructorAuth from "../../../googleLogin";
import { CircleSpinner } from "react-spinners-kit";
import { postWithoutAuthApi } from "../../../api/instructorAPI";

function InstructorLoginModal(props) {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [hide, setHide] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showToastSuccess = (data) => {
    toast.success("Welcome back " + data);
  };

  const dispatch = useDispatch();
  if (!props.show) {
    return null;
  }
  const data = {
    email: input.email,
    password: input.password,
    google: false,
  };

  const login = () => {
    if (input.email === "" || input.password === "") {
      setError("Please fill all fields");
    }

    postWithoutAuthApi("login", data)
      .then((res) => {
        dispatch(subscribeToken(res.data.data.content.meta.access_token));
        localStorage.setItem(
          "teacherToken",
          res.data.data.content.meta.access_token
        );
        dispatch(subscribeTeacher(res.data.data.content.data));

        props.close();
        dispatch(subscribeCourse(res.data.data.content.courses));
        setError("");
        showToastSuccess(res.data.data.content.data.name);
      })
      .catch((err) => {
        setError(err.response.data.data.errors[0].message);
      });
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="z-40  p-64 loader-local ">
          {" "}
          <CircleSpinner size={50} color="#000000" />
        </div>
      ) : (
        <button className="border-2 py-2 px-2 rounded" onClick={() => login()}>
          Login with Google 🚀
        </button>
      )}
      <div className="z-30 modal-local p-4">
        <div className="modal-local-content rounded">
          <div className="modal-local-header">
            <h4 className="modal-local-title text-center font-bold text-xl">
              Login Now
            </h4>
          </div>
          <div className="modal-local-body text-center">
            <h2 className="py-3 text-lg font-medium text-red-500">
              {error ? error : "Please Enter your credentials"}
            </h2>

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
                onClick={login}
                className="border bg-neutral-900 text-white p-2"
              >
                Login
              </button>
            </div>

            <h1 className="text-center font-semibold text-lg">OR</h1>

            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH}>
              <GoogleInstructorAuth
                close={props.close}
                loading={loading}
                setLoading={setLoading}
              />
            </GoogleOAuthProvider>
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

export default InstructorLoginModal;
