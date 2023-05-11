import { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import { getAnyDataStudentAPI } from "../../../api/studentAPI";
import { useSelector } from "react-redux";

export default function Message({ user, message, own }) {
  const [id,setID]=useState()
  const token = useSelector((state) => state.studentToken);
  const student = useSelector((state) => state.studentData);
  useEffect(()=>{
    getAnyDataStudentAPI(`get-student?userId=${message.sender}`,token).then((res)=>{
      console.log(res.data)
      setID(res.data)
    }).catch((err)=>{
      console.log(err)
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
