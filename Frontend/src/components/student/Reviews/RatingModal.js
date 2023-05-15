
import React, { useState } from 'react'

import { AiOutlineClose } from 'react-icons/ai'
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { postAnyStudentApi } from '../../../api/studentAPI';
import { useSelector } from 'react-redux';

function RatingModal(props) {
    const [value, setValue] = useState({
        rating: 2,
        review: "",
        title: "",
        courseId: props.course
    })
    const [error, setError] = useState("")

    const auth = useSelector((state) => state.studentToken);

    const handleSubmit = () => {
        if ( value.review !== "" || value.title !== "") {
            postAnyStudentApi("add-review", value, auth).then((res) => {
                console.log(res);
                setError("")
                props.close();
            }).catch((err) => {
                console.log(err)
            })

        }else{
            setError("Please fill all required fields")
        }

    }
    return (
        <div className="z-30 modal-local p-4">
            <div className="modal-local-content-review w-1/3 rounded">
                <div className="modal-local-header flex justify-between">
                    <h4 className="modal-local-title text-center font-bold text-xl">
                        Add review
                    </h4>
                    <button onClick={props.close} className="button">
                        <AiOutlineClose color="red" size="25px" />
                    </button>
                </div>
                <div className="modal-local-body text-center flex justify-center py-5 rounded">
                    <div className="flex flex-col max-w-xl p-8 shadow-sm rounded-xl lg:p-12 dark:bg-gray-900 dark:text-gray-100">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-3xl font-semibold text-center">Your opinion matters!</h2>
                            <div className="flex flex-col items-center py-6 space-y-3">
                                <span className="text-center">How was your experience?</span>
                                <div className="w-full h-full">
                                    <Box
                                        sx={{
                                            "& > legend": { mt: 2 },
                                        }}
                                    >
                                        <Rating
                                            name="simple-controlled"
                                            value={value.rating}
                                            onChange={(event, newValue) => {
                                                setValue((state) => ({ ...state, rating: newValue }));
                                            }}
                                        />
                                    </Box>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                {error!=="" && <p className="text-red-500 m-2">{error}</p>}
                                <input value={value.title}
                                    onChange={(event) => {
                                        setValue((state) => ({ ...state, title: event.target.value }));
                                    }} placeholder='Title' className="p-4 rounded-md resize-none dark:text-gray-100 dark:bg-gray-900 outline-none border" />
                                <textarea value={value.review}
                                    onChange={(event) => {
                                        setValue((state) => ({ ...state, review: event.target.value }));
                                    }} rows="3" placeholder="Message..." className="p-4 rounded-md resize-none dark:text-gray-100 dark:bg-gray-900 outline-none border"></textarea>
                                <button type="button" onClick={handleSubmit} className="py-4 my-8 font-semibold text-xl rounded-md text-white bg-black">Leave feedback</button>
                            </div>
                        </div>
                        <div className="flex items-center  justify-center">
                            <p onClick={() => props.close()} className="text-sm cursor-pointer text-red-500">Maybe later</p>
                        </div>
                    </div></div>
            </div>
        </div>
    )
}

export default RatingModal