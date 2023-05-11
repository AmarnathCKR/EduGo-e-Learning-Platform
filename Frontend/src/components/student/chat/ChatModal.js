import React, { useContext, useEffect, useRef, useState } from "react";
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


import { getAnyDataStudentAPI, postAnyStudentApi, postWithoutAuthStudentApi } from "../../../api/studentAPI";
import { BsDoorClosed } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import Message from "../message/Message";
import { SocketContext } from "../../../helper/socketContext";

function ChatModal(props) {
  const socket = useContext(SocketContext)
  useEffect(() => {
    socket.on("users", users => {
      console.log(users)
    })
  })


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null)
  const [input, setInput] = useState("")

  useEffect(() => {
    socket.on("message", msg => {
      console.log(msg)
      setMessage(messages => [...messages, msg.text]);
    })


  }, [socket])



  const token = useSelector((state) => state.studentToken);
  const student = useSelector((state) => state.studentData);

  useEffect(() => {
    getAnyDataStudentAPI("get-message", token).then((res) => {
      setMessage(res.data)
    })
    
    socket.emit('login', { name: student._id, room: props?.course?._id }, error => {
      if (error) {
        console.log(error)

      }
      console.log("success")
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    postAnyStudentApi("send-message", { sender: student._id, text: input, instructor: props?.course?.name }, token)
      .then((res) => {
        socket.emit('sendMessage', res.data, () => setInput(''))

      })


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
            <div className='flex flex-col p-10 h-[400px] overflow-y-scroll'>
              <div className='grow'>
                {message && <>
                  {message?.map((e) =>
                    <Message user={props.course} own={e.sender === student._id} message={e} />
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
