
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Header from "../layouts/Header";
import CourseForm from "../layouts/CourseForm";
import Footer from "../layouts/Footer";
import { useLocation } from "react-router-dom";


function UpdateCourse() {
  
  const Instructor = useSelector((state) => state.InstructorProfile);
  const search = useSelector((state) => state.instructorSearch);
  const token = useSelector((state) => state.token);
  const location = useLocation();

  
  return (
    <>
      <ToastContainer />
      <Header Instructor={Instructor} token={token} search={search} />
      <CourseForm
        instructor={Instructor}
        token={token}
        id={location.state}
        link="edit-course"
      />
      <Footer />
    </>
  );
}

export default UpdateCourse;
