"use client";

import { useState } from "react";

export default function TopBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-end px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-6">
        {/* Status Box */}
        <div className="flex items-center bg-orange-50 rounded-md px-4 py-2 gap-3">
          <span className="text-orange-400">
            {/* Clock Icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-sm font-medium text-gray-800">
            5 Recipients Remaining
          </span>
          <button className="ml-2 bg-orange-300 hover:bg-orange-400 text-white font-semibold px-4 py-1 rounded transition text-sm">
            Upgrade
          </button>
        </div>
        {/* Notification Bell */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* Help Icon */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16h.01M12 12a4 4 0 10-4-4" />
          </svg>
        </button>
        {/* User Initial */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-800">
          M
        </div>
        {/* Organization Name and Dropdown */}
        <span className="text-base font-medium text-gray-800">
          My Organization
        </span>
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </header>
  );
}
