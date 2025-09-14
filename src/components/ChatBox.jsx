import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { socket } from "../socket";
import { AuthContext } from "../context/AuthContext";
import { getChats, sendChat } from "../services/chatService";
import ReportModal from "./ReportModal";

// Komponen untuk preview balasan
const ReplyPreview = ({ message, onCancel }) => {
  if (!message) return null;
  return (
    <div className="p-2 bg-gray-100 border-l-4 border-blue-500 rounded-r-lg mx-4 dark:bg-gray-700 dark:border-blue-400">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Membalas ke {message.alias}
          </p>
          <p className="text-sm text-gray-600 truncate dark:text-gray-300">
            {message.message}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function ChatBox() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  // State untuk paginasi
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatContainerRef = useRef(null);

  // Fungsi untuk memuat chat awal
  const loadInitialChats = useCallback(async () => {
    if (!user?.token) return;
    setIsLoadingMore(true);
    try {
      const res = await getChats(user.token, 1);
      if (Array.isArray(res.data.chats)) {
        setMessages(res.data.chats);
        setHasMore(res.data.hasMore);
        setPage(2);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView();
        }, 100);
      }
    } catch (error) {
      console.error("Gagal memuat chat awal:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [user?.token]);

  // useEffect utama untuk setup socket listener
  useEffect(() => {
    socket.emit("userOnline", user?.id);
    loadInitialChats();

    const handleNewMessage = (msg) => {
      const container = chatContainerRef.current;
      const isScrolledToBottom =
        container &&
        container.scrollHeight - container.clientHeight <=
          container.scrollTop + 100;

      setMessages((prev) => [...prev, msg]);

      if (isScrolledToBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }

      setTypingUser((prevTypingUser) =>
        msg.alias === prevTypingUser ? null : prevTypingUser
      );
    };

    const handleMessageUpdated = (updatedMsg) => {
      setMessages((prevMessages) =>
        prevMessages.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    const handlePublicTyping = (alias) => setTypingUser(alias);
    const handlePublicStopTyping = () => setTypingUser(null);

    socket.on("chatMessage", handleNewMessage);
    socket.on("chatMessageUpdated", handleMessageUpdated);
    socket.on("publicTyping", handlePublicTyping);
    socket.on("publicStopTyping", handlePublicStopTyping);

    return () => {
      socket.off("chatMessage", handleNewMessage);
      socket.off("chatMessageUpdated", handleMessageUpdated);
      socket.off("publicTyping", handlePublicTyping);
      socket.off("publicStopTyping", handlePublicStopTyping);
    };
  }, [loadInitialChats, user]);

  // Fungsi untuk memuat chat yang lebih lama
  const loadMoreChats = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);

    const container = chatContainerRef.current;
    const oldScrollHeight = container.scrollHeight;

    try {
      const res = await getChats(user.token, page);
      if (Array.isArray(res.data.chats) && res.data.chats.length > 0) {
        setMessages((prev) => [...res.data.chats, ...prev]);
        setHasMore(res.data.hasMore);
        setPage((prev) => prev + 1);

        setTimeout(() => {
          container.scrollTop = container.scrollHeight - oldScrollHeight;
        }, 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Gagal memuat chat lama:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Event handler untuk scroll
  const handleScroll = () => {
    if (
      chatContainerRef.current?.scrollTop === 0 &&
      hasMore &&
      !isLoadingMore
    ) {
      loadMoreChats();
    }
  };

  // Fungsi mengirim pesan (termasuk reply)
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const payload = { message, replyTo: replyTo ? replyTo._id : null };
      const res = await sendChat(payload, user.token);
      socket.emit("chatMessage", res.data);
      setMessage("");
      setReplyTo(null);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("publicStopTyping");
    } catch (err) {
      alert(err.response?.data?.msg || "Gagal mengirim pesan");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fungsi untuk mengirim event typing
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typingTimeoutRef.current) {
      socket.emit("publicTyping", user.alias);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("publicStopTyping");
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const getWarningMessage = () => {
    if (!user || !user.warnCount || user.warnCount <= 0) return null;
    const remaining = 5 - user.warnCount;
    return `Anda telah menerima ${user.warnCount} peringatan. ${remaining} peringatan lagi akan menyebabkan akun Anda diban permanen. Harap jaga perilaku Anda.`;
  };

  const renderMessageWithMentions = (text = "") => {
    const mentionRegex = /@([A-Za-z0-9#]+)/g;
    const parts = text.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const isMe = user && `@${part}` === user.alias;
        return (
          <strong
            key={index}
            className={`font-bold rounded px-1 ${
              isMe
                ? "bg-yellow-300 text-yellow-800 dark:bg-yellow-500/50 dark:text-yellow-200"
                : "bg-blue-200 text-blue-800 dark:bg-blue-500/50 dark:text-blue-200"
            }`}
          >
            @{part}
          </strong>
        );
      }
      return part;
    });
  };

  const warningMessage = getWarningMessage();
  const isMuted = user?.isMuted && new Date(user.muteUntil) > new Date();
  const isBanned = user?.isBanned;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
          Forum Chat
        </h2>
        <div className="h-1 w-20 bg-blue-600 rounded"></div>
      </div>

      {warningMessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/30 dark:border-yellow-500">
          <p className="text-sm text-yellow-700 font-medium dark:text-yellow-200">
            ⚠️ {warningMessage}
          </p>
        </div>
      )}

      {isMuted && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 dark:bg-red-900/30 dark:border-red-500/50">
          <p className="text-red-800 text-sm dark:text-red-200">
            🔇 Anda tidak bisa chat sampai{" "}
            <span className="font-medium">
              {new Date(user.muteUntil).toLocaleString()}
            </span>
          </p>
        </div>
      )}
      {isBanned && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 dark:bg-red-900/30 dark:border-red-500/50">
          <p className="text-red-800 text-sm font-medium dark:text-red-200">
            🚫 Akun Anda sudah dibanned.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
        >
          {isLoadingMore && (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
          {!hasMore && (
            <div className="text-center text-xs text-gray-500 py-2 dark:text-gray-400">
              -- Awal percakapan --
            </div>
          )}

          {messages.map((m) => {
            const isMe = user && m.userId?._id === user.id;
            const amIMentioned =
              user && m.mentions && m.mentions.includes(user.id);
            const isBannedUser = m.alias === "[User Telah Dibanned]";
            const isDeleted = m.isDeleted;
            const time = new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const senderRole = m.userId?.role || m.userRole || "user";
            const isSenderAdminOrHigher = [
              "moderator",
              "admin",
              "super-admin",
            ].includes(senderRole);

            // Tentukan kelas CSS berdasarkan kondisi
            let messageBubbleClass = "";
            let messageTextColor = "";

            if (isDeleted || isBannedUser) {
              // Atur latar belakang dan warna teks untuk pesan yang dihapus/diban
              messageBubbleClass = "bg-gray-100 dark:bg-gray-700";
              messageTextColor = "text-gray-500 italic dark:text-gray-400";
            } else if (amIMentioned) {
              // Atur latar belakang dan warna teks untuk pesan yang menyebut user
              messageBubbleClass =
                "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/40 dark:border-yellow-600";
              messageTextColor = "text-gray-800 dark:text-gray-100";
            } else if (isMe) {
              // Atur latar belakang dan warna teks untuk pesan dari diri sendiri
              messageBubbleClass = "bg-blue-600 text-white";
              messageTextColor = "text-white";
            } else {
              // Atur latar belakang dan warna teks untuk pesan standar
              messageBubbleClass =
                "bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600";
              messageTextColor = "text-gray-900 dark:text-gray-100";
            }

            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-xs lg:max-w-md group relative">
                  <div
                    className={`flex items-center mb-1 ${
                      isMe ? "justify-end" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                        isMe
                          ? "bg-blue-500 ml-2"
                          : isBannedUser || isDeleted
                          ? "bg-gray-400 mr-2"
                          : "bg-gray-500 mr-2"
                      }`}
                    >
                      {isBannedUser || isDeleted
                        ? "🚫"
                        : m.alias?.charAt(0)?.toUpperCase()}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isBannedUser || isDeleted
                          ? "text-gray-500 italic dark:text-gray-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {m.alias}
                    </span>
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${messageBubbleClass}`}>
                    {m.replyTo && (
                      <div
                        className={`mb-2 p-2 border-l-2 rounded-lg ${
                          isMe
                            ? "border-blue-300 bg-blue-500/30"
                            : "border-blue-400 bg-black/20 dark:border-gray-500 dark:bg-gray-600/30"
                        }`}
                      >
                        <p className="text-xs font-bold">
                          {m.replyToAlias || m.replyTo.alias}
                        </p>
                        <p className="text-xs italic truncate opacity-80">
                          {m.replyTo.message}
                        </p>
                      </div>
                    )}
                    <div
                      className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${messageTextColor}`}
                    >
                      {isDeleted
                        ? "[Pesan ini telah dihapus oleh admin]"
                        : isBannedUser
                        ? "Pesan dari pengguna ini telah dihapus."
                        : renderMessageWithMentions(m.message)}
                    </div>
                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        isMe
                          ? "text-white-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{time}</span>
                      {!isMe &&
                        !isBannedUser &&
                        !isDeleted &&
                        !isSenderAdminOrHigher && (
                          <button
                            onClick={() => {
                              setReportTarget({
                                messageId: m._id,
                                reportedId: m.userId?._id,
                              });
                              setShowReport(true);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            🚨 Report
                          </button>
                        )}
                    </div>
                  </div>
                  {!isDeleted && !isBannedUser && (
                    <div
                      className={`absolute top-0 ${
                        isMe ? "-left-8" : "-right-8"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <button
                        onClick={() => setReplyTo(m)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && (
          <div className="px-4 py-2 bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-500 italic dark:text-gray-400">
              {typingUser} sedang mengetik...
            </p>
          </div>
        )}

        <ReplyPreview message={replyTo} onCancel={() => setReplyTo(null)} />

        <div className="border-t border-gray-200 p-4 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder={
                user?.warnCount > 0
                  ? "⚠ Anda dalam pengawasan admin!"
                  : "Ketik pesan Anda..."
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ... dark:bg-gray-900 dark:text-white ${
                user?.warnCount > 0
                  ? "border-yellow-300 ... dark:bg-yellow-900/20 dark:border-yellow-700"
                  : "border-gray-300 dark:border-gray-600"
              } ${
                isMuted || isBanned
                  ? "bg-gray-100 ... dark:bg-gray-700"
                  : "bg-white"
              }`}
              disabled={isMuted || isBanned}
            />
            <button
              onClick={handleSendMessage}
              disabled={isMuted || isBanned || !message.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isMuted || isBanned || !message.trim()
                  ? "bg-gray-300 ... dark:bg-gray-600"
                  : "bg-blue-600 ..."
              }`}
            >
              Kirim
            </button>
          </div>
        </div>
      </div>

      {reportTarget && (
        <ReportModal
          show={showReport}
          onClose={() => setShowReport(false)}
          messageId={reportTarget.messageId}
          reportedId={reportTarget.reportedId}
          token={user.token}
        />
      )}
    </div>
  );
}
