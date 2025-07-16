import React, { useState, useRef } from "react";
import { Certificate } from "@/lib/mock/mockCertificates";
import CertificateCard from "./CertificateCard";
import ColorPicker from "./ColorPicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  CheckSquare,
  MoreVertical,
  Square,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define certificate size and orientation types
export type CertificateSize =
  | "A4 Landscape"
  | "A4 Portrait"
  | "Letter Landscape"
  | "Letter Portrait"
  | "16:9"
  | "Legal Landscape"
  | "Legal Portrait";

export interface CertificateSizeConfig {
  name: CertificateSize;
  width: number;
  height: number;
}

// Certificate size configurations with dimensions in pixels
export const CERTIFICATE_SIZES: Record<CertificateSize, CertificateSizeConfig> =
  {
    "A4 Landscape": { name: "A4 Landscape", width: 1123, height: 794 }, // 297mm x 210mm at 96 DPI
    "A4 Portrait": { name: "A4 Portrait", width: 794, height: 1123 }, // 210mm x 297mm at 96 DPI
    "Letter Landscape": { name: "Letter Landscape", width: 1056, height: 816 }, // 11in x 8.5in at 96 DPI
    "Letter Portrait": { name: "Letter Portrait", width: 816, height: 1056 }, // 8.5in x 11in at 96 DPI
    "16:9": { name: "16:9", width: 1280, height: 720 }, // Common presentation format
    "Legal Landscape": { name: "Legal Landscape", width: 1344, height: 816 }, // 14in x 8.5in at 96 DPI
    "Legal Portrait": { name: "Legal Portrait", width: 816, height: 1344 }, // 8.5in x 14in at 96 DPI
  };

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  timestamp: number;
}

interface SidebarPanelProps {
  feature: "templates" | "elements" | "settings" | "colorPicker";
  certificates?: Certificate[];
  selectedCertificate?: Certificate;
  onSelectCertificate?: (certificate: Certificate) => void;
  onCreateBlankCertificate?: () => void;
  certificateSize?: CertificateSize;
  onCertificateSizeChange?: (size: CertificateSize) => void;
  uploadedImages?: UploadedImage[];
  onImageUpload?: (file: File) => void;
  onSelectUploadedImage?: (image: UploadedImage) => void;
  onDeleteImage?: (imageId: string) => void; // Added prop for deleting images
  // Color picker props
  currentColor?: string;
  onColorChange?: (color: string) => void;
  onCloseColorPicker?: () => void;
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
          ? "border-[#086956] bg-[#065344] shadow-lg"
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
        <div className="absolute top-2 right-2 bg-[#086956] text-white rounded-full w-6 h-6 flex items-center justify-center">
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

const SizeOptionItem: React.FC<{
  size: CertificateSize;
  isLandscape: boolean;
}> = ({ size, isLandscape }) => {
  const IconComponent = isLandscape ? CheckSquare : Square;

  return (
    <div className="flex items-center gap-2">
      <IconComponent className="h-4 w-4" />
      <span>{size}</span>
    </div>
  );
};

const UploadedImageCard: React.FC<{
  image: UploadedImage;
  onSelect: () => void;
  isSelected?: boolean;
  onRemove?: () => void;
}> = ({ image, onSelect, isSelected = false, onRemove }) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? "border-[#086956] bg-[#065344] shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#086956] text-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-gray-100"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove();
              }}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  feature = "templates",
  certificates = [],
  selectedCertificate,
  onSelectCertificate,
  onCreateBlankCertificate,
  certificateSize = "A4 Landscape",
  onCertificateSizeChange = () => {},
  uploadedImages = [],
  onImageUpload = () => {},
  onSelectUploadedImage = () => {},
  onDeleteImage = () => {},
  // Color picker props
  currentColor = "#000000",
  onColorChange = () => {},
  onCloseColorPicker = () => {},
  children,
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "uploads">("library");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupIntoPairs = (items: any[]) => {
    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push(items.slice(i, i + 2));
    }
    return pairs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(files[0]);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderTemplatesTab = () => {
    const allItems = [
      { type: "blank", id: "blank" },
      ...certificates.map((cert) => ({ type: "certificate", data: cert })),
    ];

    const pairs = groupIntoPairs(allItems);

    return (
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
    );
  };

  const renderUploadsTab = () => {
    const uploadedPairs = groupIntoPairs(uploadedImages);

    const handleDeleteImage = (imageId: string) => {
      onDeleteImage(imageId);
    };

    return (
      <div className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-1 border-[1.5px]  border-black rounded-sm text-gray-600"
          >
            <Upload size={18} />
            <span>Upload Design</span>
          </button>
        </div>

        {uploadedImages.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-gray-700 mt-6 mb-2">
              UPLOADED
            </h3>
            {uploadedPairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="grid grid-cols-2 gap-3">
                {pair.map((image) => (
                  <UploadedImageCard
                    key={image.id}
                    image={image}
                    isSelected={
                      selectedCertificate?.backgroundImage === image.url
                    }
                    onSelect={() => onSelectUploadedImage(image)}
                    onRemove={() => handleDeleteImage(image.id)}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (feature) {
      case "colorPicker":
        return (
          <div className="relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 px-6">
                NEW COLOR
              </h2>
              <button
                onClick={onCloseColorPicker}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close color picker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ColorPicker
              currentColor={currentColor}
              onColorChange={onColorChange}
              onClose={onCloseColorPicker}
            />
          </div>
        );
      case "templates":
        return (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Certificate Templates
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload your own certificate design or select from Sertifier's
              certificate templates.
            </p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Certificate Design Size & Orientation
              </h3>
              <Select
                value={certificateSize}
                onValueChange={(value) =>
                  onCertificateSizeChange(value as CertificateSize)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="A4 Landscape">
                      <SizeOptionItem size="A4 Landscape" isLandscape={true} />
                    </SelectItem>
                    <SelectItem value="A4 Portrait">
                      <SizeOptionItem size="A4 Portrait" isLandscape={false} />
                    </SelectItem>
                    <SelectItem value="Letter Landscape">
                      <SizeOptionItem
                        size="Letter Landscape"
                        isLandscape={true}
                      />
                    </SelectItem>
                    <SelectItem value="Letter Portrait">
                      <SizeOptionItem
                        size="Letter Portrait"
                        isLandscape={false}
                      />
                    </SelectItem>
                    <SelectItem value="16:9">
                      <SizeOptionItem size="16:9" isLandscape={true} />
                    </SelectItem>
                    <SelectItem value="Legal Landscape">
                      <SizeOptionItem
                        size="Legal Landscape"
                        isLandscape={true}
                      />
                    </SelectItem>
                    <SelectItem value="Legal Portrait">
                      <SizeOptionItem
                        size="Legal Portrait"
                        isLandscape={false}
                      />
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Tabs
              defaultValue="library"
              className="w-full my-3"
              onValueChange={(value) =>
                setActiveTab(value as "library" | "uploads")
              }
            >
              <TabsList className="w-full grid grid-cols-2 mb-7">
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="uploads">Uploads</TabsTrigger>
              </TabsList>
              <hr className=" border-[#086956] mb-5" />
              <TabsContent value="library">{renderTemplatesTab()}</TabsContent>
              <TabsContent value="uploads">{renderUploadsTab()}</TabsContent>
            </Tabs>
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
