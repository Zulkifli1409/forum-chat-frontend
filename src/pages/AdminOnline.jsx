import { useState, useEffect, useContext, useCallback } from "react";
import { socket } from "../socket";
import { AuthContext } from "../context/AuthContext";
import { getUsers } from "../services/adminService";
import { useNavigate } from "react-router-dom";

export default function AdminOnline() {
  const { user } = useContext(AuthContext);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllUsers = useCallback(async () => {
    // ... (fungsi logic tidak berubah)
    if (user?.token) {
      try {
        const res = await getUsers(user.token);
        setAllUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user?.token]);

  useEffect(() => {
    // ... (fungsi logic tidak berubah)
    fetchAllUsers();
    const handleOnlineUsers = (userIds) => {
      setOnlineUserIds(userIds);
    };
    socket.on("onlineUsers", handleOnlineUsers);
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [user, fetchAllUsers]);

  const onlineUsersData = allUsers.filter((u) => onlineUserIds.includes(u._id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading online users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Online Users
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Monitor users yang sedang aktif di forum
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {onlineUserIds.length} Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 flex items-center dark:text-white">
              🟢 Users Currently Online
            </h3>
          </div>
          <div className="p-6">
            {onlineUsersData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                  Tidak ada user online
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Semua user sedang offline saat ini
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onlineUsersData.map((u) => (
                  <div
                    key={u._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            {u.alias?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {u.alias}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate dark:text-gray-400">
                          {u.nim}
                        </p>
                      </div>
                    </div>
                    {u._id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex space-x-1">
                          <button
                            onClick={() =>
                              navigate(`/admin-private?user=${u._id}`)
                            }
                            className="flex-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded transition-colors dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300"
                          >
                            💬 Chat
                          </button>
                          <button
                            onClick={() => navigate("/admin")}
                            className="flex-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs rounded transition-colors dark:bg-gray-700/80 dark:hover:bg-gray-600 dark:text-gray-300"
                          >
                            ⚙️ Actions
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
