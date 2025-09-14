import api from "./api";

export const getUsers = (token, page = 1, limit = 20) =>
    api.get(`/admin/users?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

export const approveUser = (id, token) =>
    api.patch(`/admin/users/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });

// Fungsi baru untuk reject user
export const rejectUser = (id, token) =>
    api.patch(`/admin/users/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const deleteUser = (id, token) =>
    api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const getChats = (token, page = 1, limit = 20) =>
    api.get(`/admin/chats?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

export const deleteChat = (id, token) =>
    api.delete(`/admin/chats/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const toggleRole = (id, newRole, token) =>
    api.put(`/admin/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });

export const takeAction = (userId, action, reportId, token) =>
    api.post(`/reports/action`, { userId, action, reportId }, { headers: { Authorization: `Bearer ${token}` } });

export const getAuditLogs = (token, page = 1, limit = 25) =>
    api.get(`/audit-logs?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });