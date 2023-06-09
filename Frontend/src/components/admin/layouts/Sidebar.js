// @/components/Layout/Sidebar.js
import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";



import { SlGraduation, SlHome, } from 'react-icons/sl'
import { BsInfoSquare, BsEnvelopeAt } from 'react-icons/bs'

import { BiBookReader, BiLogOut } from 'react-icons/bi'


import logo from '../../../Assets/logo-white.png'
import { unsuscribeAdminToken } from '../../../store/store';

export default function Sidebar({ show, setter }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const router = useLocation()
    // Define our base class
    const className = "bg-black w-[250px] transition-[margin-left] ease-in-out duration-500 fixed  top-0 bottom-0 left-0 z-40";
    // Append class based on state of sidebar visiblity
    const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

    // Clickable menu items
    const MenuItem = ({ icon, name, route, logout }) => {
        // if (name === "Logout") {

        //     dispatch(unsuscribeAdminToken());
        //     localStorage.removeItem(
        //         "adminToken",
        //     );
        //     navigate("/admin");

        // }

        // Highlight menu item based on currently displayed route
        const colorClass = router.pathname === route ? "text-white" : "text-white/50 hover:text-white";

        return (
            <Link
                to={route}
                onClick={() => {
                    setter(oldVal => !oldVal);

                }}
                className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {icon}
                </div>
                <div>{name}</div>
            </Link>
        )
    }

    // Overlay to prevent clicks in background, also serves as our close button
    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setter(oldVal => !oldVal);
            }}
        />
    )

    return (
        <>
            <div className={`${className}${appendClass}`}>
                <div className="p-2 flex">
                    <Link to="/admin/dashboard">
                        {/*eslint-disable-next-line*/}
                        <img src={logo} alt="Company Logo" width={200} height={300} />
                    </Link>
                </div>
                <div className="flex flex-col">
                    <MenuItem
                        name="Dashboard"
                        route="/admin/dashboard"
                        icon={<SlHome />}
                    />
                    <MenuItem
                        name="Field Category"
                        route="/admin/field"
                        icon={<SlGraduation />}
                    />
                    <MenuItem
                        name="Course"
                        route="/admin/course"
                        icon={<BiBookReader />}
                    />
                    <MenuItem
                        name="Coupons"
                        route="/admin/coupons"
                        icon={<BsInfoSquare />}
                    />
                    <MenuItem

                        name="Logout"
                        route="/admin"
                        icon={<BiLogOut />}
                    />
                </div>
            </div>
            {show ? <ModalOverlay /> : <></>}
        </>
    )
}
