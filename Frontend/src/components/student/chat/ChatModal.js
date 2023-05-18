import React, { useContext, useEffect, useState } from "react";
import "../../../Assets/style.css";

import { useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CircleSpinner } from "react-spinners-kit";


import { getAnyDataStudentAPI, postAnyStudentApi } from "../../../api/studentAPI";
import { BsSendCheck } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import Message from "../message/Message";
import { SocketContext } from "../../../helper/socketContext";
import { useRef } from "react";

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
  const scrollRef = useRef();


  useEffect(() => {
    socket.on("message", msg => {
      console.log(msg)
      setMessage(messages => [...messages, msg.text]);
    })


  }, [])



  const token = useSelector((state) => state.studentToken);
  const student = useSelector((state) => state.studentData);

  useEffect(() => {
    setLoading(true)
    getAnyDataStudentAPI(`get-message?userId=${props?.course?._id}`, token).then((res) => {
      setMessage(res.data)
      setLoading(false)
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
    if (input !== "") {

      postAnyStudentApi("send-message", { sender: student._id, text: input, instructor: props?.course?._id }, token)
        .then((res) => {
          socket.emit('sendMessage', res.data, () => setInput(''))

        })


      return setInput("");
      /// submit
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [message]);

  return (
    <>
      <ToastContainer />
      {loading &&
        <div className="z-[999]  p-64 loader-local ">
          {" "}
          <CircleSpinner size={50} color="#000000" />
        </div>
      }
      <div className="z-[999] modal-local p-4">
        <div className="modal-local-content-chat md:w-4/6 rounded">
          <div className="modal-local-header flex justify-between">
            <h4 className="modal-local-title text-center font-bold text-xl">
              Chat
            </h4>
            <button onClick={props.close} className="button">
              <AiOutlineClose color="red" size="25px" />
            </button>
          </div>
          <div className="modal-local-body text-center py-5 rounded">
            <div className='text-center text-2xl  font-bold'>Online Students Chat</div>
            <div className='flex flex-col md:p-10 p-3 w-full h-[400px] overflow-y-scroll'>
              <div className='grow w-full'>
                {message && <>
                  {message?.map((e) =>
                    <div ref={scrollRef}>
                      <Message user={props.course} own={e.sender === student._id} message={e} />
                    </div>
                  )}
                </>}

              </div>
              <form className='p-0' onSubmit={handleSubmit}><div className='py-3 px-1 border mx-auto w-full rounded mt-5 mb-2 flex  items-center'><input className='w-full outline-none' value={input} onChange={(e) => setInput(e.target.value)} /><button type="submit"><BsSendCheck size="30px" /></button></div></form>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ChatModal;