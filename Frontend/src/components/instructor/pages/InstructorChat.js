import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Message from '../../student/message/Message';
import { createAny, getAnyData } from '../../../api/instructorAPI';
import { postAnyStudentApi } from '../../../api/studentAPI';
import { SocketContext } from '../../../helper/socketContext';


function InstructorChat() {
    const [message, setMessage] = useState(null)
    const [input, setInput] = useState("")


    const socket = useContext(SocketContext)






    const Instructor = useSelector((state) => state.InstructorProfile);
    const token = useSelector((state) => state.token);
    const search = useSelector((state) => state.instructorSearch);



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
        createAny("send-message", { sender: Instructor._id, text: input }, token).then((res)=>{
            
            socket.emit('sendMessage', res.data, () => setInput(''))
            
        })
        /// submit
        

        return setInput("");

    }
    useEffect(() => {
        socket.on("message", msg => {
            console.log(msg)
            setMessage(messages => [...messages, msg.text]);
        })


    }, [socket])

    return (
        <>
            <Header Instructor={Instructor} token={token} search={search} />
            <div className='mt-24'>
                <div className='text-center text-2xl  font-bold'>Online Students Chat</div>
                <div className='flex flex-col p-10 h-[500px]'>
                    <div className='grow overflow-y-scroll'>
                        {message && <>
                            {message?.map((e) =>
                                <Message user={Instructor} own={e.sender === Instructor._id} message={e} />
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