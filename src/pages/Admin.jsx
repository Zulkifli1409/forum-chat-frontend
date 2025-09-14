import { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  getUsers,
  approveUser,
  deleteUser,
  getChats,
  deleteChat,
  toggleRole,
  takeAction,
  rejectUser,
} from "../services/adminService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import ChatManagementTab from "../components/ChatManagementTab";
import AuditLogTab from "../components/AuditLogTab";
import AdManagementTab from "../components/AdManagementTab";
import AnnouncementManagementTab from "../components/AnnouncementManagementTab";
import SkeletonLoader from "../components/SkeletonLoader"; // Impor komponen skeleton

// Komponen ActionDropdown tidak berubah, jadi saya ringkas
const ActionDropdown = ({ u, user, handlers, actionLoading }) => {
  // ... (kode ActionDropdown tetap sama)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { handleToggleRole, handleTakeAction, handleDeleteUser } = handlers;
  const isSelf = user.id === u._id;
  const canTakeModerationAction =
    (user.role === "moderator" ||
      user.role === "admin" ||
      user.role === "super-admin") &&
    !isSelf;
  const canDelete =
    (user.role === "super-admin" && !isSelf) ||
    (user.role === "admin" &&
      u.role !== "admin" &&
      u.role !== "super-admin" &&
      !isSelf);
  const canChangeRole = user.role === "super-admin" && !isSelf;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isSelf) {
    return <span className="text-xs text-gray-500 italic">(Ini Anda)</span>;
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 focus:outline-none"
      >
        Aksi
        <svg
          className="-mr-1 ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 text-sm" role="menu">
            {canChangeRole && (
              <div className="px-4 py-2">
                <label className="block text-xs text-gray-500 dark:text-gray-400">
                  Ubah Peran
                </label>
                <select
                  onChange={(e) => {
                    handleToggleRole(u._id, e.target.value);
                    setIsOpen(false);
                  }}
                  defaultValue={u.role}
                  disabled={actionLoading === `role-${u._id}`}
                  className="mt-1 w-full text-xs border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                  <option value="super-admin">super-admin</option>
                </select>
              </div>
            )}

            {canTakeModerationAction && (
              <div className="border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => {
                    handleTakeAction(u._id, "warn");
                    setIsOpen(false);
                  }}
                  disabled={actionLoading === `${u._id}-warn`}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ⚠ Warn User
                </button>
                <button
                  onClick={() => {
                    handleTakeAction(u._id, "mute");
                    setIsOpen(false);
                  }}
                  disabled={actionLoading === `${u._id}-mute`}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔇 Mute User
                </button>
                <button
                  onClick={() => {
                    handleTakeAction(u._id, "ban");
                    setIsOpen(false);
                  }}
                  disabled={actionLoading === `${u._id}-ban`}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                >
                  🚫 Ban User
                </button>
              </div>
            )}

            {canDelete && (
              <div className="border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => {
                    handleDeleteUser(u._id);
                    setIsOpen(false);
                  }}
                  disabled={actionLoading === u._id}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  🗑️ Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Skeleton untuk Halaman Admin
const AdminPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader className="h-8 w-1/3" />
        <SkeletonLoader className="h-4 w-1/2 mt-2" />
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SkeletonLoader className="h-24" />
        <SkeletonLoader className="h-24" />
        <SkeletonLoader className="h-24" />
        <SkeletonLoader className="h-24" />
      </section>
      <section className="mb-8 bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:border-gray-700">
        <SkeletonLoader className="h-6 w-1/4 mb-4" />
        <div className="flex flex-wrap gap-3">
          <SkeletonLoader className="h-10 w-32" />
          <SkeletonLoader className="h-10 w-32" />
          <SkeletonLoader className="h-10 w-32" />
        </div>
      </section>
      <section>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
          <SkeletonLoader className="h-10 w-full mb-4" />
          <div className="space-y-4">
            <SkeletonLoader className="h-20 w-full" />
            <SkeletonLoader className="h-20 w-full" />
            <SkeletonLoader className="h-20 w-full" />
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [chatPage, setChatPage] = useState(1);
  const [chatTotal, setChatTotal] = useState(0);
  const limit = 20;

  const loadData = useCallback(
    async (isInitialLoad = false) => {
      if (!user?.token) return;
      if (isInitialLoad) setLoading(true);
      try {
        const [usersRes, chatsRes] = await Promise.all([
          getUsers(user.token, userPage, limit),
          getChats(user.token, chatPage, limit),
        ]);
        setUsers(usersRes.data.users || []);
        setUserTotal(usersRes.data.total || 0);
        setChats(chatsRes.data.chats || []);
        setChatTotal(chatsRes.data.total || 0);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        if (isInitialLoad) setLoading(false);
      }
    },
    [user?.token, userPage, chatPage]
  );

  useEffect(() => {
    const handleDataChange = () => loadData(false);
    socket.on("adminDataChanged", handleDataChange);
    return () => socket.off("adminDataChanged", handleDataChange);
  }, [loadData]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const createActionHandler = (serviceCall, id) => async () => {
    setActionLoading(id);
    try {
      await serviceCall();
    } catch (error) {
      alert(`Error: ${error.response?.data?.msg || "Terjadi kesalahan"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = (id) =>
    createActionHandler(() => approveUser(id, user.token), id)();

  const handleReject = (id) => {
    if (window.confirm("Yakin ingin menolak dan menghapus user ini?")) {
      createActionHandler(() => rejectUser(id, user.token), `reject-${id}`)();
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      createActionHandler(() => deleteUser(id, user.token), id)();
    }
  };
  const handleDeleteChat = (id) => {
    if (window.confirm("Yakin ingin menghapus chat ini?")) {
      createActionHandler(() => deleteChat(id, user.token), `chat-${id}`)();
    }
  };
  const handleToggleRole = (id, newRole) => {
    createActionHandler(
      () => toggleRole(id, newRole, user.token),
      `role-${id}`
    )();
  };
  const handleTakeAction = (id, action) => {
    const actionText = {
      warn: "memberi peringatan",
      mute: "mute selama 24 jam",
      ban: "ban permanen",
    };
    if (window.confirm(`Yakin ingin ${actionText[action]} user ini?`)) {
      createActionHandler(
        () => takeAction(id, action, null, user.token),
        `${id}-${action}`
      )();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.alias?.toLowerCase().includes(query.toLowerCase()) ||
      u.nim?.toLowerCase().includes(query.toLowerCase())
  );
  const mutedUsers = users.filter(
    (u) => u.isMuted && new Date(u.muteUntil) > new Date()
  );
  const warnedUsers = users.filter((u) => u.warnCount > 0);
  const pendingUsers = users.filter((u) => u.status === "pending");

  const getRemainingMute = (muteUntil) => {
    const diff = new Date(muteUntil) - new Date();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const renderPagination = (currentPage, totalItems, onPageChange) => {
    const totalPages = Math.ceil(totalItems / limit);
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola users, chat, dan laporan
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {userTotal}
            </p>
          </div>
          <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Approval
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {pendingUsers.length}
            </p>
          </div>
          <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Warned Users
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {warnedUsers.length}
            </p>
          </div>
          <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Messages
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {chatTotal}
            </p>
          </div>
        </section>

        <section className="mb-8 bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin-reports")}
              className="px-4 py-2 rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              📑 Lihat Reports
            </button>
            <button
              onClick={() => navigate("/admin-online")}
              className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              🟢 Online Users
            </button>
            <button
              onClick={() => navigate("/admin-private")}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              💬 Private Chat
            </button>
          </div>
        </section>

        <section>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex flex-col sm:flex-row sm:space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                👥 Users Management
              </button>
              <button
                onClick={() => setActiveTab("chats")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "chats"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                💬 Chat Messages
              </button>
              <button
                onClick={() => setActiveTab("moderation")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "moderation"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                🛡️ Moderation
              </button>
              <button
                onClick={() => setActiveTab("auditlog")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "auditlog"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                📜 Audit Log
              </button>
              <button
                onClick={() => navigate("/admin-analytics")}
                className="py-2 px-1 border-b-2 text-sm transition-colors text-left border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab("ads")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "ads"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                💰 Ad Management
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left ${
                  activeTab === "announcements"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                📢 Announcements
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Cari user..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        className="bg-white rounded-lg shadow-sm border p-4 dark:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
                              <span className="text-lg font-medium text-gray-700 dark:text-white">
                                {u.alias?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {u.alias}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {u.nim}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    u.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {u.status}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    u.role === "super-admin"
                                      ? "bg-red-200 text-red-800"
                                      : u.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : u.role === "moderator"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {u.role}
                                </span>
                                {u.warnCount > 0 && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                    ⚠ {u.warnCount} warning
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {u.status === "pending" &&
                              (user.role === "admin" ||
                                user.role === "super-admin") && (
                                <>
                                  <button
                                    onClick={() => handleApprove(u._id)}
                                    disabled={actionLoading === u._id}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-md disabled:bg-gray-400"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(u._id)}
                                    disabled={
                                      actionLoading === `reject-${u._id}`
                                    }
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-md disabled:bg-gray-400"
                                  >
                                    ✗ Reject
                                  </button>
                                </>
                              )}
                            <ActionDropdown
                              u={u}
                              user={user}
                              handlers={{
                                handleToggleRole,
                                handleTakeAction,
                                handleDeleteUser,
                              }}
                              actionLoading={actionLoading}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        Tidak ada user yang ditemukan.
                      </p>
                    </div>
                  )}
                </div>
                {renderPagination(userPage, userTotal, setUserPage)}
              </div>
            )}

            {activeTab === "chats" && (
              <div className="space-y-6">
                <ChatManagementTab chats={chats} onDelete={handleDeleteChat} />
                {renderPagination(chatPage, chatTotal, setChatPage)}
              </div>
            )}

            {activeTab === "moderation" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">
                    🔇 Muted Users ({mutedUsers.length})
                  </h3>
                  {mutedUsers.length > 0 ? (
                    <div className="space-y-3">
                      {mutedUsers.map((u) => (
                        <div
                          key={u._id}
                          className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {u.alias}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Sisa: {getRemainingMute(u.muteUntil)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Tidak ada user yang dimute
                    </p>
                  )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">
                    ⚠ Warned Users ({warnedUsers.length})
                  </h3>
                  {warnedUsers.length > 0 ? (
                    <div className="space-y-3">
                      {warnedUsers.map((u) => (
                        <div
                          key={u._id}
                          className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            {u.alias}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {u.warnCount} warning(s)
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Tidak ada user yang kena warning
                    </p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "auditlog" && <AuditLogTab />}
            {activeTab === "ads" && <AdManagementTab />}
            {activeTab === "announcements" && <AnnouncementManagementTab />}
          </div>
        </section>
      </main>
    </div>
  );
}
