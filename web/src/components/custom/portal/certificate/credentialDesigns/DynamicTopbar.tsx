import React, { useState, useEffect } from "react";
import {
  Download,
  Plus,
  Image,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Circle,
  Trash,
  Copy,
  Undo,
  Redo,
  ArrowUp,
  ArrowDown,
  Check,
} from "lucide-react";
import { CertificateElement as BaseCertificateElement } from "@/lib/mock/mockCertificates";
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Custom Tooltip wrapper component
const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};

// Extend the interface to include 'justify' as a valid textAlign value
interface CertificateElement extends Omit<BaseCertificateElement, "textAlign"> {
  textAlign?: "left" | "center" | "right" | "justify";
}

interface DynamicTopbarProps {
  selectedElement: CertificateElement | null;
  onUpdateElement: (elementId: number, property: string, value: any) => void;
  onAddText: () => void;
  onAddShape: (shapeType: "rectangle" | "circle") => void;
  onImportImage: () => void;
  onDownload: () => void;
  // New prop functions
  onDuplicate?: () => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSendUpwards?: () => void;
  onSendDownwards?: () => void;
  // For disabling buttons
  canUndo?: boolean;
  canRedo?: boolean;
  // For color picker
  onOpenColorPicker?: (currentColor: string) => void;
}

const DynamicTopbar: React.FC<DynamicTopbarProps> = ({
  selectedElement,
  onUpdateElement,
  onAddText,
  onAddShape,
  onImportImage,
  onDownload,
  // New props
  onDuplicate,
  onDelete,
  onUndo,
  onRedo,
  onSendUpwards,
  onSendDownwards,
  canUndo = false,
  canRedo = false,
  // Color picker
  onOpenColorPicker = () => {},
}) => {
  const [showShapesDropdown, setShowShapesDropdown] = useState(false);

  // Setup keyboard shortcuts for text formatting
  useEffect(() => {
    if (!selectedElement || selectedElement.type !== "text") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            onUpdateElement(
              selectedElement.id,
              "fontWeight",
              selectedElement.fontWeight === "bold" ? "normal" : "bold"
            );
            break;
          case "i":
            e.preventDefault();
            onUpdateElement(
              selectedElement.id,
              "fontStyle",
              selectedElement.fontStyle === "italic" ? "normal" : "italic"
            );
            break;
          case "u":
            e.preventDefault();
            onUpdateElement(
              selectedElement.id,
              "textDecoration",
              selectedElement.textDecoration === "underline"
                ? "normal"
                : "underline"
            );
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement, onUpdateElement]);

  const handleShapeAdd = (shapeType: "rectangle" | "circle") => {
    onAddShape(shapeType);
    setShowShapesDropdown(false);
  };

  // Action buttons to show on the right side
  const renderActionButtons = () => (
    <div className="flex items-center space-x-2">
      <Tooltip content="Duplicate (Cmd + D / Ctrl + D)">
        <button
          onClick={onDuplicate}
          disabled={!selectedElement}
          className={`p-2 rounded-md ${
            selectedElement
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Duplicate"
        >
          <Copy size={18} />
        </button>
      </Tooltip>

      <Tooltip content="Delete (Del, Backspace)">
        <button
          onClick={onDelete}
          disabled={!selectedElement}
          className={`p-2 rounded-md ${
            selectedElement
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Delete"
        >
          <Trash size={18} />
        </button>
      </Tooltip>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <Tooltip content="Undo (Ctrl + Z / Cmd + Z)">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-md ${
            canUndo
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Undo"
        >
          <Undo size={18} />
        </button>
      </Tooltip>

      <Tooltip content="Redo (Ctrl + Y / Cmd + Y)">
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-md ${
            canRedo
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Redo"
        >
          <Redo size={18} />
        </button>
      </Tooltip>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <Tooltip content="Move Layer Up">
        <button
          onClick={onSendUpwards}
          disabled={!selectedElement}
          className={`p-2 rounded-md ${
            selectedElement
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Send Upwards"
        >
          <ArrowUp size={18} />
        </button>
      </Tooltip>

      <Tooltip content="Move Layer Down">
        <button
          onClick={onSendDownwards}
          disabled={!selectedElement}
          className={`p-2 rounded-md ${
            selectedElement
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Send Downwards"
        >
          <ArrowDown size={18} />
        </button>
      </Tooltip>
    </div>
  );

  if (!selectedElement) {
    return (
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddText}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={16} />
              Add Text
            </button>

            <button
              onClick={onImportImage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Image size={16} />
              Import Image
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShapesDropdown(!showShapesDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add Shapes
                <ChevronDown size={16} />
              </button>
              {showShapesDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={() => handleShapeAdd("rectangle")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                  >
                    <Square size={16} className="text-gray-600" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => handleShapeAdd("circle")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 last:rounded-b-lg"
                  >
                    <Circle size={16} className="text-gray-600" />
                    Circle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {renderActionButtons()}
        </div>
      </div>
    );
  }

  // Render controls for text elements
  if (selectedElement.type === "text") {
    // Get the current alignment icon
    const getAlignmentIcon = () => {
      switch (selectedElement.textAlign) {
        case "left":
          return <AlignLeft size={16} />;
        case "center":
          return <AlignCenter size={16} />;
        case "right":
          return <AlignRight size={16} />;
        default:
          return <AlignLeft size={16} />;
      }
    };

    return (
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedElement.fontFamily || "Arial"}
              onValueChange={(value) =>
                onUpdateElement(selectedElement.id, "fontFamily", value)
              }
            >
              <SelectTrigger className="w-[180px] focus:ring-[#086956]/50 focus:border-[#086956]">
                <SelectValue placeholder="Select font" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="font-global">Sans-Serif</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedElement.fontSize?.toString() || "16"}
              onValueChange={(value) =>
                onUpdateElement(selectedElement.id, "fontSize", parseInt(value))
              }
            >
              <SelectTrigger className="w-[80px] focus:ring-[#086956]/50 focus:border-[#086956]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {[
                  8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72,
                ].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToggleGroup
              type="multiple"
              className="border border-gray-300 rounded-sm"
            >
              <Tooltip content="Bold (Ctrl+B)">
                <ToggleGroupItem
                  value="bold"
                  aria-label="Toggle bold"
                  data-state={
                    selectedElement.fontWeight === "bold" ? "on" : "off"
                  }
                  onClick={() =>
                    onUpdateElement(
                      selectedElement.id,
                      "fontWeight",
                      selectedElement.fontWeight === "bold" ? "normal" : "bold"
                    )
                  }
                  className={`p-2 ${
                    selectedElement.fontWeight === "bold"
                      ? "bg-[#086956] text-white"
                      : ""
                  }`}
                >
                  <Bold size={16} />
                </ToggleGroupItem>
              </Tooltip>

              <Tooltip content="Italic (Ctrl+I)">
                <ToggleGroupItem
                  value="italic"
                  aria-label="Toggle italic"
                  data-state={
                    selectedElement.fontStyle === "italic" ? "on" : "off"
                  }
                  onClick={() =>
                    onUpdateElement(
                      selectedElement.id,
                      "fontStyle",
                      selectedElement.fontStyle === "italic"
                        ? "normal"
                        : "italic"
                    )
                  }
                  className={`p-2 ${
                    selectedElement.fontStyle === "italic"
                      ? "bg-[#086956] text-white"
                      : ""
                  }`}
                >
                  <Italic size={16} />
                </ToggleGroupItem>
              </Tooltip>

              <Tooltip content="Underline (Ctrl+U)">
                <ToggleGroupItem
                  value="underline"
                  aria-label="Toggle underline"
                  data-state={
                    selectedElement.textDecoration === "underline"
                      ? "on"
                      : "off"
                  }
                  onClick={() =>
                    onUpdateElement(
                      selectedElement.id,
                      "textDecoration",
                      selectedElement.textDecoration === "underline"
                        ? "normal"
                        : "underline"
                    )
                  }
                  className={`p-2 ${
                    selectedElement.textDecoration === "underline"
                      ? "bg-[#086956] text-white"
                      : ""
                  }`}
                >
                  <Underline size={16} />
                </ToggleGroupItem>
              </Tooltip>
            </ToggleGroup>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 border border-gray-300 bg-white hover:bg-gray-50"
                >
                  {getAlignmentIcon()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <div className="flex flex-col">
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, "textAlign", "left")
                    }
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${
                      selectedElement.textAlign === "left" ? "bg-gray-100" : ""
                    }`}
                  >
                    <AlignLeft size={16} />
                    {selectedElement.textAlign === "left" && (
                      <Check size={16} className="ml-auto text-[#086956]" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, "textAlign", "center")
                    }
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${
                      selectedElement.textAlign === "center"
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <AlignCenter size={16} />
                    {selectedElement.textAlign === "center" && (
                      <Check size={16} className="ml-auto text-[#086956]" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, "textAlign", "right")
                    }
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${
                      selectedElement.textAlign === "right" ? "bg-gray-100" : ""
                    }`}
                  >
                    <AlignRight size={16} />
                    {selectedElement.textAlign === "right" && (
                      <Check size={16} className="ml-auto text-[#086956]" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElement(
                        selectedElement.id,
                        "textAlign",
                        "justify"
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${
                      selectedElement.textAlign === "justify"
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <AlignJustify size={16} />
                    {selectedElement.textAlign === "justify" && (
                      <Check size={16} className="ml-auto text-[#086956]" />
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <button
                onClick={() =>
                  onOpenColorPicker(selectedElement.color || "#000000")
                }
                className="w-8 h-8 border border-gray-300 rounded-sm cursor-pointer"
                style={{ backgroundColor: selectedElement.color || "#000000" }}
                aria-label="Open color picker"
              />
            </div>
          </div>

          {/* Action buttons */}
          {renderActionButtons()}
        </div>
      </div>
    );
  }

  // Render controls for shape elements
  if (
    selectedElement.type === "rectangle" ||
    selectedElement.type === "circle"
  ) {
    return (
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Fill:</span>
              <button
                onClick={() =>
                  onOpenColorPicker(selectedElement.fillColor || "#000000")
                }
                className="w-8 h-8 border border-gray-300 rounded-sm cursor-pointer"
                style={{
                  backgroundColor: selectedElement.fillColor || "#000000",
                }}
                aria-label="Open color picker"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Width:</span>
              <input
                type="number"
                value={selectedElement.width || 100}
                onChange={(e) =>
                  onUpdateElement(
                    selectedElement.id,
                    "width",
                    parseInt(e.target.value)
                  )
                }
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#086956]/50"
                min="10"
                max="800"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Height:</span>
              <input
                type="number"
                value={selectedElement.height || 100}
                onChange={(e) =>
                  onUpdateElement(
                    selectedElement.id,
                    "height",
                    parseInt(e.target.value)
                  )
                }
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#086956]/50"
                min="10"
                max="800"
              />
            </div>

            {selectedElement.type === "rectangle" && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Border Radius:
                </span>
                <input
                  type="number"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) =>
                    onUpdateElement(
                      selectedElement.id,
                      "borderRadius",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#086956]/50"
                  min="0"
                  max="100"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          {renderActionButtons()}
        </div>
      </div>
    );
  }

  return null;
};

export default DynamicTopbar;
