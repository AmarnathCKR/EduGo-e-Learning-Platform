import { adminAPI } from "./config";

export const adminLoginAPI = (data) => adminAPI.post("login", data);

export const fetchAnyDetailsApi = (link, queries, token) =>
  adminAPI.get(
    `${link}?page=${queries.page}&pageSize=${queries.pageSize}&sortField=${queries.sortModel.length > 0 ? queries.sortModel[0].field : ""
    }&sortOrder=${queries.sortModel.length > 0 ? queries.sortModel[0].sort : ""
    }&searchText=${queries.searchText}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getDataApi = (link, id, token) =>
  adminAPI.get(`${link}?id=${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const blockFieldApi = (id, token) =>
  adminAPI.delete(`delete-field?id=${id}&status=${true}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const blockCouponApi = (id, token) =>
  adminAPI.delete(`delete-coupon?id=${id}&status=${true}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const createAny = (link, input, token) =>
  adminAPI.post(`${link}`, input, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const handleAnyPatch = (link, data, token) => adminAPI.patch(`${link}`, data, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const getAnyAdmin = (link, token) => adminAPI.get(`${link}`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});