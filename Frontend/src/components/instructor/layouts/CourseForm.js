import React, { useEffect, useState, useCallback } from "react";
import "react-dropzone-uploader/dist/styles.css";

import Dropzone from "react-dropzone-uploader";

import axios from 'axios'
import { ProgressBar, Button } from 'react-bootstrap'

import { useDispatch } from "react-redux";
import {
  subscribeCourse,
  unsuscribeTeacher,
  unsuscribeToken,
} from "../../../store/store";
import { toast } from "react-toastify";
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
import { uploadImage } from "../../../api/imageUploadAPI";
import {
  createAny,
  getAnyData,
  getAnyDataWithout,
} from "../../../api/instructorAPI";


////////////////////////////////////
import AWS from 'aws-sdk'

const S3_BUCKET = 'edugoservice';
const REGION = 'ap-south-1';


AWS.config.update({
  accessKeyId: 'AKIAWBURZL7NKX5P356M',
  secretAccessKey: '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'
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})




//////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyDUrOSbu7aIWBt2FUJeqAB_TIDKiryx_fs",
  authDomain: "edugo-2.firebaseapp.com",
  projectId: "edugo-2",
  storageBucket: "edugo-2.appspot.com",
  messagingSenderId: "900365865405",
  appId: "1:900365865405:web:ac6509113f9930f28bc2d4",
  measurementId: "G-P667128RPD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function CourseForm(props) {
  const [progress, setProgress] = useState(0);
  const [indexValue, setIndex] = useState()


  const [error, setError] = useState("");
  const [errorInput, seterrorInput] = useState()
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
    video: {},
    videoRaw: null,
  });

  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState([]);
  const [effect, setEffect] = useState(false)
  const dummy = [
    { name: "", description: "", time: "", video: {}, progress: 0, ref: {}, cancelSource: '' },
  ];
  const [topics, setTopics] = useState(dummy);






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
    if (props.id) {
      toast.success("course Updated Successfully");
    }
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
              const response = await uploadImage(formData);

              const imageUrl = response.data.secure_url;

              const croppedUrl = imageUrl.replace('/upload/', '/upload/c_fill,g_auto,h_800,w_1200/')

              let data = {
                ...course,
                image: croppedUrl,
                topics: topics,
                video: url,
              };
              if (props.id) {
                data = {
                  ...course,
                  image: croppedUrl,
                  topics: topics,
                  video: url,
                  courseId: props.id,
                };
              }

              const url1 = props.link || "update-course";

              createAny(url1, data, props.token)
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
                  if (!err?.response?.data?.data?.errors[0]?.message) {
                    console.log(err?.response?.data?.data?.errors)
                    seterrorInput(err?.response?.data?.data?.errors);
                  }
                  if (err?.response?.data?.data?.errors[0]?.message) {
                    setError(err?.response?.data?.data?.errors[0]?.message);
                  }

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













  ///////////////////////////////////////////////////////////////////////////


  const getSignedUrl = (file) => {
    const params = {
      Bucket: "edugoservice",
      Key: file.file.name,
      ContentType: file.file.type,
    };
    return new Promise((resolve, reject) => {
      myBucket.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          reject(err);
          console.log(err)
        }
        resolve(url);

      });
    });
  };
  const getUploadData = async (file) => {


    const signedUrl = await getSignedUrl(file);
    console.log(signedUrl)

    setcourse((state) => ({
      ...state, video: {
        name: file.file.name,
        size: file.file.size,
        type: file.file.type,
      }
    }));

    return {
      url: signedUrl,
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
    };
  };


  const getUploadParams = async (file, index) => {


    const signedUrl = await getSignedUrl(file);
    console.log(signedUrl)
    const newTopics = [...topics];
    newTopics[index].video = {
      name: file.file.name,
      size: file.file.size,
      type: file.file.type,
    };
    setTopics(newTopics);


    return {
      url: signedUrl,
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };




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



      <Dropzone
        getUploadParams={(file) => getUploadParams(file, index)}
        onChangeStatus={handleChangeStatus}
        accept="image/*,audio/*,video/*"
      />




    </div>







  ));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////




















  ////////////////////////////////////////////////////////////////////////////




  useEffect(() => {
    getAnyDataWithout("get-field").then((res) => {
      setSelect(res.data.data.content.data);
    });
    if (!effect) {
      if (props.id) {
        getAnyData(`get-course?course=${props.id}`, props.token)
          .then((res) => {
            const courseData = res.data.data.content.data;
            setcourse((state) => ({
              ...state,
              image: courseData.image,
              name: courseData.name,
              headline: courseData.headline,
              description: courseData.description,
              total: courseData.total,
              experience: courseData.experience,
              field: courseData.field,
              price: courseData.price,
              video: courseData.video,
            }));
            setTopics(courseData.topics);
            setEffect(true)
          })
          .catch((err) => console.log(err));

      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.link]);

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
          {errorInput?.name && <p className="text-start ml-5 text-red-500">{errorInput?.name}</p>}
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
          {errorInput?.headline && <p className="text-start ml-5 text-red-500">{errorInput?.headline}</p>}
          <textarea
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
          {errorInput?.description && <p className="text-start ml-5 text-red-500">{errorInput?.description}</p>}

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
          {errorInput?.price && <p className="text-start ml-5 text-red-500">{errorInput?.price}</p>}
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
          {errorInput?.total && <p className="text-start ml-5 text-red-500">{errorInput?.total}</p>}
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
          <Dropzone
            getUploadParams={(file) => getUploadData(file)}
            onChangeStatus={handleChangeStatus}
            accept="image/*,audio/*,video/*"
          />
        </div>
      </div>

      <div className="flex justify-center border items-center shadow my-3">
        {loading ? (
          <div className="z-40  p-64 loader-local bg-secondary">
            <CircleSpinner size={40} color="#000000" loading={loading} />
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
