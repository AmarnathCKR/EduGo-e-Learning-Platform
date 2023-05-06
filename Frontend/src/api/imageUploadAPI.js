import axios from "axios";

export const uploadImage = (formData) => {

    return axios.post(`${process.env.REACT_APP_CLOUDINARY_UPLOAD}`, formData)
}