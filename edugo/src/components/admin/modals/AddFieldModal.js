import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleSpinner } from "react-spinners-kit";
import { ToastContainer, toast } from "react-toastify";
import { unsuscribeAdminToken } from "../../../store/store";
import { googleLogout } from "@react-oauth/google";
import {useNavigate} from "react-router-dom"

function AddFieldModal(props) {
  const [error, setError] = useState(false);
  const [input, setInput] = useState({
    name: "",
    tag: "",
    image: null,
    imageRaw: null,
  });

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.adminToken);

  const fileBrowseHandler = (event) => {
    let value = URL.createObjectURL(event.target.files[0]);
    setInput((state) => ({ ...state, imageRaw: event.target.files[0] }));
    setInput((state) => ({ ...state, image: value }));
  };
  const showToastSuccess = () => {
    toast.success("Field Category Created");
  };
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const create = async () => {
    if (!input.name || !input.tag || !input.imageRaw) {
      setLoading(false);
      setError("Please fill all the fields required");
    } else {
      const file = input.imageRaw;
      setLoading(true);
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

          const data = { ...input, image: imageUrl };

          const url = "http://localhost:5000/admin/create-field";
          axios
            .post(url, data, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log(res.data.data.content.data);
              
              showToastSuccess();
              props.click()
            })
            .catch((err) => {
              setLoading(false);
              setError(err.response.data.data.errors[0].message);
              if (err.response.data.data.errors[0].code === "USER_BLOCKED") {
                  localStorage.removeItem("adminToken");
         
                  dispatch(unsuscribeAdminToken());
                  navigate("/admin");
                  googleLogout();
              }
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {props.show && (
        <>
          <div className="z-30 modal-local p-4">
            <div className="modal-local-content rounded">
              <div className="modal-local-header">
                <h4 className="modal-local-title text-center font-bold text-xl">
                  Add new Field Category
                </h4>
              </div>
              <div className="modal-local-body text-center">
                <h2 className={`py-3 text-lg font-medium ${error ? "text-red-500":"text-black"}`}>
                  {error ? error : "Enter Field category details"}
                </h2>

                <div className="flex flex-col my-4 mx-2">
                  <input
                    className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                    type="text"
                    value={input.name}
                    placeholder="Field name"
                    onChange={(event) => {
                      setInput({ ...input, name: event.target.value });
                    }}
                  />
                </div>
                <div className="flex my-4 mx-2">
                  <input
                    className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                    type="text"
                    placeholder="Tag name"
                    value={input.tag}
                    onChange={(event) => {
                      setInput({ ...input, tag: event.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col my-4 mx-2">
                  <label className="mx-3">Input Picture</label>
                  <img
                    className="my-3 mx-4"
                    width="20%"
                    height="20%"
                    src={
                      input.image
                        ? input.image
                        : "https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png"
                    }
                    alt="InputPicture"
                  />
                  <input
                    className="w-full my-2 px-2 mx-2 border-2 rounded py-1 text-gray-700 bg-white focus:outline-none items-center"
                    type="file"
                    required
                    onChange={fileBrowseHandler}
                    placeholder="Update Input Picture"
                  />
                </div>
                <div className="flex flex-col my-4 mx-2 justify-center">
                  <ToastContainer />
                  {loading ? (
                    <div className="flex items-center justify-center w-full">
                      {" "}
                      <CircleSpinner size={20} color="#000" />
                    </div>
                  ) : (
                    <button
                      onClick={create}
                      className="border bg-neutral-900 text-white p-2"
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
              <div className="modal-local-footer">
                <button onClick={props.click} className="button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddFieldModal;
