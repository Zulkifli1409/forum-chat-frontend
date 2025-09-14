import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAnnouncements,
  createAnnouncement,
  broadcastAnnouncement,
  deleteAnnouncement,
} from "../services/announcementService";

export default function AnnouncementManagementTab() {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(true);

  // ▼▼▼ BUNGKUS FUNGSI INI DENGAN useCallback ▼▼▼
  const fetchAnnouncements = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getAnnouncements(user.token);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]); // Tambahkan user.token sebagai dependensi

  // ▼▼▼ TAMBAHKAN fetchAnnouncements KE DEPENDENCY ARRAY ▼▼▼
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await createAnnouncement({ message: newMessage, duration }, user.token);
      setNewMessage("");
      setDuration(10);
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to create announcement.");
    }
  };

  const handleBroadcast = async (id) => {
    try {
      await broadcastAnnouncement(id, user.token);
    } catch (err) {
      alert("Gagal menyiarkan pengumuman.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengumuman ini?")) {
      try {
        await deleteAnnouncement(id, user.token);
        fetchAnnouncements();
      } catch (err) {
        alert("Failed to delete announcement.");
      }
    }
  };

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">
        Announcement Management
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-medium mb-4 dark:text-white">
          Buat Pengumuman Baru
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tulis pesan pengumuman..."
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="3"
                className="w-24 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                detik
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buat
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-medium mb-4 dark:text-white">
          Daftar Pengumuman
        </h3>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada pengumuman.
            </p>
          ) : (
            announcements.map((item) => (
              <div
                key={item._id}
                className="p-4 border rounded-md flex justify-between items-center dark:border-gray-700"
              >
                <div>
                  <p className="dark:text-white">{item.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Durasi: {item.duration} detik
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBroadcast(item._id)}
                    className="px-3 py-1 rounded-md text-sm text-white bg-green-500 hover:bg-green-600"
                  >
                    Siarkan
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
