import api from "./api";

// Mengambil notifikasi milik user
export const getNotifications = (token) =>
    api.get("/notifications", { headers: { Authorization: `Bearer ${token}` } });

// Menandai semua notifikasi sebagai sudah dibaca
export const markAllAsRead = (token) =>
    api.patch("/notifications/read-all", {}, { headers: { Authorization: `Bearer ${token}` } });