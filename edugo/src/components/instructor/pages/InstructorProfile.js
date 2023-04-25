import React from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { useSelector } from "react-redux";
import FormProfileInstructor from "../layouts/FormProfileInstructor";

function InstructorProfile() {
  const Instructor = useSelector((state) => state.InstructorProfile);

  const token = useSelector((state) => state.token);
  const search = useSelector((state) => state.instructorSearch);
  return (
    <>
      <Header Instructor={Instructor} token={token} />
      <h1 className="ml-10 text-2xl mt-32">Update Profile</h1>
      <div className="mt-5 mb-20 mx-10">
        <FormProfileInstructor instructor={Instructor} token={token} search={search}/>
      </div>
      <Footer />
    </>
  );
}

export default InstructorProfile;
