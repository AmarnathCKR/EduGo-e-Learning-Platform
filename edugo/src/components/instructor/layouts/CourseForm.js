import React, { useState } from "react";

import axios from "axios";
import { useDispatch } from "react-redux";
import {
  subscribeCourse,
 
  unsuscribeTeacher,
  unsuscribeToken,
} from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircleSpinner } from "react-spinners-kit";
import { googleLogout } from "@react-oauth/google";

function CourseForm(props) {
  const [error, setError] = useState("");
  const [course, setcourse] = useState({
    name: "",
    headline: "",
    description: "",
    experience: "Beginner",
    field: "",
    price: "",
    total: "",
    image: "",
    imageRaw: null,
  });
  const [loading, setLoading] = useState(false);

  const [topics, setTopics] = useState([
    { name: "", description: "", time: "" },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileBrowseHandler = (event) => {
    let value = URL.createObjectURL(event.target.files[0]);
    setcourse((state) => ({ ...state, imageRaw: event.target.files[0] }));
    setcourse((state) => ({ ...state, image: value }));
  };

  const showToastSuccess = () => {
    toast.success("course Created Successfully");
  };

  const submitData = async () => {
    if (
      !course.name ||
      !course.headline ||
      !course.description ||
      !course.price ||
      !course.total ||
      !course.field ||
      !course.experience ||
      !course.image ||
      !course.imageRaw
    ) {
      setError("Please fill all the fields required");
    } else {
      setLoading(true)
      const file = course.imageRaw;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "n0d0jino");

      try {
        if (formData) {
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dqrpxoouq/image/upload",
            formData
          );

          const imageUrl = response.data.secure_url;

          const data = { ...course, image: imageUrl, topics: topics };

          const url = "http://localhost:5000/instructor/update-course";
          axios
            .post(url, data, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.token}`,
              },
            })
            .then((res) => {
              setLoading(false)
              dispatch(subscribeCourse(res.data.data.content.data));
              localStorage.setItem("courses",JSON.stringify(res.data.data.content.data))
              navigate("/instructor/course-page");
              showToastSuccess();
            })
            .catch((err) => {
              setLoading(false)
              setError(err.response.data.data.errors[0].message);
              if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                localStorage.removeItem("teacherToken");
                dispatch(unsuscribeToken());
                localStorage.removeItem("teacherData");
                dispatch(unsuscribeTeacher());
                navigate("/instructor");
                googleLogout();
               }
            });
        }
      } catch (error) {
        setLoading(false)
        console.error(error);
      }
    }
  };

  const handleTopicNameChange = (index, event) => {
    const newTopics = [...topics];
    newTopics[index].name = event.target.value;
    setTopics(newTopics);
  };

  const handleTopicDescriptionChange = (index, event) => {
    const newTopics = [...topics];
    newTopics[index].description = event.target.value;
    setTopics(newTopics);
  };

  const handleAddTopic = () => {
    const newTopics = [...topics, { name: "", description: "" }];
    setTopics(newTopics);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleTopicTimeChange = (index, event) => {
    const newTopics = [...topics];
    newTopics[index].time = event.target.value;
    setTopics(newTopics);
  };

  const topic = topics.map((topic, index) => (
    <div className="my-5 bg-neutral-200 border" key={index}>
      <div className="flex justify-between">
        <label>Module : {index + 1}</label>
        {index > 0 && (
          <button
            className="text-red-500"
            onClick={() => handleRemoveTopic(index)}
          >
            Remove Topic
          </button>
        )}
      </div>
      <input
        className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700bg-white focus:outline-none items-center"
        type="text"
        placeholder="Topic Name"
        value={topic.name}
        onChange={(event) => handleTopicNameChange(index, event)}
        required
      />
      <input
        className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700bg-white focus:outline-none items-center"
        type="text"
        placeholder="Description"
        value={topic.description}
        onChange={(event) => handleTopicDescriptionChange(index, event)}
        required
      />
      <input
        className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700bg-white focus:outline-none items-center"
        type="number"
        placeholder="Time required (Minutes)"
        value={topic.time}
        onChange={(event) => handleTopicTimeChange(index, event)}
        required
      />
    </div>
  ));

  return (
    <>
      <ToastContainer />
      <div className="w-full mt-20 px-20">
        <h1 className="text-3xl text-center my-8">Create a new course</h1>
        <h1 className="text-red-600 text-center">{error}</h1>

        <div className="col-span-2 md:col-span-1 border-2 shadow mx-4 my-3 py-3">
          <input
            className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            placeholder="Name"
            value={course.name}
            onChange={(event) => {
              setcourse((state) => ({ ...state, name: event.target.value }));
            }}
            required
          />
          <input
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            placeholder="Headline"
            required
            value={course.headline}
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                headline: event.target.value,
              }));
            }}
          />
          <textarea
            maxLength={500}
            className="w-full my-2  px-2 pb-32 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Description"
            value={course.description}
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                description: event.target.value,
              }));
            }}
          />

          <input
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            placeholder="Field of Study"
            required
            value={course.field}
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                field: event.target.value,
              }));
            }}
          />
          <select
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                experience: event.target.value,
              }));
            }}
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
          >
            <option className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center">
              Beginner
            </option>
            <option className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center">
              Intermediate
            </option>
            <option className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center">
              Professional
            </option>
            <option className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center">
              Expert
            </option>
          </select>
          <input
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="number"
            placeholder="Price in Rupees"
            required
            value={course.price}
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                price: event.target.value,
              }));
            }}
          />
        </div>

        <div className="col-span-2 md:col-span-1  border-2 shadow mx-4 my-3 py-3">
          <label className="mx-3">
            Enter all topics covered in this Course
          </label>
          {topic}

          <button
            onClick={handleAddTopic}
            className="p-2 mx-2 text-white bg-primary"
          >
            Add more topic
          </button>

          <input
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="number"
            placeholder="Total time required (hours)"
            required
            value={course.total}
            onChange={(event) => {
              setcourse((state) => ({
                ...state,
                total: event.target.value,
              }));
            }}
          />
          <label className="mx-3">Course Image</label>
          <img
            className="my-3 mx-4"
            width="20%"
            height="20%"
            src={
              course.image
                ? course.image
                : "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"
            }
            alt="CoursePicture"
          />
          <input
            className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="file"
            required
            onChange={fileBrowseHandler}
          />
        </div>
      </div>
      <div className="flex justify-center border items-center shadow my-3">
        {loading ? (
          <div className="z-40  p-64 loader-local bg-secondary"><CircleSpinner size={40} color="#000 " loading={loading} /></div>
        ) : (
          <button onClick={submitData} className="p-2 px-16  bg-black text-white">
            Create Course
          </button>
        )}
      </div>
    </>
  );
}

export default CourseForm;
