import api from "./api";

export const getGeneralStats = (token) =>
    api.get("/analytics/stats", { headers: { Authorization: `Bearer ${token}` } });

export const getChatActivityByHour = (token) =>
    api.get("/analytics/activity-by-hour", { headers: { Authorization: `Bearer ${token}` } });

export const getMostActiveUsers = (token) =>
    api.get("/analytics/active-users", { headers: { Authorization: `Bearer ${token}` } });