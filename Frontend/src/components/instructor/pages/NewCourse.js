import React from 'react'
import Header from "../layouts/Header"
import { useSelector } from 'react-redux';
import Footer from '../layouts/Footer';
import CourseForm from '../layouts/CourseForm';
import { ToastContainer } from 'react-toastify';

function NewCourse() {
  const Instructor = useSelector((state) => state.InstructorProfile);
  const search = useSelector((state) => state.instructorSearch);
  const token = useSelector((state) => state.token);
  return (
    <>
    <ToastContainer />
      <Header Instructor={Instructor} token={token} search={search}/>
      <CourseForm instructor={Instructor} token={token} />
      <Footer /> 
    </>
  )
}

export default NewCourse