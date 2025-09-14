import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";
import {
  getNotifications,
  markAllAsRead,
} from "../services/notificationService";

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.token) {
      getNotifications(user.token).then((res) => setNotifications(res.data));

      const handleNewNotification = (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [user]);

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(user.token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 dark:bg-gray-800 dark:ring-gray-600">
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6 dark:text-gray-400">
                Tidak ada notifikasi
              </p>
            ) : (
              notifications.map((notif) => (
                <Link
                  to={notif.link || "#"}
                  key={notif._id}
                  className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    !notif.isRead ? "bg-blue-50 dark:bg-blue-900/30" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
