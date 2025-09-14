import api from "./api";

export const sendPrivateMessage = (data, token) =>
    api.post(`/private/send`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getPrivateUsers = (token) =>
    api.get(`/private/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getPrivateMessages = (userId, token) =>
    api.get(`/private/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const replyPrivateMessage = (data, token) =>
    api.post(`/private/reply`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });