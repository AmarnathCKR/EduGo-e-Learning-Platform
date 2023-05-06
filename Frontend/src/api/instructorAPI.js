import { instructorAPI } from "./config";

export const createAny = (link, input, token) =>
  instructorAPI.post(`${link}`, input, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });



export const postWithoutAuthApi = (link, input) =>
  instructorAPI.post(`${link}`, input);

  
export const getAnyData = (link, token) =>
  instructorAPI.get(`${link}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const getAnyDataWithout = (link) => instructorAPI.get(`${link}`);
