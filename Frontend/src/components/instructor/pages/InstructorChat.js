/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Message from '../../student/message/Message';
import { createAny, getAnyData } from '../../../api/instructorAPI';
import { SocketContext } from '../../../helper/socketContext';
import { BsSendCheck } from 'react-icons/bs';


function InstructorChat() {
    const [message, setMessage] = useState(null)
    const [input, setInput] = useState("")


    const socket = useContext(SocketContext)


    const Instructor = useSelector((state) => state.InstructorProfile);
    const token = useSelector((state) => state.token);
    const search = useSelector((state) => state.instructorSearch);
    const scrollRef = useRef();




    useEffect(() => {
        if (Instructor) {
            getAnyData("get-message", token).then((res) => {
                setMessage(res.data)
                console.log(Instructor)
                socket.emit('login', { name: Instructor._id, room: Instructor._id }, error => {
                    if (error) {
                        console.log(error)

                    }

                })
            })
        }



    }, [Instructor])


    const handleSubmit = (e) => {
        e.preventDefault()
        if (input !== "") {

            createAny("send-message", { sender: Instructor._id, text: input }, token).then((res) => {

                socket.emit('sendMessage', res.data, () => setInput(''))

            })
            /// submit


            return setInput("");

        }


    }
    useEffect(() => {
        socket.on("message", msg => {
            console.log(msg)
            setMessage(messages => [...messages, msg.text]);
        })
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth", block: "start",
            inline: "nearest",
        });
    }, [message]);

    return (
        <>
            <Header Instructor={Instructor} token={token} search={search} />
            <div className='mt-24'>
                <div className='text-center text-2xl mb-4 font-bold'>Public Students Chat</div>
                <div className='flex flex-col md:px-44 h-[518px]'>
                    <div className='grow overflow-y-auto p-5 border shadow'>
                        {message && <>
                            {message?.map((e) =>
                                <div ref={scrollRef}>
                                    <Message user={Instructor} own={e.sender === Instructor._id} message={e} />
                                </div>
                            )}
                        </>}

                    </div>
                    <form className='p-0' onSubmit={handleSubmit}><div className=' border mx-auto w-3/4 rounded p-3 my-5 flex  items-center'><input className='w-full outline-none' value={input} onChange={(e) => setInput(e.target.value)} /><button type="submit"><BsSendCheck size="30px" /></button></div></form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default InstructorChat