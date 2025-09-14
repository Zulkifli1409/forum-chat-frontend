import { useState } from "react";

const ChatCard = ({ chat, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50">
      <div>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 mr-3 dark:bg-gray-600 dark:text-gray-200">
            {chat.alias?.charAt(0)?.toUpperCase() || "🚫"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {chat.alias}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(chat.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md dark:bg-gray-700/50 dark:text-gray-300">
          "{chat.message}"
        </p>
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={() => onDelete(chat._id)}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-medium transition-colors dark:bg-red-900/40 dark:hover:bg-red-900/70 dark:text-red-300"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default function ChatManagementTab({ chats, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <label
            htmlFor="chat-search"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            Cari Pesan atau User
          </label>
          <input
            id="chat-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {filteredChats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChats.map((chat) => (
            <ChatCard key={chat._id} chat={chat} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada pesan yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
