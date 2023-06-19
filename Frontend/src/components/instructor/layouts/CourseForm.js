import React, { useEffect, useState } from "react";
import "react-dropzone-uploader/dist/styles.css";

import Dropzone from "react-dropzone-uploader";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,

} from "firebase/storage";





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

import { uploadImage } from "../../../api/imageUploadAPI";
import {
  createAny,
  getAnyData,
  getAnyDataWithout,
} from "../../../api/instructorAPI";


////////////////////////////////////




//////////////////////////////////////

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
      !course.video

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

          const response = await uploadImage(formData);

          const imageUrl = response.data.secure_url;

          const croppedUrl = imageUrl.replace('/upload/', '/upload/c_fill,g_auto,h_800,w_1200/')

          let data = {
            ...course,
            image: croppedUrl,
            topics: topics,

          };
          if (props.id) {
            data = {
              ...course,
              image: croppedUrl,
              topics: topics,

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


      } catch (error) {
        setLoading(false);

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

  const handleChangeStatus = (meta, updateFile, file, status, index) => {

    const file2 = status[0].file;

    if (file === "done") {
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
          console.log(error)
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("file upaloaded")
          console.log(url);

          const newTopics = [...topics];
          newTopics[index].video = url;
          setTopics(newTopics);
        }
      );

    }


  };


  const handleChangeStatus2 = (meta, updateFile, file, status) => {

    const file2 = status[0].file;

    if (file === "done") {
      const storageRef = ref(storage, `videos/${file2.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file2);

      uploadTask.on(
        "state_changed",
        async (snapshot) => {
          // Handle progress
          const progresss = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progresss)
        }, (error) => {
          console.log(error)
        },

        async () => {
          console.log("file upaloaded")
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(url);
          setcourse((state) => ({ ...state, video: url }))
        }
      );

    }


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

        onChangeStatus={({ meta, updateFile }, file, status) => { handleChangeStatus(meta, updateFile, file, status, index) }}
        accept="video/*"
        multiple={false}
        maxFiles={1}
      />





    </div>







  ));




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

            onChangeStatus={({ meta, updateFile }, file, status) => { handleChangeStatus2(meta, updateFile, file, status) }}
            accept="video/*"
            multiple={false}
            maxFiles={1}
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
