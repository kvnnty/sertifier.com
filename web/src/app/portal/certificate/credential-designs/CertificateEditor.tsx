"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import DynamicTopbar from "../../../../components/custom/portal/certificate/credentialDesigns/DynamicTopbar";
import SidebarPanel, {
  CERTIFICATE_SIZES,
} from "../../../../components/custom/portal/certificate/credentialDesigns/sidebar";
import { useCertificateState } from "@/hooks/useCertificates";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { findElementAtPosition } from "@/lib/utils/canvasUtils";
import CertificateSideBar from "@/components/custom/portal/certificate/SideBar";
import { useState } from "react";

const CertificateEditor: React.FC = () => {
  const {
    certificates,
    selectedCertificate,
    setSelectedCertificate,
    selectedElement,
    setSelectedElement,
    activeSidebarFeature,
    setActiveSidebarFeature,
    isEditing,
    editingText,
    setEditingText,
    createBlankCertificate,
    addTextElement,
    addShapeElement,
    updateElement,
    finishEditing,
    handleEditingKeyDown,
    startInlineEditing,
    certificateSize,
    handleCertificateSizeChange,
    uploadedImages,
    handleImageUpload,
    selectUploadedImage,
    deleteImage,
  } = useCertificateState();

  // State for color picker
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState("#000000");

  // State for attributes
  const [attributeInstanceCounts, setAttributeInstanceCounts] = React.useState<
    Record<string, number>
  >({});

  // State for sidebar feature
  const [sidebarFeature, setSidebarFeature] = useState<string>("templates");

  const {
    canvasRef,
    inputRef,
    isLoading,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    getCursorStyle,
    downloadCertificate,
    // New functions
    duplicateElement,
    deleteElement,
    undo,
    redo,
    sendUpwards,
    sendDownwards,
    canUndo,
    canRedo,
  } = useCanvasInteraction(
    selectedCertificate,
    selectedElement,
    isEditing,
    setSelectedElement,
    updateElement,
    setSelectedCertificate
  );

  // Calculate attribute instance counts
  React.useEffect(() => {
    if (!selectedCertificate) return;

    const counts: Record<string, number> = {};

    selectedCertificate.elements.forEach((element) => {
      if (element.type === "text") {
        // Check for attribute placeholders like [recipient.name]
        const matches = element.content.match(/\[[\w.]+\]/g);
        if (matches) {
          matches.forEach((match) => {
            counts[match] = (counts[match] || 0) + 1;
          });
        }
      }
    });

    setAttributeInstanceCounts(counts);
  }, [selectedCertificate]);

  // Add attribute to certificate
  const handleAddAttribute = (attributePlaceholder: string) => {
    const newElement = {
      id: Date.now(),
      type: "text",
      content: attributePlaceholder,
      x: selectedCertificate.width / 2,
      y: selectedCertificate.height / 2,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      textAlign: "center" as "center", // Type assertion to fix the error
      fontWeight: "normal",
    };

    const updatedCertificate = {
      ...selectedCertificate,
      elements: [...selectedCertificate.elements, newElement],
    };

    setSelectedCertificate(updatedCertificate);
    setSelectedElement(newElement);

    // Update attribute counts
    setAttributeInstanceCounts((prev) => ({
      ...prev,
      [attributePlaceholder]: (prev[attributePlaceholder] || 0) + 1,
    }));
  };

  // Remove all instances of an attribute
  const handleRemoveAllAttributeInstances = (attributePlaceholder: string) => {
    const updatedElements = selectedCertificate.elements.filter((element) => {
      if (element.type === "text") {
        return !element.content.includes(attributePlaceholder);
      }
      return true;
    });

    const updatedCertificate = {
      ...selectedCertificate,
      elements: updatedElements,
    };

    setSelectedCertificate(updatedCertificate);

    // If the selected element was removed, clear selection
    if (
      selectedElement &&
      selectedElement.type === "text" &&
      selectedElement.content.includes(attributePlaceholder)
    ) {
      setSelectedElement(null);
    }

    // Update attribute counts
    setAttributeInstanceCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[attributePlaceholder];
      return newCounts;
    });
  };

  // Calculate the scale factor to fit the certificate in the viewport
  const canvasContainerStyle = useMemo(() => {
    const maxWidth = 900; // Maximum width for the canvas container
    const maxHeight = 600; // Maximum height for the canvas container

    const { width, height } = selectedCertificate;

    let scale = 1;
    if (width > maxWidth || height > maxHeight) {
      const scaleX = maxWidth / width;
      const scaleY = maxHeight / height;
      scale = Math.min(scaleX, scaleY);
    }

    return {
      width: `${width * scale}px`,
      height: `${height * scale}px`,
      maxWidth: "100%",
    };
  }, [selectedCertificate.width, selectedCertificate.height]);

  // Keyboard shortcut handlers
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check if any input element is focused
      const isInputFocused =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      if (isInputFocused) return;

      // Duplicate - Cmd/Ctrl + D
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        duplicateElement();
      }

      // Delete - Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        if (!isInputFocused) {
          e.preventDefault();
          deleteElement();
        }
      }

      // Undo - Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo - Cmd/Ctrl + Y or Cmd/Ctrl + Shift + Z
      if (
        ((e.metaKey || e.ctrlKey) && e.key === "y") ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
      }
    },
    [duplicateElement, deleteElement, undo, redo]
  );

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Effect to handle text input positioning and sizing
  useEffect(() => {
    if (
      isEditing &&
      selectedElement &&
      selectedElement.type === "text" &&
      inputRef.current
    ) {
      // Set initial focus
      inputRef.current.focus();

      // Select all text
      inputRef.current.select();

      // Adjust width based on content
      const textWidth = Math.max(
        100, // Minimum width
        selectedElement.content.length * (selectedElement.fontSize / 2) // Approximate width based on content
      );

      inputRef.current.style.width = `${textWidth}px`;
    }
  }, [isEditing, selectedElement]);

  // Handle opening the color picker
  const handleOpenColorPicker = useCallback((color: string) => {
    setCurrentColor(color);
    setActiveSidebarFeature("colorPicker");
    setColorPickerOpen(true);
  }, []);

  // Handle color change
  const handleColorChange = useCallback(
    (color: string) => {
      setCurrentColor(color);
      if (selectedElement) {
        // Apply the correct color property based on element type
        if (selectedElement.type === "text") {
          updateElement(selectedElement.id, "color", color);
        } else {
          updateElement(selectedElement.id, "fillColor", color);
        }
      }
    },
    [selectedElement, updateElement]
  );

  // Handle closing the color picker
  const handleCloseColorPicker = useCallback(() => {
    setColorPickerOpen(false);
    setActiveSidebarFeature("templates");
  }, []);

  // Handle sidebar feature change
  const handleSidebarFeatureChange = (feature: string) => {
    setSidebarFeature(feature);

    // Map sidebar features to activeSidebarFeature values
    const featureMap: Record<string, any> = {
      templates: "templates",
      attributes: "attributes",
      elements: "elements",
      layers: "settings",
      qrcode: "settings",
    };

    setActiveSidebarFeature(featureMap[feature] || "templates");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-global fixed top-auto left-0 w-full">
      <CertificateSideBar
        onFeatureChange={handleSidebarFeatureChange}
        activeFeature={sidebarFeature}
      />
      <div className="pl-20">
        <div className="flex flex-row">
          <SidebarPanel
            feature={colorPickerOpen ? "colorPicker" : activeSidebarFeature}
            certificates={certificates}
            selectedCertificate={selectedCertificate}
            onSelectCertificate={setSelectedCertificate}
            onCreateBlankCertificate={createBlankCertificate}
            certificateSize={certificateSize}
            onCertificateSizeChange={handleCertificateSizeChange}
            uploadedImages={uploadedImages}
            onImageUpload={handleImageUpload}
            onSelectUploadedImage={selectUploadedImage}
            onDeleteImage={deleteImage}
            currentColor={currentColor}
            onColorChange={handleColorChange}
            onCloseColorPicker={handleCloseColorPicker}
            onAddAttribute={handleAddAttribute}
            onRemoveAllAttributeInstances={handleRemoveAllAttributeInstances}
            attributeInstanceCounts={attributeInstanceCounts}
          />

          <div className="flex-1 bg-white overflow-hidden">
            <DynamicTopbar
              selectedElement={selectedElement}
              onUpdateElement={updateElement}
              onAddText={addTextElement}
              onAddShape={addShapeElement}
              onImportImage={() => console.log("Import image")}
              onDownload={downloadCertificate}
              onDuplicate={duplicateElement}
              onDelete={deleteElement}
              onUndo={undo}
              onRedo={redo}
              onSendUpwards={sendUpwards}
              onSendDownwards={sendDownwards}
              canUndo={canUndo}
              canRedo={canRedo}
              onOpenColorPicker={handleOpenColorPicker}
            />

            <div className="p-6 flex items-center justify-center bg-gray-50 min-h-[600px]">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading certificate...</p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md relative flex items-center justify-center">
                  <div className="relative" style={canvasContainerStyle}>
                    <canvas
                      ref={canvasRef}
                      onClick={(e) => {
                        handleCanvasClick(e);
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        const rect = canvas.getBoundingClientRect();
                        const scaleX = canvas.width / rect.width;
                        const scaleY = canvas.height / rect.height;
                        const x = (e.clientX - rect.left) * scaleX;
                        const y = (e.clientY - rect.top) * scaleY;
                        const clickedElement = findElementAtPosition(
                          x,
                          y,
                          selectedCertificate,
                          canvasRef as React.RefObject<HTMLCanvasElement>
                        );
                        if (clickedElement && e.detail === 2) {
                          startInlineEditing(clickedElement);
                        }
                      }}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      className={`border border-gray-300 rounded w-full h-full ${getCursorStyle()}`}
                    />

                    {isEditing &&
                      selectedElement &&
                      selectedElement.type === "text" && (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={handleEditingKeyDown}
                          onBlur={finishEditing}
                          className="absolute bg-transparent border-2 border-blue-500 rounded px-2 py-1 outline-none z-10"
                          style={{
                            left: `${selectedElement.x}px`,
                            top: `${selectedElement.y}px`,
                            fontSize: `${selectedElement.fontSize}px`,
                            fontFamily: selectedElement.fontFamily,
                            color: selectedElement.color,
                            fontWeight: selectedElement.fontWeight || "normal",
                            fontStyle: selectedElement.fontStyle || "normal",
                            textAlign: selectedElement.textAlign,
                            textDecoration:
                              selectedElement.textDecoration === "underline"
                                ? "underline"
                                : "none",
                            textDecorationThickness: `${Math.max(
                              1,
                              selectedElement.fontSize * 0.06
                            )}px`,
                            textUnderlineOffset: `${
                              selectedElement.fontSize * 0.15
                            }px`,
                            transform: `translate(-50%, -50%) ${
                              selectedElement.rotation
                                ? `rotate(${selectedElement.rotation}deg)`
                                : ""
                            }`,
                            minWidth: "100px",
                            width: "auto",
                            textShadow: "0 0 1px rgba(255, 255, 255, 0.5)",
                          }}
                          autoFocus
                        />
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;
