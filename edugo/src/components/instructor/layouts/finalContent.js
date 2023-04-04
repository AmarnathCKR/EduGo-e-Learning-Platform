import { useNavigate } from "react-router-dom";

function FinalContent(props) {
  const navigate = useNavigate()
  const handleClick = ()=>{
    props.open()
    navigate("/instructor/course-page");

  }
    return (
      <>
       <div className="text-center bg-neutral-200 p-7 mt-10">
        <h1 className="font-bold md:text-5xl text-3xl my-3">Become an instructor today</h1>
        <h2 className=" md:text-3xl text-xl my-2">Join one of the world’s largest online learning <br></br>marketplaces.</h2>
        <button onClick={handleClick} className="border bg-neutral-900 text-white py-2 px-12">Get Started</button>
       </div>
      </>
    );
  }
  
  export default FinalContent;
  