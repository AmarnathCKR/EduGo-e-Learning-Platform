import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Message from '../../student/message/Message';
import { createAny, getAnyData } from '../../../api/instructorAPI';
import { io, Socket } from "socket.io-client";
import { postAnyStudentApi } from '../../../api/studentAPI';


function InstructorChat() {
    const [message, setMessage] = useState(null)
    const [input, setInput] = useState("")
    const socket = useRef();


    const Instructor = useSelector((state) => state.InstructorProfile);
    const token = useSelector((state) => state.token);
    const search = useSelector((state) => state.instructorSearch);

    useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.emit("join", {
            userName: Instructor?.name,
            userId: Instructor?._id,

        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        getAnyData("get-message", token).then((res) => {
            setMessage(res.data)
        })
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()
        createAny("send-message", {sender: Instructor._id , text : input},token)
        /// submit
        socket.current?.emit("sendMessage", {
            userName: Instructor?.name,
            userId: Instructor?._id,

            message :input,
        });
        return setInput("");

    }
    socket.current?.on("getMessage", ({ userId, userName, message }) => {
        console.log(userId, userName, message);
      });
    return (
        <>
            <Header Instructor={Instructor} token={token} search={search} />
            <div className='mt-24'>
                <div className='text-center text-2xl  font-bold'>Online Students Chat</div>
                <div className='flex flex-col p-10 h-[500px]'>
                    <div className='grow'>
                        {message && <>
                            {message?.map((e) =>
                                <Message own={e.sender === Instructor._id} message={e} />
                            )}
                        </>}

                    </div>
                    <div className='h-28'><textarea className='w-1/2' value={input} onChange={(e) => setInput(e.target.value)} /><button onClick={handleSubmit}>Submit</button></div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default InstructorChat