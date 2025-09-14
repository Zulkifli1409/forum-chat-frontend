import api from "./api";

export const getReports = (token) =>
    api.get("/reports", { headers: { Authorization: `Bearer ${token}` } });

export const getReportStats = (token) =>
    api.get("/reports/stats", { headers: { Authorization: `Bearer ${token}` } });

export const updateReportStatus = (id, status, token) =>
    api.put(`/reports/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });

export const submitReport = (data, token) =>
    api.post("/reports/report", data, { headers: { Authorization: `Bearer ${token}` } });