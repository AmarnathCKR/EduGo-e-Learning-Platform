import React from "react";
import { useSelector } from "react-redux";
import HeaderLanding from "../layouts/HeaderLanding";
import FooterLanding from "../layouts/FooterLanding";
import CourseDisplayCards from "../courses contents/CourseDisplayCards";

function AllCoursesBrowse(props) {
  const Instructor = useSelector((state) => state.studentData);

  const token = useSelector((state) => state.studentToken);
  const search = useSelector((state) => state.studentSearch);



  return <div>
    <HeaderLanding student={Instructor} search={search} token={token} />
    <div className="mt-36 ">
        {search && (
            <h1 className="text-center text-2xl font-medium">Search : {search}</h1>
            
        )}
        {props.link ? <CourseDisplayCards search={search} link={props.link} /> :<CourseDisplayCards search={search} />}
        
        
    </div>
    <FooterLanding />
  </div>;
}

export default AllCoursesBrowse;
