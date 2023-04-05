import React from 'react'
import HeaderLanding from '../layouts/HeaderLanding'
import FooterLanding from '../layouts/FooterLanding';
import { useSelector } from 'react-redux';
import FormProfileStudent from '../forms/FormProfileStudent';

function EditProfile() {
    const Instructor = useSelector((state) => state.studentData);

  const token = useSelector((state) => state.studentToken);
  return (
    <>
      <HeaderLanding student={Instructor} token={token} />
      <h1 className="ml-10 text-2xl mt-32">Update Profile</h1>
      <div className="mt-5 mb-20 mx-10">
        <FormProfileStudent instructor={Instructor} token={token}/>
      </div>
      <FooterLanding />
    </>
  );
 
}

export default EditProfile