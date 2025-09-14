import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getChatActivityByHour,
  getMostActiveUsers,
} from "../services/analyticsService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = ({ activityData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#9ca3af" } },
      title: {
        display: true,
        text: "Aktivitas Chat per Jam (WIB)",
        color: "#e5e7eb",
      },
    },
    scales: {
      x: { ticks: { color: "#9ca3af" } },
      y: { ticks: { color: "#9ca3af" } },
    },
  };
  const data = {
    labels: activityData.labels,
    datasets: [
      {
        label: "Jumlah Pesan",
        data: activityData.data,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default function AdminAnalytics() {
  const { user } = useContext(AuthContext);
  const [activityData, setActivityData] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        const [activityRes, activeUsersRes] = await Promise.all([
          getChatActivityByHour(user.token),
          getMostActiveUsers(user.token),
        ]);
        setActivityData(activityRes.data);
        setActiveUsers(activeUsersRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Wawasan dari aktivitas forum
          </p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {activityData ? (
            <ActivityChart activityData={activityData} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            🏆 Top 5 User Paling Aktif
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeUsers.map((u, index) => (
              <li
                key={u.alias}
                className="py-3 flex justify-between items-center"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {index + 1}. {u.alias}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {u.count} pesan
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
