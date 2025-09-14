import { createContext, useState, useEffect } from "react";
import { socket } from "../socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = {
      id: localStorage.getItem("id"),
      token: localStorage.getItem("token"),
      alias: localStorage.getItem("alias"),
      role: localStorage.getItem("role"),
      warnCount: parseInt(localStorage.getItem("warnCount"), 10) || 0,
      isMuted: localStorage.getItem("isMuted") === "true",
      muteUntil: localStorage.getItem("muteUntil"),
      isBanned: localStorage.getItem("isBanned") === "true",
    };

    if (storedUser.token && storedUser.id) {
      setUser(storedUser);
      socket.emit("registerUserSocket", storedUser.id);
    }
  }, []);

  useEffect(() => {
    const handleUserUpdate = (updatedUserData) => {
      console.log("Menerima update data user:", updatedUserData);
      login(updatedUserData);
    };

    socket.on("userUpdated", handleUserUpdate);

    return () => {
      socket.off("userUpdated", handleUserUpdate);
    };
  }, []);

  const login = (data) => {
    const userData = {
      id: data.id || data._id,
      token: data.token,
      alias: data.alias,
      role: data.role,
      warnCount: data.warnCount || 0,
      isMuted: data.isMuted || false,
      muteUntil: data.muteUntil || null,
      isBanned: data.isBanned || false,
    };

    setUser(userData);

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        localStorage.setItem(key, value);
      }
    });

    if (userData.id) {
      socket.emit("registerUserSocket", userData.id);
    }
  };

  const logout = () => {
    const userId = localStorage.getItem("id");
    if (userId) {
    }
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
