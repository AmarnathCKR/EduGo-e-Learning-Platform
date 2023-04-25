import axios from "axios";

export const adminAPI = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}/admin/`,
});

export const instructorAPI = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}/instructor/`,
});

export const studentAPI = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}/`,
});