import { useState, useEffect, useContext } from "react";
import { socket } from "../socket";
import { AuthContext } from "../context/AuthContext";

export default function AnnouncementBanner() {
  const { user } = useContext(AuthContext);
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ▼▼▼ Tambahkan useEffect baru untuk timer ▼▼▼
  useEffect(() => {
    if (isVisible && announcement?.duration) {
      const durationInMs = announcement.duration * 1000;
      const timer = setTimeout(() => {
        handleClose();
      }, durationInMs);

      // Cleanup timer jika komponen di-unmount atau isVisible berubah
      return () => clearTimeout(timer);
    }
  }, [isVisible, announcement]);

  useEffect(() => {
    if (!user) {
      socket.off("newAnnouncement");
      socket.off("clearAnnouncement");
      setIsVisible(false);
      setAnnouncement(null);
      return;
    }

    const handleNewAnnouncement = (newAnn) => {
      setAnnouncement(newAnn);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    };

    const handleClearAnnouncement = () => {
      handleClose();
    };

    socket.on("newAnnouncement", handleNewAnnouncement);
    socket.on("clearAnnouncement", handleClearAnnouncement);

    return () => {
      socket.off("newAnnouncement", handleNewAnnouncement);
      socket.off("clearAnnouncement", handleClearAnnouncement);
    };
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    setIsAnimating(true);
    setTimeout(() => {
      setAnnouncement(null);
      setIsAnimating(false);
    }, 300);
  };

  if (!announcement && !isAnimating) {
    return null;
  }

  // Ambil durasi, default 10 detik jika tidak ada
  const duration = announcement?.duration || 10;

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 
        max-w-sm w-11/12 z-50 
        transform transition-all duration-300 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
      `}
    >
      <div
        className="
          bg-gradient-to-r from-blue-500 to-purple-600
          text-white 
          p-4 rounded-xl shadow-lg
          flex items-start gap-3 relative
          backdrop-blur-sm
          border border-white/20
          hover:shadow-xl transition-shadow duration-200
        "
      >
        <div className="flex-shrink-0 mt-0.5">
          <div className="bg-white/20 rounded-full p-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592L6 17H3a2 2 0 01-2-2V7a2 2 0 012-2h3l2.232-4.009a1.76 1.76 0 013.417.592zM19 11a7 7 0 01-7 7m7-7a7 7 0 00-7-7m7 7h-2"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 text-white">Pengumuman</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {announcement?.message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="
            flex-shrink-0 ml-2
            text-white/70 hover:text-white
            hover:bg-white/20 
            rounded-full p-1.5 transition-all duration-200
            group
          "
        >
          <svg
            className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-200"
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

      {/* ▼▼▼ Progress bar yang dinamis ▼▼▼ */}
      <div className="w-full h-1 bg-white/20 rounded-b-xl overflow-hidden">
        <div
          key={announcement?._id} // 'key' untuk mereset animasi
          className="h-full bg-white/40"
          style={{
            animation: isVisible
              ? `progress ${duration}s linear forwards`
              : "none",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
