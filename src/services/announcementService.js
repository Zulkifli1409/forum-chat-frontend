import api from "./api";

export const getAnnouncements = (token) =>
    api.get("/announcements", { headers: { Authorization: `Bearer ${token}` } });

export const createAnnouncement = (data, token) =>
    api.post("/announcements", data, { headers: { Authorization: `Bearer ${token}` } });

// ▼▼▼ GANTI toggleAnnouncement DENGAN FUNGSI INI ▼▼▼
export const broadcastAnnouncement = (id, token) =>
    api.post(`/announcements/${id}/broadcast`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAnnouncement = (id, token) =>
    api.delete(`/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } });