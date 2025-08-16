import React from "react";

interface SimpleStatCardProps {
  value: number;
  title: string;
  description: string;
}

const SimpleStatCard: React.FC<SimpleStatCardProps> = ({
  value,
  title,
  description,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">{value}</h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-2">
          {title}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-4">{description}</p>
    </div>
  );
};

export default SimpleStatCard;
