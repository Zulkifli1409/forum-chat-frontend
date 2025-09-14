import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAds, createAd, updateAd, deleteAd } from "../services/adService";

export default function AdManagementTab() {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAd, setNewAd] = useState({
    title: "",
    type: "custom",
    imageUrl: "",
    linkUrl: "",
    adsenseCode: "",
  });

  const fetchAds = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getAds(user.token);
      setAds(res.data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAd(newAd, user.token);
      setNewAd({
        title: "",
        type: "custom",
        imageUrl: "",
        linkUrl: "",
        adsenseCode: "",
      });
      fetchAds();
    } catch (err) {
      alert("Failed to create ad: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateAd(id, data, user.token);
      fetchAds();
    } catch (err) {
      alert("Failed to update ad: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await deleteAd(id, user.token);
        fetchAds();
      } catch (err) {
        alert(
          "Failed to delete ad: " + (err.response?.data?.msg || err.message)
        );
      }
    }
  };

  if (loading) return <div>Loading ads...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Ad Management</h2>

      {/* Form untuk Tambah Iklan Baru */}
      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-medium mb-4 dark:text-white">Add New Ad</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={newAd.title}
              onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Type
            </label>
            <select
              value={newAd.type}
              onChange={(e) => setNewAd({ ...newAd, type: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="custom">Custom Ad</option>
              <option value="adsense">AdSense Code</option>
            </select>
          </div>
          {newAd.type === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newAd.imageUrl}
                  onChange={(e) =>
                    setNewAd({ ...newAd, imageUrl: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300">
                  Link URL
                </label>
                <input
                  type="text"
                  value={newAd.linkUrl}
                  onChange={(e) =>
                    setNewAd({ ...newAd, linkUrl: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}
          {newAd.type === "adsense" && (
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">
                AdSense Code
              </label>
              <textarea
                rows="3"
                value={newAd.adsenseCode}
                onChange={(e) =>
                  setNewAd({ ...newAd, adsenseCode: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Ad
          </button>
        </form>
      </div>

      {/* Daftar Iklan */}
      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-medium mb-4 dark:text-white">Active Ads</h3>
        <ul className="space-y-4">
          {ads.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No ads found.</p>
          ) : (
            ads.map((ad) => (
              <li
                key={ad._id}
                className="p-4 border rounded-md flex justify-between items-center dark:border-gray-700"
              >
                <div>
                  <h4 className="font-semibold dark:text-white">{ad.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type: {ad.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Status: {ad.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdate(ad._id, { isActive: !ad.isActive })
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      ad.isActive
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {ad.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
