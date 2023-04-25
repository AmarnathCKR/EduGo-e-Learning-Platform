import React, { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import { useDispatch } from "react-redux";
import {
  subscribeTeacher,
  unsuscribeTeacher,
  unsuscribeToken,
} from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircleSpinner } from "react-spinners-kit";
import { googleLogout } from "@react-oauth/google";
import { createAny } from "../../../api/instructorAPI";
import { uploadImage } from "../../../api/imageUploadAPI";

function FormProfileInstructor(props) {
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [error, setError] = useState({});
  const [profile, setProfile] = useState({
    name: props.instructor.name,
    headline: props.instructor.headline,
    description: props.instructor.description,
    country: props.instructor.country,
    region: props.instructor.region,
    git: props.instructor.git,
    linkedin: props.instructor.linkedin,
    facebook: props.instructor.facebook,
    twitter: props.instructor.twitter,
    image: props.instructor.image,
    imageRaw: null,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileBrowseHandler = (event) => {
    let value = URL.createObjectURL(event.target.files[0]);
    setProfile((state) => ({ ...state, imageRaw: event.target.files[0] }));
    setProfile((state) => ({ ...state, image: value }));
  };

  const showToastSuccess = () => {
    toast.success("Profile Updated Successfully");
  };

  useEffect(() => {
    setError({});
  }, [profile]);

  const submitData = async () => {
    if (
      !profile.name ||
      !profile.headline ||
      !profile.description ||
      !profile.region ||
      !profile.git ||
      !profile.facebook ||
      !profile.linkedin ||
      !profile.twitter ||
      !profile.image
    ) {
      setLoading(false);
      setError("Please fill all the fields required");
    } else {
      if (!profile.imageRaw) {
        setLoading(true);
        const imageUrl = profile.image;

        const data = { ...profile, image: imageUrl };

        createAny("update-profile", data, props.token)
          .then((res) => {
            setLoading(false);

            dispatch(unsuscribeTeacher());
            localStorage.setItem(
              "teacherData",
              JSON.stringify(res.data.data.content.data)
            );
            dispatch(subscribeTeacher(res.data.data.content.data));
            navigate("/instructor/view-profile");
            showToastSuccess();
          })
          .catch((err) => {
            setLoading(false);
            setError(err.response.data.data.errors);
            if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
              localStorage.removeItem("teacherToken");
              dispatch(unsuscribeToken());
              localStorage.removeItem("teacherData");
              dispatch(unsuscribeTeacher());
              navigate("/instructor");
              googleLogout();
            }
          });
      } else {
        const file = profile.imageRaw;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "n0d0jino");

        try {
          if (formData) {
            const response = await uploadImage(formData);

            const imageUrl = response.data.secure_url;

            const data = { ...profile, image: imageUrl };

            createAny("update-profile", data, props.token)
              .then((res) => {
                setLoading(false);

                dispatch(unsuscribeTeacher());
                localStorage.setItem(
                  "teacherData",
                  JSON.stringify(res.data.data.content.data)
                );
                dispatch(subscribeTeacher(res.data.data.content.data));
                navigate("/instructor/view-profile");
                showToastSuccess();
              })
              .catch((err) => {
                setLoading(false);
                setError(err.response.data.data.errors);
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
          console.error(error);
        }
      }
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="grid grid-cols-2 justify-center ">
        <div className="col-span-2 p-5 md:col-span-1 border-2 shadow mx-4 my-3 py-3">
          <input
            className="w-full mt-2 px-2 border-2 rounded  py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(event) => {
              setProfile((state) => ({ ...state, name: event.target.value }));
            }}
            required
          />
          {error.name && (
            <h1 className="text-red-600 text-start ml-3">{error.name}</h1>
          )}
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            placeholder="Headline"
            required
            value={profile.headline}
            onChange={(event) => {
              setProfile((state) => ({
                ...state,
                headline: event.target.value,
              }));
            }}
          />
          {error.headline && (
            <h1 className="text-red-600 text-start ml-3">{error.headline}</h1>
          )}
          <textarea
            maxLength={500}
            className="w-full mt-2  px-2 pb-32 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Description"
            value={profile.description}
            onChange={(event) => {
              setProfile((state) => ({
                ...state,
                description: event.target.value,
              }));
            }}
          />
          {error.description && (
            <h1 className="text-red-600 text-start ml-3">
              {error.description}
            </h1>
          )}
          <CountryDropdown
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            value={country}
            required
            onChange={(val) => {
              setCountry(val);
              setProfile((state) => ({ ...state, country: val }));
            }}
          />
          {error.country && (
            <h1 className="text-red-600 text-start ml-3">{error.country}</h1>
          )}
          <RegionDropdown
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            country={country}
            value={region}
            required
            placeholder="region"
            onChange={(val) => {
              setRegion(val);
              setProfile((state) => ({ ...state, region: val }));
            }}
          />
          {error.region && (
            <h1 className="text-red-600 text-start ml-3">{error.region}</h1>
          )}
        </div>

        <div className="col-span-2 p-5 md:col-span-1  border-2 shadow mx-4 my-3 py-3">
          <label className="mx-3">Social Links</label>
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Git Hub"
            value={profile.git}
            onChange={(event) => {
              setProfile((state) => ({ ...state, git: event.target.value }));
            }}
          />
          {error.git && (
            <h1 className="text-red-600 text-start ml-3">{error.git}</h1>
          )}
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Linkedin"
            value={profile.linkedin}
            onChange={(event) => {
              setProfile((state) => ({
                ...state,
                linkedin: event.target.value,
              }));
            }}
          />
          {error.linkedin && (
            <h1 className="text-red-600 text-start ml-3">{error.linkedin}</h1>
          )}
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Facebook"
            value={profile.facebook}
            onChange={(event) => {
              setProfile((state) => ({
                ...state,
                facebook: event.target.value,
              }));
            }}
          />
          {error.facebook && (
            <h1 className="text-red-600 text-start ml-3">{error.facebook}</h1>
          )}
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="text"
            required
            placeholder="Twitter"
            value={profile.twitter}
            onChange={(event) => {
              setProfile((state) => ({
                ...state,
                twitter: event.target.value,
              }));
            }}
          />
          <label className="mx-3">Profile Picture</label>
          <img
            className="my-3 mx-4"
            width="20%"
            height="20%"
            src={
              profile.image
                ? profile.image
                : "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"
            }
            alt="profilePicture"
          />
          <input
            className="w-full mt-2 px-2 border-2 rounded py-1 text-gray-700bg-white focus:outline-none items-center"
            type="file"
            required
            onChange={fileBrowseHandler}
            placeholder="Update profile Picture"
          />
          {error.image && (
            <h1 className="text-red-600 text-start ml-3">{error.image}</h1>
          )}
        </div>
      </div>
      <div className="flex justify-center items-middle  my-3">
        {loading ? (
          <CircleSpinner size={40} color="#000" loading={loading} />
        ) : (
          <button
            onClick={submitData}
            className="px-8 py-2 bg-black text-white"
          >
            Update Profile
          </button>
        )}
      </div>
    </>
  );
}

export default FormProfileInstructor;
