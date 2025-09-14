import api from "./api";

export const getAds = (token) =>
    api.get("/ads", { headers: { Authorization: `Bearer ${token}` } });

export const createAd = (data, token) =>
    api.post("/ads", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateAd = (id, data, token) =>
    api.put(`/ads/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAd = (id, token) =>
    api.delete(`/ads/${id}`, { headers: { Authorization: `Bearer ${token}` } });