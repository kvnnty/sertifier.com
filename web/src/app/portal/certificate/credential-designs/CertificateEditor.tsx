"use client";
import React, { useEffect, useCallback } from "react";
import DynamicTopbar from "../../../../components/custom/portal/certificate/credentialDesigns/DynamicTopbar";
import SidebarPanel from "../../../../components/custom/portal/certificate/credentialDesigns/sidebar";
import { useCertificateState } from "@/app/hooks/useCertificates";
import { useCanvasInteraction } from "@/app/hooks/useCanvasInteraction";
import { findElementAtPosition } from "@/lib/utils/canvasUtils";

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
  } = useCertificateState();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <DynamicTopbar
            selectedElement={selectedElement}
            onUpdateElement={updateElement}
            onAddText={addTextElement}
            onAddShape={addShapeElement}
            onImportImage={() => console.log("Import image")}
            onDownload={downloadCertificate}
            // New props for action buttons
            onDuplicate={duplicateElement}
            onDelete={deleteElement}
            onUndo={undo}
            onRedo={redo}
            onSendUpwards={sendUpwards}
            onSendDownwards={sendDownwards}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <div className="flex min-h-[600px]">
            <SidebarPanel
              feature={activeSidebarFeature}
              certificates={certificates}
              selectedCertificate={selectedCertificate}
              onSelectCertificate={setSelectedCertificate}
              onCreateBlankCertificate={createBlankCertificate}
            />
            <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 relative">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading certificate...</p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md relative">
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
                    className={`border border-gray-300 rounded max-w-full h-auto ${getCursorStyle()}`}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />

                  {isEditing && selectedElement && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleEditingKeyDown}
                      onBlur={finishEditing}
                      className="absolute bg-transparent border-2 border-blue-500 rounded px-2 py-1 text-center outline-none"
                      style={{
                        left: `${selectedElement.x}px`,
                        top: `${
                          selectedElement.y -
                          (selectedElement.fontSize || 24) / 2
                        }px`,
                        fontSize: `${selectedElement.fontSize}px`,
                        fontFamily: selectedElement.fontFamily,
                        color: selectedElement.color,
                        fontWeight: selectedElement.fontWeight || "normal",
                        fontStyle: selectedElement.fontStyle || "normal",
                        textAlign: selectedElement.textAlign,
                        transform: "translate(-50%, -50%)",
                        minWidth: "100px",
                      }}
                    />
                  )}
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
