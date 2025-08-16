import MarketingAnalyticsCard from "./MarketingAnalyticsCard";

interface AnalyticsData {
  date: string;
  viewers: number;
  lastActivity: string;
}

interface Card {
  name: string;
  total: number;
  description?: string;
}

interface SectionProps {
  title: string;
  cards: Card[];
  isFlex?: boolean;
  children?: React.ReactNode;
  data: AnalyticsData[]; // Added to receive sharedData from MarketingTab
}

const Section: React.FC<SectionProps> = ({
  title,
  cards,
  isFlex = false,
  children,
  data,
}) => (
  <div className="my-8 space-y-6">
    <h2 className="text-lg font-semibold text-black mb-2 p-4">{title}</h2>
    {children}
    <div className={isFlex ? "flex flex-col gap-3" : "grid grid-cols-2 gap-3"}>
      {cards.map((card, index) => (
        <MarketingAnalyticsCard
          key={`${card.name}-${index}`}
          name={card.name}
          total={card.total}
          data={data} // Pass the sharedData directly
          description={card.description}
        />
      ))}
    </div>
  </div>
);

export default Section;
