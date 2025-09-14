import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getReports, getReportStats } from "../services/reportService";
import { takeAction as resolveReportAction } from "../services/adminService";
import { socket } from "../socket";

export default function AdminReports() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(
    async (isInitialLoad = false) => {
      if (!user?.token) return;
      if (isInitialLoad) setLoading(true);
      try {
        const [reportsRes, statsRes] = await Promise.all([
          getReports(user.token),
          getReportStats(user.token),
        ]);
        setReports(reportsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(
          "Error fetching reports:",
          err.response?.data || err.message
        );
      } finally {
        if (isInitialLoad) setLoading(false);
      }
    },
    [user?.token]
  );

  useEffect(() => {
    const handleReportsChange = () => {
      fetchData(false);
    };
    socket.on("adminReportsChanged", handleReportsChange);
    return () => {
      socket.off("adminReportsChanged", handleReportsChange);
    };
  }, [fetchData]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const takeAction = async (reportId, userId, action) => {
    const actionText = {
      warn: "memberi peringatan",
      mute: "mute selama 24 jam",
      ban: "ban permanen",
    };
    if (
      window.confirm(
        `Yakin ingin ${actionText[action]} pada user ini? Laporan akan ditandai selesai.`
      )
    ) {
      setActionLoading(reportId + action);
      try {
        const res = await resolveReportAction(
          userId,
          action,
          reportId,
          user.token
        );
        alert(res.data.msg);
      } catch (err) {
        alert(
          "Gagal ambil tindakan: " + (err.response?.data?.msg || err.message)
        );
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredReports = reports.filter((r) => r.status === activeTab);
  const categoryIcons = {
    toxic: "🤬",
    sara: "⚡",
    pornografi: "🔞",
    spam: "📢",
    scam: "🎣",
    lainnya: "📝",
  };
  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-600/50",
    actionTaken:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-600/50",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola laporan dari users dan ambil tindakan yang diperlukan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                Total Reports
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                Pending
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white p-5 shadow-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                Action Taken
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.actionTaken}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "pending"
                    ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                ⏳ Pending ({stats?.pending || 0})
              </button>
              <button
                onClick={() => setActiveTab("actionTaken")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "actionTaken"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                ✅ Action Taken ({stats?.actionTaken || 0})
              </button>
            </nav>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center dark:bg-gray-800 dark:border-gray-700">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                Tidak ada laporan di tab {activeTab}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Semua laporan sudah ditangani dengan baik!
              </p>
            </div>
          ) : (
            filteredReports.map((r) => {
              const isItemLoading =
                actionLoading === r._id + "warn" ||
                actionLoading === r._id + "mute" ||
                actionLoading === r._id + "ban";
              return (
                <div
                  key={r._id}
                  className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">
                          {categoryIcons[r.reasonCategory] || "📝"}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 capitalize dark:text-white">
                            {r.reasonCategory}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              Reporter:{" "}
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {r.reporterId?.alias || "[User Dihapus]"}
                              </span>
                            </span>
                            <span>•</span>
                            <span>
                              Reported:{" "}
                              <span className="font-medium text-red-600 dark:text-red-400">
                                {r.reportedId?.alias || "[User Dihapus]"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 dark:bg-gray-700/50">
                        <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                          Pesan yang dilaporkan:
                        </p>
                        <p className="text-sm text-gray-900 italic dark:text-gray-100">
                          "{r.messageText || "(Pesan tidak ditemukan)"}"
                        </p>
                      </div>
                      {r.reason && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                            Alasan laporan:
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {r.reason}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                            statusColors[r.status]
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>

                    {activeTab === "pending" && (
                      <div className="flex flex-col space-y-2 w-40">
                        <button
                          onClick={() =>
                            takeAction(r._id, r.reportedId?._id, "warn")
                          }
                          disabled={isItemLoading || !r.reportedId}
                          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md transition-colors disabled:bg-gray-400"
                        >
                          {actionLoading === r._id + "warn"
                            ? "..."
                            : "⚠ Warn User"}
                        </button>
                        <button
                          onClick={() =>
                            takeAction(r._id, r.reportedId?._id, "mute")
                          }
                          disabled={isItemLoading || !r.reportedId}
                          className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-md transition-colors disabled:bg-gray-400"
                        >
                          {actionLoading === r._id + "mute"
                            ? "..."
                            : "🔇 Mute 24h"}
                        </button>
                        <button
                          onClick={() =>
                            takeAction(r._id, r.reportedId?._id, "ban")
                          }
                          disabled={isItemLoading || !r.reportedId}
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors disabled:bg-gray-400"
                        >
                          {actionLoading === r._id + "ban"
                            ? "..."
                            : "🚫 Ban User"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Dilaporkan pada: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
