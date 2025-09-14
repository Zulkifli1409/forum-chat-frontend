import api from "./api";

export const register = (data) => api.post("/auth/register", data);

export const login = async (data) => {
    const res = await api.post("/auth/login", data);

    // Kembalikan semua data user yang diterima dari backend
    return res.data;
};
