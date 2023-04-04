import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import { CircleSpinner } from "react-spinners-kit";
import {
  subscribeToken,
  subscribeTeacher,
  subscribeCourse,
} from "./store/store";

function GoogleInstructorAuth(props) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (data) => {
    toast.success("welcome back " + data);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setLoading(true);
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
            email: res.data.email,
            google: true,
          };
          axios
            .post(`http://localhost:5000/instructor/login`, data)
            .then((res) => {
              dispatch(subscribeToken(res.data.data.content.meta.access_token));
              localStorage.setItem(
                "teacherToken",
                res.data.data.content.meta.access_token
              );
              console.log(res.data.data.content.courses);
              dispatch(subscribeTeacher(res.data.data.content.data));
              dispatch(subscribeCourse(res.data.data.content.courses));
              localStorage.setItem("courses",JSON.stringify(res.data.data.content.courses))
              localStorage.setItem(
                "teacherData",
                JSON.stringify(res.data.data.content.data)
              );

              setLoading(false);
              props.close();
              showToast(res.data.data.content.data.name);
            })
            .catch((err) => setError(err.response.data.data.errors[0].message));
          setLoading(false);
        })
        .catch((err) => setError(err));
      setLoading(false);
    },
    onError: (error) => {
      setError("Login Failed:" + error);
      setLoading(false);
    },
  });

  return (
    <div>
      <ToastContainer />
      <h1 className="text-warning text-lg text-center">{error}</h1>

      {loading ? (
        <CircleSpinner size={40} color="#000" loading={loading} />
      ) : (
        <button className="border-2 py-2 px-2 rounded" onClick={() => login()}>
          Login with Google 🚀
        </button>
      )}
    </div>
  );
}
export default GoogleInstructorAuth;
