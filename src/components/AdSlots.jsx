import { useEffect } from "react";

// Komponen untuk Iklan Kustom / Sponsor
export const CustomAdSlot = ({ ad }) => {
  if (!ad) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 mb-2">
        Sponsor Kami
      </h3>
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {ad.imageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {ad.title}
          </span>
        )}
      </a>
    </div>
  );
};

// Komponen untuk Google AdSense
export const AdSenseSlot = ({ ad }) => {
  useEffect(() => {
    if (ad?.adsenseCode) {
      try {
        const script = document.createElement("script");
        script.innerHTML = ad.adsenseCode;
        document.head.appendChild(script);
        return () => {
          document.head.removeChild(script);
        };
      } catch (e) {
        console.error("AdSense script error:", e);
      }
    }
  }, [ad]);

  if (!ad) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 mb-2">
        Advertisement
      </h3>
      <div dangerouslySetInnerHTML={{ __html: ad.adsenseCode }} />
    </div>
  );
};
