import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import MarketingGraph from "./MarketingGraph";

interface GraphDataPoint {
  date: string;
  viewers: number;
}

interface MarketingAnalyticsCardProps {
  name: string;
  total: number | string;
  data: GraphDataPoint[];
  description?: string;
}

export default function MarketingAnalyticsCard({
  name,
  total,
  data,
  description,
}: MarketingAnalyticsCardProps) {
  return (
    <div className="p-4">
      <p className="text-sm font-bold text-black mb-4 flex items-center gap-1">
        {name}: Total {total}
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 cursor-pointer text-black" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black text-white text-sm px-3 py-2 rounded max-w-[250px]"
              >
                {description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </p>
      <MarketingGraph data={data} />
    </div>
  );
}
