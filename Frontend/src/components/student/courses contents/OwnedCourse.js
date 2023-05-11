/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAnyDataStudentAPI } from '../../../api/studentAPI';
import HeaderLanding from '../layouts/HeaderLanding';
import FooterLanding from '../layouts/FooterLanding';


import VideoPlayer from './VideoPlayer';
import { AiOutlineClose, AiOutlineFacebook, AiOutlineFieldTime, AiOutlineGithub, AiOutlineLinkedin, AiOutlineTwitter } from 'react-icons/ai';
import { BsFillChatLeftDotsFill } from 'react-icons/bs'
import ChatModal from '../chat/ChatModal';


function OwnedCourse() {
    const [course, setCourse] = useState()
    const [students, setStudents] = useState()
    const [chat, setChat] = useState(false)

    const [active, setActive] = useState(true)
    const [menuID, setNav] = useState("overview")
    const [current, setCurrent] = useState(0)
    const auth = useSelector((state) => state.studentToken);
    const Instructor = useSelector((state) => state.studentData);
    const search = useSelector((state) => state.studentSearch);
    const location = useLocation();
    useEffect(() => {
        getAnyDataStudentAPI(`get-course?course=${location.state}`, auth)
            .then((res) => {
                setCourse(res.data.data.content.data)

            }).catch((err) => {
                console.log(err)
            })

        getAnyDataStudentAPI(`get-count?course=${location.state}`, auth)
            .then((res) => {
                setStudents(res.data.data.content.data.length)

            }).catch((err) => {
                console.log(err)
            })


    }, [])
    useEffect(() => {
        setNav("overview")
        window.innerWidth > 900 && setActive(true);
        window.addEventListener("resize", () => {
            window.innerWidth < 900 ? setActive(false) : setActive(true);

            return () => {
                window.removeEventListener("resize", () => { });
            };
        });
    }, []);
    return (
        <>
            <HeaderLanding student={Instructor} search={search} token={auth} />
            
            <div >
                {active && <div className='mt-20 grid   md:grid-cols-4 w-full right-0 grid-cols-1 fixed h-screen ' >
                    <div className='flex flex-col col-span-3'>

                        <div>


                        </div>
                        <div>

                        </div>
                    </div>
                    <div className=' right-0 border-s flex flex-col col-span-1 h-screen bg-white'>
                        <div className='flex justify p-4 justify-between border items-center'>
                            <p className='text-xl font-semibold '>Contents</p>
                            <AiOutlineClose onClick={() => { setActive(!active); setNav("contents") }} className='cursor-pointer' size="20px" />

                        </div>
                        <div className='overflow-y-scroll h-4/5'>
                            {course?.topics.map((items, index) =>
                                <div key={items.time} onClick={() => { if (index !== current) { setCurrent(index) } }} className={current === index ? 'flex flex-col justify-start items-start p-3 cursor-pointer bg-neutral-100 border-b' : 'flex flex-col justify-start items-start p-3 cursor-pointer hover:bg-neutral-100 border-b'}>
                                    <p className='text-base font-normal '>{index + 1}. {items.name}</p>
                                    <p className='text-sm flex font-medium align-middle items-center my-2'><AiOutlineFieldTime className='mx-2 ' size="20" /> {items.time} min</p>

                                </div>
                            )}
                        </div>

                    </div>
                </div>}
                <div className='mt-20 grid  md:grid-cols-4 grid-cols-1 ' >
                    <div className={`flex flex-col z-30  ${active ? "col-span-3" : "col-span-4"}`}>
                        <VideoPlayer count={course?.topics?.length} current={current} setCurrent={setCurrent} setActive={() => { setActive(!active); setNav("overview") }} activeID={active} video={course?.topics[current]?.video} title={course?.topics[current]?.name} />
                        <div className='pt-4 px-10 border-b items-baseline align-bottom flex'>
                            <div onClick={() => setNav("overview")} className={menuID === "overview" ? "p-2 mx-2 md:text-xl border-[#f42f73] border-b-2 text-lg cursor-pointer" : "p-2 mx-2 md:text-xl  text-lg cursor-pointer"}>Overview</div>
                            {!active && <div onClick={() => setNav("contents")} className={menuID === "contents" ? "p-2 mx-2 md:text-xl border-[#f42f73] border-b-2 text-lg cursor-pointer" : "p-2 mx-2 md:text-xl  text-lg cursor-pointer"}>Contents</div>}
                            <div onClick={() => setNav("review")} className={menuID === "review" ? "p-2 mx-2 md:text-xl border-[#f42f73] border-b-2 text-lg cursor-pointer" : "p-2 mx-2 md:text-xl  text-lg cursor-pointer"}>Review</div>




                        </div>
                        {menuID === "overview" && <>
                            <div className='mt-10 flex flex-col  border-b md:mx-10 mx-5'>
                                <h1 className='md:text-2xl mb-5 text-lg font-bold text-start'>About the Course</h1>
                                <p className='texl-lg font-medium mb-6'>{course?.headline}</p>
                            </div>
                            <div className='mt-10 grid md:grid-cols-4 grid-cols-1 border-b md:mx-10 mx-5'>
                                <div className='my-2'>By the numbers</div>
                                <div className='flex-col '>
                                    <p className='my-2'>Skill level : {course?.experience}</p>
                                    <p className='my-2'>Field of Study : {course?.field.name}</p>
                                    <p className='my-2'>Students : {students}</p>
                                </div>
                                <div className='flex-col md:ml-8'>
                                    <p className='my-2'>Total Time : {course?.total}</p>
                                    <p className='my-2'>Total Modules : {course?.topics.length}</p>

                                </div>
                            </div>
                            <div className='mt-10 grid md:grid-cols-4 grid-cols-1 border-b md:mx-10 mx-5'>
                                <div className='my-2 col-span-1'>Description</div>
                                <div className='md:col-span-3 col-span-1'>
                                    {course?.description}
                                </div>

                            </div>
                            <div className='mt-10 grid md:grid-cols-4 grid-cols-1 border-b md:mx-10 mx-5'>
                                <div className='my-2'>Instructor</div>
                                <div className='flex flex-col md:col-span-3   col-span-1'>
                                    <div className='flex items-center'><img className='rounded-full mr-8' height="12%" width="12%" src={course?.instructor.image} alt="profile" />
                                        <span>
                                            <p className='md:text-xl text-base font-semibold'>{course?.instructor.name}</p>
                                            <p className='mde:text-base text-sm'>{course?.instructor.headline}</p>
                                        </span></div>
                                    <div className='flex my-3 gap-5' ><AiOutlineFacebook size="40px" /><AiOutlineLinkedin size="40px" /><AiOutlineTwitter size="40px" /><AiOutlineGithub size="40px" /></div>
                                    <div onClick={() => { setChat(!chat) }} className='flex gap-2 my-4 items-center cursor-pointer'><BsFillChatLeftDotsFill size="30px" />Chat with Instructor</div>

                                </div>


                            </div>
                        </>}
                        {menuID === "contents" && <>
                            <div className=' flex flex-col bg-white md:px-20 px-2 py-3'>


                                {course?.topics.map((items, index) =>
                                    <div key={items.time} onClick={() => { if (index !== current) { setCurrent(index) } }} className={current === index ? 'flex flex-col justify-start items-start p-3 cursor-pointer bg-neutral-100 border-b' : 'flex flex-col justify-start items-start p-3 cursor-pointer hover:bg-neutral-100 border-b'}>
                                        <p className='text-base font-normal '>{index + 1}. {items.name}</p>
                                        <p className='text-sm flex font-medium align-middle items-center my-2'><AiOutlineFieldTime className='mx-2 ' size="20" /> {items.time} min</p>

                                    </div>
                                )}


                            </div>
                        </>}
                    </div>


                </div>
            </div>
            {chat && <ChatModal course={course?.instructor} close={()=>setChat(!chat)} /> }
            <FooterLanding />
        </>
    )
}

export default OwnedCourse