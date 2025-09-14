import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAuditLogs } from "../services/adminService";

const LogItem = ({ log }) => {
  const actionColors = {
    DELETE_USER: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    REJECT_USER: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    CHANGE_ROLE:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    DELETE_CHAT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    ACTION_WARN:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    ACTION_MUTE:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    ACTION_BAN: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start space-x-4 dark:bg-gray-800 dark:border-gray-700">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          actionColors[log.action] || "bg-gray-100"
        }`}
      >
        📝
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-bold">{log.adminAlias}</span>
          <span className="text-gray-500 dark:text-gray-400">
            {" "}
            melakukan aksi{" "}
          </span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-md text-xs ${
              actionColors[log.action] || "bg-gray-100"
            }`}
          >
            {log.action}
          </span>
        </p>
        {log.targetUserAlias && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Target: <span className="font-medium">{log.targetUserAlias}</span>
          </p>
        )}
        {log.details && (
          <p className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded dark:bg-gray-700/50 dark:text-gray-400 break-words">
            {log.details}
          </p>
        )}
      </div>
      <div className="text-xs text-gray-400 flex-shrink-0 text-right">
        {new Date(log.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default function AuditLogTab() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State baru untuk paginasi
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const limit = 25; // Anda bisa sesuaikan jumlah item per halaman

  const fetchLogs = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getAuditLogs(user.token, page, limit);
      setLogs(res.data.logs);
      setTotalLogs(res.data.total);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  }, [user, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Fungsi untuk render kontrol paginasi
  const renderPagination = () => {
    const totalPages = Math.ceil(totalLogs / limit);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading logs...</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Audit Log
        </h3>
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs found.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <LogItem key={log._id} log={log} />
            ))}
          </div>
        )}
      </div>
      {renderPagination()}
    </div>
  );
}
