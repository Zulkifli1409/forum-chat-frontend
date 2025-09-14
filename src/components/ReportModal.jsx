import { useState } from "react";
import { submitReport as submitReportService } from "../services/reportService";

export default function ReportModal({
  show,
  onClose,
  messageId,
  reportedId,
  token,
}) {
  const [category, setCategory] = useState("toxic");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    // ... (fungsi logic tidak berubah)
    setIsSubmitting(true);
    try {
      await submitReportService(
        { messageId, reportedId, reasonCategory: category, reason },
        token
      );
      alert("Report berhasil dikirim!");
      onClose();
    } catch (error) {
      alert("Gagal mengirim report. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;
  const reportCategories = [
    // ... (array kategori tidak berubah)
    {
      value: "toxic",
      label: "🤬 Toxic / Kasar",
      desc: "Kata-kata kasar atau menyinggung",
    },
    {
      value: "sara",
      label: "⚡ SARA",
      desc: "Suku, Agama, Ras, Antar golongan",
    },
    {
      value: "pornografi",
      label: "🔞 Pornografi",
      desc: "Konten dewasa atau tidak pantas",
    },
    {
      value: "spam",
      label: "📢 Spam",
      desc: "Pesan berulang atau promosi berlebihan",
    },
    {
      value: "scam",
      label: "🎣 Phishing / Scam",
      desc: "Penipuan atau phishing",
    },
    {
      value: "lainnya",
      label: "📝 Lainnya",
      desc: "Alasan lain yang tidak terdaftar",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-y-auto dark:bg-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            🚨 Report Message
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-6 h-6"
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

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Kategori Laporan
            </label>
            <div className="space-y-2">
              {reportCategories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                    category === cat.value
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-500/70"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {cat.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Penjelasan Tambahan (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan lebih detail..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg ... dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ... dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSubmitReport}
            disabled={isSubmitting}
            className={`... (kelas sama seperti sebelumnya)`}
          >
            {isSubmitting ? "Mengirim..." : "Kirim Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
