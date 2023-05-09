/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAnyDataStudentAPI } from '../../../api/studentAPI';
import HeaderLanding from '../layouts/HeaderLanding';
import VideoPlayer from './VideoPlayer';
import { AiOutlineClose, AiOutlineFieldTime } from 'react-icons/ai';

function OwnedCourse() {
    const [course, setCourse] = useState()
    const [active, setActive] = useState(true)
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

    }, [])
    return (
        <>
            <HeaderLanding student={Instructor} search={search} token={auth} />
            <div>
                <div className='mt-20 grid   md:grid-cols-4 w-full right-0 grid-cols-1 fixed h-screen ' >
                    <div className='flex flex-col col-span-3'>

                        <div>


                        </div>
                        <div>

                        </div>
                    </div>
                    <div className=' right-0 border-s flex flex-col col-span-1'>
                        <div className='flex justify p-4 justify-between border items-center'>
                            <p className='text-xl font-semibold '>Contents</p>
                            <AiOutlineClose className='cursor-pointer' size="20px" />

                        </div>
                        {course?.topics.map((items,index) =>
                            <div onClick={()=>{if(index!==current){setCurrent(index)}}} className={current===index ? 'flex flex-col justify-start items-start p-3 cursor-pointer bg-neutral-100 border-b' : 'flex flex-col justify-start items-start p-3 cursor-pointer hover:bg-neutral-100 border-b'}>
                                <p className='text-base font-normal '>{index+1}. {items.name}</p>
                                <p className='text-sm flex font-medium align-middle items-center my-2'><AiOutlineFieldTime className='mx-2 ' size="20" /> {items.time} min</p>
                                
                            </div>
                        )}

                    </div>
                </div>
                <div className='mt-20 grid  md:grid-cols-4 grid-cols-1 h-[1000px]' >
                    <div className='flex flex-col   col-span-3'>
                        <VideoPlayer video={course?.topics[current]?.video} title={course?.topics[current]?.name} />
                        <div className=''>


                        </div>
                        <div>

                        </div>
                    </div>
                    <div className='right-0  flex flex-col col-span-1'>

                    </div>

                </div>
            </div>
        </>
    )
}

export default OwnedCourse