import React from "react";
import { Certificate } from "@/lib/mock/mockCertificates";
import CertificateCard from "./CertificateCard";

interface SidebarPanelProps {
  feature: "templates" | "elements" | "settings";
  certificates?: Certificate[];
  selectedCertificate?: Certificate;
  onSelectCertificate?: (certificate: Certificate) => void;
  onCreateBlankCertificate?: () => void;
  children?: React.ReactNode;
}

const BlankCertificateCard: React.FC<{
  onSelect: () => void;
  isSelected?: boolean;
}> = ({ onSelect, isSelected = false }) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-xs font-medium">Create New</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  feature = "templates",
  certificates = [],
  selectedCertificate,
  onSelectCertificate,
  onCreateBlankCertificate,
  children,
}) => {
  const groupIntoPairs = (items: any[]) => {
    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push(items.slice(i, i + 2));
    }
    return pairs;
  };

  const renderContent = () => {
    switch (feature) {
      case "templates":
        const allItems = [
          { type: "blank", id: "blank" },
          ...certificates.map((cert) => ({ type: "certificate", data: cert })),
        ];

        const pairs = groupIntoPairs(allItems);

        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Certificate Templates
            </h2>
            <div className="space-y-4">
              {pairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="grid grid-cols-2 gap-3">
                  {pair.map((item, itemIndex) => {
                    if (item.type === "blank") {
                      return (
                        <BlankCertificateCard
                          key="blank"
                          onSelect={onCreateBlankCertificate ?? (() => {})}
                          isSelected={selectedCertificate == null}
                        />
                      );
                    } else {
                      return (
                        <CertificateCard
                          key={item.data.id}
                          certificate={item.data}
                          isSelected={selectedCertificate?.id === item.data.id}
                          onSelect={onSelectCertificate ?? (() => {})}
                        />
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          </>
        );
      case "elements":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Elements
            </h2>
            <div className="space-y-2">
              <p>Element management coming soon</p>
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Settings
            </h2>
            <div className="space-y-2">
              <p>Settings panel coming soon</p>
            </div>
          </>
        );
      default:
        return children;
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default SidebarPanel;
