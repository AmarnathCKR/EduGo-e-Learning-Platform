import React, { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { subscribeAdminToken } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLoginAPI } from "../../../api/adminAPI";

function AdminLogin() {
  const [hide, setHide] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)), url("https://res.cloudinary.com/dqrpxoouq/image/upload/v1683623573/axe1hjkpnybiqoo5fkhb.jpg")`,
    // backgroundPosition: "70% 0%",
  };

  const handleSubmit = () => {
    if (input.email === "" || input.password === "") {
      setError("Please fill all fields");
    }
    let data = {
      email: input.email,
      password: input.password,
    };

    adminLoginAPI(data)
      .then((res) => {
        dispatch(subscribeAdminToken(res.data.data.content.meta.access_token));
        localStorage.setItem(
          "adminToken",
          res.data.data.content.meta.access_token
        );
        setError("");
        navigate("/admin/dashboard");
      })
      .catch((err) => {
        setError(err.response.data.data.errors[0].message);
      });
  };
  return (
    <div
      className="flex justify-end items-center align-middle w-screen h-screen "
      style={style}
    >
      <div className="z-30 modal-local justify-center p-4 ">
        <div className=" bg-white md:w-1/2 w-full p-2 mx-3 h-auto rounded bg-opacity-70 flex justify-center  items-center align-middle">
          <div className="w-full">
            <div className="flex my-4 mx-2 items-center align-middle">
              <div className=" border grow h-0"></div>
              <h1 className="text-center font-semibold text-3xl mx-2">
                Admin Login
              </h1>
              <div className="border grow h-0"></div>
            </div>
            {error && <h1 className="text-center text-red-500">{error}</h1>}

            <div className="flex flex-col my-4 mx-2">
              <label className="text-lg">Email</label>
              <input
                className="w-full border-none rounded pl-2 py-2 bg-white text-gray-700 focus:outline-none items-center"
                value={input.email}
                type="email"
                placeholder="Email"
                onChange={(event) => {
                  setInput({ ...input, email: event.target.value });
                }}
              />
            </div>
            <label className="text-lg mx-2 mt-4">Password</label>
            <div className="flex mb-4 mx-2 mr-2  border-none rounded  bg-white text-gray-700 focus:outline-none items-center">
              <input
                className="grow border-none rounded bg-[#ffffff] px-2 py-2 text-gray-700 focus:outline-none items-center"
                type={hide ? "text" : "password"}
                placeholder="password"
                value={input.password}
                onChange={(event) => {
                  setInput({ ...input, password: event.target.value });
                }}
              />
              <label
                className="cursor-pointer px-2"
                onClick={() => {
                  setHide(!hide);
                }}
              >
                {hide ? <BiHide size={20} /> : <BiShow size={20} />}
              </label>
            </div>
            <div className="flex flex-col my-4 mx-2">
              <button
                onClick={handleSubmit}
                className="w-full p-3 text-white bg-black rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
