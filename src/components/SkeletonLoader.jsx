import React from "react";

const SkeletonLoader = ({ className }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    ></div>
  );
};

export default SkeletonLoader;
