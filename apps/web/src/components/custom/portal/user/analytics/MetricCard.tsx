    import React from "react";

interface MetricCardProps {
  title: string;
  value: number;
  percentage: number;
  averagePercentage: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentage,
  averagePercentage,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="black"
          >
            <circle cx="10" cy="10" r="8" fill="black" />
            <text
              x="10"
              y="14"
              fontFamily="Arial"
              fontSize="12"
              fill="white"
              textAnchor="middle"
            >
              ?
            </text>
          </svg>
        </button>
      </div>

      {/* Underline */}
      <div className="w-full h-px bg-gray-200 mb-4"></div>

      {/* Total value below the underline */}
      <div className="mb-6">
        <p className="text-xl font-bold text-gray-900">TOTAL {value}</p>
      </div>
      {/* Circle and average text */}
      <div className="flex items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#e6e6e6"
              strokeWidth="2"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#48bb78"
              strokeWidth="2"
              strokeDasharray="100 100"
              strokeDashoffset={100 - percentage}
              transform="rotate(-90 18 18)"
            ></circle>
            <text
              x="18"
              y="20"
              textAnchor="middle"
              fill="#000"
              fontSize="8"
              fontWeight="bold"
            >
              {percentage}%
            </text>
          </svg>
        </div>
        <div className="flex-1 ml-4">
          <p className="text-sm text-gray-600">
            Organizations like yours
            <br />
            average{" "}
            <span className="font-medium text-green-600">
              {averagePercentage}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
