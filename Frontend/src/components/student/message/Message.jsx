import { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import { getAnyDataStudentAPI } from "../../../api/studentAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { unsuscribeStudentData, unsuscribeStudentToken } from "../../../store/store";
import { googleLogout } from "@react-oauth/google";

export default function Message({ user, message, own }) {
  const [id,setID]=useState()
  const token = useSelector((state) => state.studentToken);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    getAnyDataStudentAPI(`get-student?userId=${message.sender}`,token).then((res)=>{
      
      setID(res.data)
    }).catch((err)=>{
      if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
        localStorage.removeItem("StudentToken");
        dispatch(unsuscribeStudentToken());
        localStorage.removeItem("StudentData");

        dispatch(unsuscribeStudentData());
        navigate("/");
        googleLogout();
    }
    })
  },[message])
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop items-start align">
        <img
          className="messageImg"
          src={id ? id?.image : user.image}
          alt=""
        />
        <span className="flex-col">
        <p className="text-lg">{id ? id?.name : user.name}</p>
        <p className="messageText">{message.text}</p>
        </span>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
