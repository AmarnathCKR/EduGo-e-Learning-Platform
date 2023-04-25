import { studentAPI } from "./config";

export const postAnyStudentApi = (link, input, token) =>
  studentAPI.post(`${link}`, input, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const postWithoutAuthStudentApi = (link, input) =>
  studentAPI.post(`${link}`, input);

export const getAnyDataStudentAPI = (link, token) =>
  studentAPI.get(`${link}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const getAnyDataWithoutAuthStudentApi = (link) =>
  studentAPI.get(`${link}`);
