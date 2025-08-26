import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";

interface credentialDesignCardProps {
  category: string;
  date: string;
  time: string;
}

export default function CredentialDesignCard({
  category,
  date,
  time,
}: credentialDesignCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 w-[320px] flex flex-col overflow-hidden hover:scale-102 transition-all duration-300">
      {/* Image Placeholder */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full h-40 bg-white border rounded-lg" />
      </div>
      {/* Card Footer */}
      <div className="bg-[#f5f5f5] p-6 border-t border-gray-100 flex flex-col gap-2">
        <div className="text-lg font-semibold text-gray-800">{category}</div>
        <div className="text-sm text-gray-600 mb-4">
          {date} - {time}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 transition">
            <Eye className="w-5 h-5" />
          </Button>
          <Button className="flex-1 rounded-md py-2 flex items-center justify-center text-white bg-teal-700 hover:bg-teal-800 transition">
            <Check className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
