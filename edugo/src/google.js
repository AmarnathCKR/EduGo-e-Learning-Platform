import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToken,
  unsuscribeToken,
  subscribeTeacher,
  unsuscribeTeacher,
  subscribeCourse,
} from "./store/store";

function Google(props) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const showToast = () => {
    toast.success("Registration Sussesfull");
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          let data = {
            name: res.data.name,
            email: res.data.email,
            image: res.data.picture,
            google: true,
          };
          axios
            .post(`http://localhost:5000/instructor/signup`, data)
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
              props.close();
              showToast();
            })
            .catch((err) => setError(err.response.data.data.errors[0].message));
        })
        .catch((err) => setError(err));
    },
    onError: (error) => setError("Login Failed:" + error),
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-warning text-lg text-center">{error}</h1>
      <button className="border-2 py-2 px-2 rounded" onClick={() => login()}>
        Sign up with Google 🚀
      </button>
    </div>
  );
}
export default Google;
