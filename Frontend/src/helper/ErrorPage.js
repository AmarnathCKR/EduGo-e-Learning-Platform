import React from 'react'
import HeaderLanding from '../components/student/layouts/HeaderLanding'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ErrorPage(props) {
    const auth = useSelector((state) => state.studentToken);
    const Instructor = useSelector((state) => state.studentData);
    const search = useSelector((state) => state.studentSearch);
    return (
        <div>
            <HeaderLanding token={auth} student={Instructor} search={search} />
            <div className='mt-24 h-3/4'>Error : {props.title}</div>
            <Navigate to="/"><button className='bg-white p-3 border-2'>Go back to homepage</button></Navigate>
        </div>
    )
}

export default ErrorPage