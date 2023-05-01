/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleSpinner } from "react-spinners-kit";
import { ToastContainer, toast } from "react-toastify";
import { unsuscribeAdminToken } from "../../../store/store";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { createAny } from "../../../api/adminAPI";

function AddCouponsModal(props) {
    const [error, setError] = useState(false);
    const [input, setInput] = useState();

    useEffect(() => {
        setInput({
            name: props?.data?.name || "",
            expirationTime: props?.data?.discount || "",
            discount: props?.data?.expirationTime || null,

        });
    }, [props.data]);

    // console.log(props.data)

    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.adminToken);


    const showToastSuccess = () => {
        if (props.data) {
            toast.success("Coupon Updated");
        } else {
            toast.success("Coupon Created");
        }
    };
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const create = async () => {
        if (input.expirationTime === null) {
            if (!input.name || !input.discount || !input.expirationTime) {
                setLoading(false);
                setError("Please fill all the fields required");
            } else {
                setLoading(true);

                const url = `${props.link}?id=${props?.data?._id}`;

                createAny(url, input, token)
                    .then((res) => {
                        setLoading(false);
                        console.log(res.data.data.content.data);
                        setInput({
                            name: "",
                            discount: null,
                            expirationTime: null,

                        });
                        showToastSuccess();

                        props.click();
                        if (props.data) {
                            props.toggle();
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError(err.response.data.data.errors[0].message);
                        if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                            localStorage.removeItem("adminToken");

                            dispatch(unsuscribeAdminToken());
                            navigate("/admin");
                            googleLogout();
                        }
                    });
            }
        } else {
            if (!input.name || !input.discount || !input.expirationTime) {
                setLoading(false);
                setError("Please fill all the fields required");
            } else {

                setLoading(true);

                try {


                    const data = input;

                    const url = `${props.link}?id=${props?.data?._id}`;
                    createAny(url, data, token)
                        .then((res) => {
                            setLoading(false);

                            setInput({
                                name: "",
                                discount: "",

                                expirationTime: null,
                            });
                            showToastSuccess();
                            props.click();

                            if (props.data) {
                                props.toggle();
                            }
                        })
                        .catch((err) => {
                            setLoading(false);
                            setError(err.response.data.data.errors[0].message);
                            if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                                localStorage.removeItem("adminToken");

                                dispatch(unsuscribeAdminToken());
                                navigate("/admin");
                                googleLogout();
                            }
                        });

                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
        <>
            {props.show && (
                <>
                    <div className="z-30 modal-local p-4">
                        <div className="modal-local-content rounded">
                            <div className="modal-local-header">
                                <h4 className="modal-local-title text-center font-bold text-xl">
                                    {props.data
                                        ? "Edit Coupon"
                                        : "Add new Coupon"}
                                </h4>
                            </div>
                            <div className="modal-local-body text-center">
                                <h2
                                    className={`py-3 text-lg font-medium ${error ? "text-red-500" : "text-black"
                                        }`}
                                >
                                    {error ? error : "Enter Field category details"}
                                </h2>

                                <div className="flex flex-col my-4 mx-2">
                                    <input
                                        className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                                        type="text"
                                        value={input.name}
                                        placeholder="Coupon name"
                                        onChange={(event) => {
                                            setInput({ ...input, name: event.target.value });
                                        }}
                                    />
                                </div>
                                <div className="flex my-4 mx-2">
                                    <input
                                        className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                                        type="number"
                                        placeholder="Discount (Percentage)"
                                        value={input.discount}
                                        onChange={(event) => {
                                            setInput({ ...input, discount: event.target.value });
                                        }}
                                    />
                                </div>
                                <div className="flex my-4 mx-2">
                                    <input
                                        className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                                        type="date"
                                        placeholder="Expiration Data"
                                        value={input.expirationTime}
                                        onChange={(event) => {
                                            setInput({ ...input, expirationTime: event.target.value });
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col my-4 mx-2 justify-center">
                                    <ToastContainer />
                                    {loading ? (
                                        <div className="flex items-center justify-center w-full">
                                            {" "}
                                            <CircleSpinner size={20} color="#000" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={create}
                                            className="border bg-neutral-900 text-white p-2"
                                        >
                                            {props.data ? "Edit" : "Create"}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="modal-local-footer">
                                <button onClick={props.click} className="button">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AddCouponsModal;
