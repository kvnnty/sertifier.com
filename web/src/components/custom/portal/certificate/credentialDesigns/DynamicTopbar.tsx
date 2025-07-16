import React, { useState } from "react";
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
  Square,
  Circle,
  Trash,
  Copy,
  Undo,
  Redo,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { CertificateElement } from "@/lib/mock/mockCertificates";
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
}) => {
  const [showShapesDropdown, setShowShapesDropdown] = useState(false);

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
    return (
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedElement.fontFamily || "Arial"}
              onChange={(e) =>
                onUpdateElement(
                  selectedElement.id,
                  "fontFamily",
                  e.target.value
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier New">Courier New</option>
            </select>

            <select
              value={selectedElement.fontSize?.toString() || "16"}
              onChange={(e) =>
                onUpdateElement(
                  selectedElement.id,
                  "fontSize",
                  parseInt(e.target.value)
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[
                8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72,
              ].map((size) => (
                <option key={size} value={size.toString()}>
                  {size}
                </option>
              ))}
            </select>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  onUpdateElement(
                    selectedElement.id,
                    "fontWeight",
                    selectedElement.fontWeight === "bold" ? "normal" : "bold"
                  )
                }
                className={`p-2 ${
                  selectedElement.fontWeight === "bold"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-green-50`}
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() =>
                  onUpdateElement(
                    selectedElement.id,
                    "fontStyle",
                    selectedElement.fontStyle === "italic" ? "normal" : "italic"
                  )
                }
                className={`p-2 ${
                  selectedElement.fontStyle === "italic"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-green-50`}
              >
                <Italic size={16} />
              </button>
              <button className="p-2 bg-white text-gray-700 hover:bg-green-50">
                <Underline size={16} />
              </button>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              {["left", "center", "right"].map((align) => {
                const Icon =
                  align === "left"
                    ? AlignLeft
                    : align === "center"
                    ? AlignCenter
                    : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() =>
                      onUpdateElement(selectedElement.id, "textAlign", align)
                    }
                    className={`p-2 ${
                      selectedElement.textAlign === align
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-700 hover:bg-green-50"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <input
                type="color"
                value={selectedElement.color || "#000000"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, "color", e.target.value)
                }
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
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
              <div
                className="w-8 h-8 border-2 border-gray-300 rounded-sm shadow-sm"
                style={{
                  backgroundColor: selectedElement.fillColor || "#000000",
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Fill:</span>
              <input
                type="color"
                value={selectedElement.fillColor || "#000000"}
                onChange={(e) =>
                  onUpdateElement(
                    selectedElement.id,
                    "fillColor",
                    e.target.value
                  )
                }
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

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
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="10"
                max="800"
              />
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Stroke:</span>
              <input
                type="color"
                value={selectedElement.strokeColor || "#000000"}
                onChange={(e) =>
                  onUpdateElement(
                    selectedElement.id,
                    "strokeColor",
                    e.target.value
                  )
                }
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="number"
                value={selectedElement.strokeWidth || 2}
                onChange={(e) =>
                  onUpdateElement(
                    selectedElement.id,
                    "strokeWidth",
                    parseInt(e.target.value)
                  )
                }
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="20"
                placeholder="Width"
              />
            </div>
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
