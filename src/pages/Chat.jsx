import ChatBox from "../components/ChatBox";
import { CustomAdSlot, AdSenseSlot } from "../components/AdSlots";
import { useState, useEffect, useContext, useCallback } from "react";
import { getAds } from "../services/adService";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";
import { getGeneralStats } from "../services/analyticsService";
import SkeletonLoader from "../components/SkeletonLoader"; // Impor komponen skeleton

// Komponen Skeleton untuk Halaman Chat
const ChatPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="bg-white/80 dark:bg-gray-800/80 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SkeletonLoader className="w-12 h-12 rounded-xl" />
            <div>
              <SkeletonLoader className="h-7 w-40" />
              <SkeletonLoader className="h-4 w-56 mt-1" />
            </div>
          </div>
          <SkeletonLoader className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Sidebar Skeleton */}
        <aside className="hidden lg:block w-1/5 space-y-6">
          <SkeletonLoader className="h-48 rounded-2xl" />
          <SkeletonLoader className="h-32 rounded-2xl" />
        </aside>
        {/* Main Chat Skeleton */}
        <main className="w-full lg:w-3/5">
          <SkeletonLoader className="h-[70vh] rounded-2xl" />
        </main>
        {/* Right Sidebar Skeleton */}
        <aside className="hidden lg:block w-1/5 space-y-6">
          <SkeletonLoader className="h-48 rounded-2xl" />
          <SkeletonLoader className="h-32 rounded-2xl" />
        </aside>
      </div>
    </div>
  </div>
);

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    try {
      const [adsRes, statsRes] = await Promise.all([
        getAds(user.token),
        getGeneralStats(user.token),
      ]);
      setAds(adsRes.data.filter((ad) => ad.isActive));
      setTotalMembers(statsRes.data.totalUsers);
      setTotalMessages(statsRes.data.totalChats);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchData();

    const handleAdsUpdate = () =>
      getAds(user.token).then((res) =>
        setAds(res.data.filter((ad) => ad.isActive))
      );
    const handleStatsUpdate = (stats) => {
      setOnlineCount(stats.onlineCount);
      setTotalMembers(stats.totalUsers);
      setTotalMessages(stats.totalMessages);
    };

    socket.on("adsUpdated", handleAdsUpdate);
    socket.on("updateChatStats", handleStatsUpdate);

    return () => {
      socket.off("adsUpdated", handleAdsUpdate);
      socket.off("updateChatStats", handleStatsUpdate);
    };
  }, [user, fetchData]);

  const adsenseAds = ads.filter((ad) => ad.type === "adsense").slice(0, 3);
  const customAds = ads.filter((ad) => ad.type === "custom").slice(0, 3);

  if (loading) {
    return <ChatPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.963 9.963 0 01-5.63-1.72c-.054-.037-.115-.054-.178-.044l-2.31.34a1 1 0 01-1.05-1.05l.34-2.31c.01-.063-.007-.124-.044-.178A9.963 9.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Forum Chat
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Diskusi terbuka untuk semua member
                </p>
              </div>
            </div>

            {/* Online Status */}
            <div className="flex items-center space-x-2 lg:space-x-3 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full border border-green-200 dark:border-green-500/30">
              <div className="relative">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs lg:text-sm font-medium text-green-700 dark:text-green-300">
                {onlineCount > 0 ? `${onlineCount} Online` : "Live Chat"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Info Cards */}
      <div className="lg:hidden bg-white/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {/* Quick Rules */}
            <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Aturan Forum
                </h4>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Gunakan bahasa sopan, no spam/SARA
              </p>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-3 min-w-[150px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                  Statistik
                </h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Member:
                  </span>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    {totalMembers}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Pesan:
                  </span>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    {totalMessages}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-lg p-3 min-w-[180px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.674M12 3v1m-4.663 2h-4.674M12 21v-1m4.663-2h4.674M3.337 13h4.674M21 11.5a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0zM12 9a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Tips Chat
                </h4>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                @username, klik reply
              </p>
            </div>

            {/* Support */}
            <div className="flex-shrink-0 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg p-3 min-w-[160px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.465 9.58 5 8 5c-3.197 0-6 2.028-6 4.5S4.803 14 8 14c1.58 0 2.832-.465 4-.465v.465a6.002 6.002 0 004 5.564V18c1.58 0 2.832-.465 4-.465s-1.252-.465-2.615-.465a1.5 1.5 0 01-.465-.465c0-.853 1.252-.465 2.615-.465a1.5 1.5 0 001.215-2.062 6.002 6.002 0 00-4-5.564zM12 6.253a6.002 6.002 0 004-5.564z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Dukung Kami
                </h4>
              </div>
              <a
                href="https://saweria.co/nama_anda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md transition-colors"
              >
                Donasi
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-1/5 space-y-6">
            {/* Rules Card */}
            <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-blue-200/50 dark:bg-gray-800/70 dark:border-blue-500/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Aturan Forum
                  </h3>
                  <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Gunakan bahasa yang sopan dan santun</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Dilarang spam, iklan, dan konten SARA</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Gunakan tombol Report untuk melaporkan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-purple-200/50 dark:bg-gray-800/70 dark:border-purple-500/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.674M12 3v1m-4.663 2h-4.674M12 21v-1m4.663-2h4.674M3.337 13h4.674M21 11.5a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0zM12 9a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                    Tips Chat
                  </h3>
                  <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                    <p>• Gunakan @username untuk mention</p>
                    <p>• Klik pesan untuk reply</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AdSense Ads */}
            {adsenseAds.map((ad) => (
              <div
                key={ad._id}
                className="transition-all duration-300 hover:scale-105"
              >
                <AdSenseSlot ad={ad} />
              </div>
            ))}
          </aside>

          {/* Main Chat Area */}
          <main className="w-full lg:w-3/5">
            <div className="bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl lg:rounded-3xl border border-gray-200/50 dark:bg-gray-800/70 dark:border-gray-700/50 overflow-hidden">
              <ChatBox />
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-1/5 space-y-6">
            {/* Support Card */}
            <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-emerald-200/50 dark:bg-gray-800/70 dark:border-emerald-500/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Dukung Forum Ini
                  </h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                    Bantu kami menutupi biaya server dan pengembangan fitur
                    baru.
                  </p>
                  <a
                    href="https://saweria.co/nama_anda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Donasi Sekarang</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-indigo-200/50 dark:bg-gray-800/70 dark:border-indigo-500/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                    Statistik Forum
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700 dark:text-indigo-300">
                        Total Member
                      </span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-100">
                        {totalMembers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700 dark:text-indigo-300">
                        Total Pesan
                      </span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-100">
                        {totalMessages}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Ads */}
            {customAds.map((ad) => (
              <div
                key={ad._id}
                className="transition-all duration-300 hover:scale-105"
              >
                <CustomAdSlot ad={ad} />
              </div>
            ))}
          </aside>
        </div>

        {/* Mobile Bottom Ads */}
        <div className="lg:hidden mt-4 space-y-4">
          {customAds.slice(0, 2).map((ad) => (
            <div key={ad._id} className="transition-all duration-300">
              <CustomAdSlot ad={ad} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
