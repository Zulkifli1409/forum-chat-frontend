import api from "./api";

export const getChats = (token) =>
    api.get("/chat", { headers: { Authorization: `Bearer ${token}` } });

export const sendChat = (data, token) =>
    api.post("/chat", data, { headers: { Authorization: `Bearer ${token}` } });
