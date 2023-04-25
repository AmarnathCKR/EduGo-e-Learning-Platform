import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import { CircleSpinner } from "react-spinners-kit";

import {
  subscribeStudentData,
  subscribeStudentToken,
} from "../../../store/store";
import {

  postWithoutAuthStudentApi,
} from "../../../api/studentAPI";

function StudentGoogleAuthLogin(props) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const showToast = (data) => {
    toast.success("welcome back " + data);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      props.setLoading(true);
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

          postWithoutAuthStudentApi("login", data)
            .then((res) => {
              dispatch(
                subscribeStudentToken(res.data.data.content.meta.access_token)
              );
              localStorage.setItem(
                "StudentToken",
                res.data.data.content.meta.access_token
              );
              console.log(res.data.data.content.data);
              dispatch(subscribeStudentData(res.data.data.content.data));

              localStorage.setItem(
                "StudentData",
                JSON.stringify(res.data.data.content.data)
              );
              props.setLoading(false);

              props.close();

              showToast(res.data.data.content.data.name);
            })
            .catch((err) => {
              setError(err.response.data.data.errors[0].message);
              props.setLoading(false);
            });
        })
        .catch((err) => {
          setError(err);
          props.setLoading(false);
        });
    },
    onError: (error) => {
      setError("Login Failed:" + error);
      props.setLoading(false);
    },
  });

  return (
    <div>
      <ToastContainer />
      <h1 className="text-warning text-lg text-center">{error}</h1>

      {props.loading ? (
        <div className="z-40  p-64 loader-local ">
          {" "}
          <CircleSpinner size={50} color="#000" loading={props.loading} />
        </div>
      ) : (
        <button className="border-2 py-2 px-2 rounded" onClick={() => login()}>
          Login with Google 🚀
        </button>
      )}
    </div>
  );
}
export default StudentGoogleAuthLogin;
