import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getPrivateMessages,
  sendPrivateMessage,
} from "../services/privateChatService";
import { socket } from "../socket";

// Komponen baru untuk menampilkan status pesan (ikon centang)
const MessageStatus = ({ status }) => {
  const CheckIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  if (status === "read") {
    // Dua centang biru jika sudah dibaca
    return (
      <div className="relative w-4 h-4">
        <CheckIcon className="w-4 h-4 text-blue-300 absolute" />
        <CheckIcon className="w-4 h-4 text-blue-300 absolute -left-1.5" />
      </div>
    );
  }
  // Satu centang abu-abu jika terkirim (default)
  return <CheckIcon className="w-4 h-4 text-blue-100/60" />;
};

export default function ChatAdmin() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    socket.emit("joinRoom", user.id);

    getPrivateMessages(user.id, user.token).then((res) =>
      setMessages(res.data)
    );

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    };

    const handleTypingEvent = (alias) => setTypingUser(alias);

    // Listener baru untuk menandai semua pesan sebagai 'read'
    const handleMessagesRead = () => {
      setMessages((prev) =>
        prev.map((m) => (m.from.role === "user" ? { ...m, status: "read" } : m))
      );
    };

    socket.on("privateMessage", handleNewMessage);
    socket.on("typing", handleTypingEvent);
    socket.on("stopTyping", () => setTypingUser(null));
    socket.on("messagesReadByAdmin", handleMessagesRead); // Tambahkan listener baru

    return () => {
      socket.off("privateMessage", handleNewMessage);
      socket.off("typing", handleTypingEvent);
      socket.off("stopTyping");
      socket.off("messagesReadByAdmin", handleMessagesRead); // Hapus listener saat unmount
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    try {
      await sendPrivateMessage({ message: message }, user.token);
      setMessage("");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("stopTyping", "admins");
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      alert("Pesan gagal terkirim.");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", "admins", user.alias);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", "admins");
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Chat dengan Admin
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Hubungi admin untuk bantuan atau pertanyaan
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Admin Online
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20 dark:text-gray-400">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">
                  Belum ada percakapan
                </h3>
                <p>Mulai chat dengan admin untuk mendapatkan bantuan</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.from.role === "user";
                const time = new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={m._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md`}>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          isMe
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{m.message}</p>
                        <div
                          className={`flex items-center justify-end mt-2 text-xs ${
                            isMe
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span>{time}</span>
                          {isMe && (
                            <span className="ml-1.5">
                              <MessageStatus status={m.status} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {typingUser && (
            <div className="px-4 py-2 bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 italic dark:text-gray-400">
                {typingUser} sedang mengetik...
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 p-4 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Tulis pesan untuk admin..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  !message.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
