import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getPrivateUsers,
  getPrivateMessages,
  replyPrivateMessage,
} from "../services/privateChatService";
import { socket } from "../socket";

export default function AdminPrivateChat() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const messagesEndRef = useRef(null);
  let typingTimeout = null;

  const fetchPrivateUsers = useCallback(() => {
    if (user?.token) {
      getPrivateUsers(user.token).then((res) => setUsers(res.data));
    }
  }, [user?.token]);

  useEffect(() => {
    fetchPrivateUsers();

    const handleOnlineUsers = (userIds) => setOnlineUserIds(userIds);
    const handleChatListChange = () => fetchPrivateUsers();

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("privateChatListChanged", handleChatListChange);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("privateChatListChanged", handleChatListChange);
    };
  }, [user, fetchPrivateUsers]);

  const loadMessages = (userId) => {
    setSelectedUser(userId);
    socket.emit("joinRoom", userId);
    getPrivateMessages(userId, user.token).then((res) => setMessages(res.data));
  };

  useEffect(() => {
    if (user?.id) {
      socket.emit("joinRoom", user.id);
    }
    const handlePrivateMessage = (msg) => {
      if (msg.from.id === selectedUser || msg.to.id === selectedUser) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } else {
        fetchPrivateUsers();
      }
    };
    socket.on("privateMessage", handlePrivateMessage);
    socket.on("typing", (alias) => setTypingUser(alias));
    socket.on("stopTyping", () => setTypingUser(null));
    socket.on("messageRead", (msgId) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "read" } : m))
      )
    );
    return () => {
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageRead");
    };
  }, [selectedUser, user?.id, fetchPrivateUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selectedUser) return;
    await replyPrivateMessage(
      { userId: selectedUser, message: reply },
      user.token
    );
    setReply("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const handleTyping = (e) => {
    setReply(e.target.value);
    if (!selectedUser) return;
    socket.emit("typing", selectedUser, user.alias || "Admin");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(
      () => socket.emit("stopTyping", selectedUser),
      2000
    );
  };

  const selectedUserData = users.find((u) => u._id === selectedUser);
  const isSelectedUserOnline =
    selectedUserData && onlineUserIds.includes(selectedUserData._id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Private Chat Admin
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Chat pribadi dengan users untuk support dan moderasi
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-screen max-h-[calc(100vh-200px)]">
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {users.length} total percakapan
              </p>
            </div>
            <div className="overflow-y-auto h-full p-2 space-y-1">
              {users.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl">💬</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada users
                  </p>
                </div>
              ) : (
                users.map((u) => {
                  const isOnline = onlineUserIds.includes(u._id);
                  const isSelected = selectedUser === u._id;
                  return (
                    <div
                      key={u._id}
                      onClick={() => loadMessages(u._id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-900/80"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              {u.alias?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isSelected
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {u.alias}
                          </p>
                          {isOnline && (
                            <span className="text-xs text-green-600 font-medium dark:text-green-400">
                              Online
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col dark:bg-gray-800 dark:border-gray-700">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {selectedUserData?.alias?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      {isSelectedUserOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedUserData?.alias}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isSelectedUserOnline ? "Online" : "Offline"} •{" "}
                        {selectedUserData?.role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((m) => {
                    const isMe = m.from.id === user.id;
                    const time = new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={m._id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`max-w-xs lg:max-w-md`}>
                          <div
                            className={`rounded-lg px-4 py-3 ${
                              isMe
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-900 border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">
                              {m.message}
                            </p>
                            <div
                              className={`flex items-center justify-end mt-2 text-xs ${
                                isMe
                                  ? "text-green-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              <span>{time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {typingUser && (
                  <div className="px-4 py-2 bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-1 mr-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="italic">
                        {typingUser} sedang mengetik...
                      </span>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 p-4 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={reply}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      placeholder="Balas pesan..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!reply.trim()}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        !reply.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Balas
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <div>
                  <div className="text-6xl mb-4">👋</div>
                  <h3 className="text-xl font-medium mb-2 dark:text-white">
                    Pilih User untuk Chat
                  </h3>
                  <p>Klik nama user di sidebar untuk mulai percakapan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
