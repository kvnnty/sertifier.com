import { format } from "date-fns";

interface EventCardProps {
  eventName: string;
  explanation: string;
  timestamp: string;
}

export default function EventCard({ eventName, explanation, timestamp }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{eventName}</h3>
      <p className="text-sm text-gray-600 mt-2">{explanation}</p>
      <p className="text-xs text-gray-500 mt-2">
        {format(new Date(timestamp), "PPP 'at' p")}
      </p>
    </div>
  );
}