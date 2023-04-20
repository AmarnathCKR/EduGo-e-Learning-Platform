import React, { useEffect, useState } from "react";

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
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { Player, ControlBar } from "video-react";
import { BiTrash } from "react-icons/bi";

const firebaseConfig = {
  apiKey: "AIzaSyASd_nl36pkPP-68OtSzhwacsQxtQ88ZwY",
  authDomain: "edugo-e-lerning.firebaseapp.com",
  projectId: "edugo-e-lerning",
  storageBucket: "edugo-e-lerning.appspot.com",
  messagingSenderId: "110356446945",
  appId: "1:110356446945:web:49cfe86d61dc2aedf341a0",
  measurementId: "G-6NZZ398W04",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function CourseForm(props) {
  const [progress, setProgress] = useState(0);

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
    video: "",
    videoRaw: null,
  });
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState([]);

  const [topics, setTopics] = useState([
    { name: "", description: "", time: "", video: "", progress: 0, ref: {} },
  ]);

  const handleVideoRender = async (event) => {
    let value = URL.createObjectURL(event.target.files[0]);
    setcourse((state) => ({ ...state, videoRaw: event.target.files[0] }));
    setcourse((state) => ({ ...state, video: value }));
  };

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
    console.log(course);
    if (
      !course.name ||
      !course.headline ||
      !course.description ||
      !course.price ||
      !course.total ||
      !course.field ||
      !course.experience ||
      !course.image ||
      !course.imageRaw ||
      !course.videoRaw
    ) {
      setError("Please fill all the fields required");
    } else {
      setLoading(true);
      const file = course.imageRaw;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "n0d0jino");

      try {
        if (formData) {
          const file2 = course.videoRaw;
          const storageRef = ref(storage, `videos/${file2.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file2);

          await uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Handle progress
              const progresss =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(+progresss);
            },
            (error) => {
              // Handle error
              console.error(error);
              setProgress(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setcourse((state) => ({ ...state, video: url }));
              const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dqrpxoouq/image/upload",
                formData
              );

              const imageUrl = response.data.secure_url;

              const data = {
                ...course,
                image: imageUrl,
                topics: topics,
                video: url,
              };

              const url1 = "http://localhost:5000/instructor/update-course";
              axios
                .post(url1, data, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.token}`,
                  },
                })
                .then((res) => {
                  setLoading(false);
                  dispatch(subscribeCourse(res.data.data.content.data));
                  localStorage.setItem(
                    "courses",
                    JSON.stringify(res.data.data.content.data)
                  );
                  navigate("/instructor/course-page");
                  showToastSuccess();
                })
                .catch((err) => {
                  setLoading(false);
                  setError(err.response.data.data.errors[0].message);
                  if (
                    err.response.data.data.errors[0].code === "USER_BLOCKED"
                  ) {
                    localStorage.removeItem("teacherToken");
                    dispatch(unsuscribeToken());
                    localStorage.removeItem("teacherData");
                    dispatch(unsuscribeTeacher());
                    navigate("/instructor");
                    googleLogout();
                  }
                });
            }
          );
        }
      } catch (error) {
        setLoading(false);
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

  const dropDown = select.map((item) => {
    return (
      <option
        key={item._id}
        className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
        value={item._id}
      >
        {item.name}
      </option>
    );
  });

  const topic = topics.map((topic, index) => (
    <div
      className="mb-10 justify-center items-center bg-neutral-200 border"
      key={index}
    >
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
        className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700 bg-white focus:outline-none items-center"
        type="number"
        placeholder="Time required (Minutes)"
        value={topic.time}
        onChange={(event) => handleTopicTimeChange(index, event)}
        required
      />

      {topic.video && (
        <div className="md:px-20 px-3 w-full">
          <Player
            className="h-96 w-full md:w-1/3 mx-auto max-w-fit"
            autoPlay
            src={topic.video}
          >
            <ControlBar autoHide={false} className="my-class" />
          </Player>
          <div className="flex justify-center items-center my-4 w-full">
            <button
              className="text-red-500 p-2 bg-black border flex rounded align-middle items-center"
              onClick={(event) => handleDeleteVideo(index, event)}
            >
              <BiTrash color="white" size="35px" /> Remove this video
            </button>
          </div>
        </div>
      )}
      {topic.progress !== 0 && topic.progress !== 100 && topic.progress && (
        <div className="flex justify-center items-center w-full ">
          <div class="w-1/2 bg-gray-200 flex-col text-center text-lg rounded-full dark:bg-gray-700">
            Uploading Please wait
            <div class="bg-white text-xs font-medium text-blue-100 text-center h-4 my-2 p-0.5 leading-none w-full rounded-full relative">
              <span
                className={`z-30 absolute ${
                  topic.progress >= 50 ? "text-white" : "text-neutral-500"
                }`}
              >
                {Math.floor(topic.progress)}%
              </span>
              <div
                class="bg-blue-600 z-10 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full h-full absolute top-0"
                style={{ width: `${Math.floor(topic.progress)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {!topic.video && !topic.progress && (
        <input
          className="w-full my-2 px-2  mx-2 border-2 rounded  py-1 text-gray-700 bg-white focus:outline-none items-center"
          type="file"
          accept="video/*"
          onChange={(event) => handleTopicVideoChange(index, event)}
        />
      )}
    </div>
  ));

  const showVideoRemoval = () => {
    toast.success("Video Removed Successfully");
  };

  const handleDeleteVideo = async (index, event) => {
    const fileRef = ref(storage, `videos/${topics[index].ref.name}`);
    //2.
    deleteObject(fileRef)
      .then(() => {
        showVideoRemoval();
        const newTopics = [...topics];
        newTopics[index].video = "";
        newTopics[index].progress = 0;
        setTopics(newTopics);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTopicVideoChange = async (index, event) => {
    const file2 = event.target.files[0];

    const storageRef = ref(storage, `videos/${file2.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file2);

    uploadTask.on(
      "state_changed",
      async (snapshot) => {
        // Handle progress
        const progresss =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        const newTopics = [...topics];
        newTopics[index].progress = +progresss;
        newTopics[index].ref = file2;

        setTopics(newTopics);
      },
      (error) => {
        // Handle error
        console.log("hererer");
        console.error(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        const newTopics = [...topics];
        newTopics[index].video = url;
        setTopics(newTopics);
      }
    );
  };

  useEffect(() => {
    axios.get("http://localhost:5000/instructor/get-field").then((res) => {
      setSelect(res.data.data.content.data);
    });
  }, []);

  return (
    <>
      <div className="w-full mt-20 md:px-20 px-2">
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

          <select
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
          >
            {dropDown}
          </select>
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
          <label className="mx-3 font-semibold text-lg">Course Image</label>
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
          <label className="mx-3  font-semibold text-lg">
            Course Overview Video
          </label>
          <h1 className="mx-3 py-3">
            You need to make a video about your course and explain what your
            going teach. Please include all the topics. The admin will review
            this video.
          </h1>
          {course.video && (
            <div className="md:px-20 px-3">
              <Player
                className="h-96 w-full md:w-1/3 mx-auto max-w-fit"
                autoPlay
                src={course.video}
              >
                <ControlBar autoHide={false} className="my-class" />
              </Player>
            </div>
          )}
          {progress !== 0 && progress !== 100 && progress ? (
            progress
          ) : (
            <input
              className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
              type="file"
              accept="video/*"
              onChange={handleVideoRender}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center border items-center shadow my-3">
        {loading ? (
          <div className="z-40  p-64 loader-local bg-secondary">
            <CircleSpinner size={40} color="#000 " loading={loading} />
          </div>
        ) : (
          <button
            onClick={submitData}
            className="p-2 px-16  bg-black text-white"
          >
            Create Course
          </button>
        )}
      </div>
    </>
  );
}

export default CourseForm;
