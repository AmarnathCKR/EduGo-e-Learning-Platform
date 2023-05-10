import React, { useEffect, useRef, useState } from "react";
import "../../../Assets/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useDispatch, useSelector } from "react-redux";
import {
  subscribeStudentToken,
  subscribeStudentData,
} from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CircleSpinner } from "react-spinners-kit";
import { io, Socket } from "socket.io-client";


import { getAnyDataStudentAPI, postWithoutAuthStudentApi } from "../../../api/studentAPI";
import { BsDoorClosed } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import Message from "../message/Message";

function ChatModal({course}) {


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null)
  const [input, setInput] = useState("")
  const socket = useRef();

  const token = useSelector((state) => state.studentToken);
  const student = useSelector((state) => state.studentData);
      useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.emit("join", {
            userName: student?.name,
            userId: student?._id,

        });
        // eslint-disable-next-line
    }, []);
  useEffect(() => {
    getAnyDataStudentAPI("get-message", token).then((res) => {
      setMessage(res.data)
    })
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    createAny("send-message", {sender: student._id , text : input , instructor : course?.instructor?._id},token)
        /// submit
        socket.current?.emit("sendMessage", {
            userName: student?.name,
            userId: student?._id,

            message :input,
        });
        return setInput("");
    /// submit
  }

  return (
    <>
      <ToastContainer />
      {loading &&
        <div className="z-[999]  p-64 loader-local ">
          {" "}
          <CircleSpinner size={50} color="#000000" />
        </div>
      }
      <div className="z-30 modal-local p-4">
        <div className="modal-local-content rounded">
          <div className="modal-local-header flex justify-between">
            <h4 className="modal-local-title text-center font-bold text-xl">
              Chat
            </h4>
            <button onClick={props.close} className="button">
              <AiOutlineClose color="red" size="25px" />
            </button>
          </div>
          <div className="modal-local-body h-3/5 text-center">
            <div className='text-center text-2xl  font-bold'>Online Students Chat</div>
            <div className='flex flex-col p-10 h-[500px]'>
              <div className='grow'>
                {message && <>
                  {message?.map((e) =>
                    <Message own={e.sender === student._id} message={e} />
                  )}
                </>}

              </div>
              <div className='h-28'><textarea className='w-1/2' value={input} onChange={(e) => setInput(e.target.value)} /><button onClick={handleSubmit}>Submit</button></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ChatModal;
