import { Certificate, CertificateElement } from "@/lib/mock/mockCertificates";
import { CursorType } from "@/lib/types/types";
import { drawCanvas, findElementAtPosition, getCanvasCoordinates, getCursorType } from "@/lib/utils/canvasUtils";
import { useState, useEffect, useRef } from "react";

export const useCanvasInteraction = (
  selectedCertificate: Certificate,
  selectedElement: CertificateElement | null,
  isEditing: boolean,
  setSelectedElement: (element: CertificateElement | null) => void,
  updateElement: (elementId: number, property: string, value: any) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveredElement, setHoveredElement] = useState<CertificateElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStart, setRotationStart] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    if (!selectedCertificate?.backgroundImage) {
      setBackgroundImage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      setBackgroundImage(img);
      setIsLoading(false);
    };

    img.onerror = () => {
      setBackgroundImage(null);
      setIsLoading(false);
    };

    img.src = selectedCertificate.backgroundImage;
  }, [selectedCertificate?.backgroundImage]);

  useEffect(() => {
    drawCanvas(canvasRef as React.RefObject<HTMLCanvasElement>, selectedCertificate, backgroundImage, selectedElement, hoveredElement, isEditing);
  }, [backgroundImage, selectedCertificate, selectedElement, hoveredElement, isEditing]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event, canvasRef as React.RefObject<HTMLCanvasElement>);
    const clickedElement = findElementAtPosition(x, y, selectedCertificate, canvasRef as React.RefObject<HTMLCanvasElement>);

    if (clickedElement && event.detail === 2) {
      setSelectedElement(clickedElement);
      // Note: startInlineEditing is handled in useCertificateState
    } else if (clickedElement) {
      setSelectedElement(clickedElement);
    } else {
      setSelectedElement(null);
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event, canvasRef as React.RefObject<HTMLCanvasElement>);
    const clickedElement = findElementAtPosition(x, y, selectedCertificate, canvasRef as React.RefObject<HTMLCanvasElement>);

    if (clickedElement && selectedElement?.id === clickedElement.id) {
      const { cursorType: currentCursor, resizeHandle: handle } = getCursorType(x, y, clickedElement, canvasRef as React.RefObject<HTMLCanvasElement>);
      
      if (currentCursor === "move") {
        setIsDragging(true);
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y,
        });
      } else if (currentCursor.includes("resize")) {
        setIsResizing(true);
        setResizeHandle(handle);
      } else if (currentCursor === "rotate") {
        setIsRotating(true);
        const centerX = clickedElement.x + (clickedElement.width || 0) / 2;
        const centerY = clickedElement.y + (clickedElement.height || 0) / 2;
        const startAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        setRotationStart({
          x: centerX,
          y: centerY,
          angle: startAngle - (clickedElement.rotation || 0),
        });
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event, canvasRef as React.RefObject<HTMLCanvasElement>);

    if (isDragging && selectedElement) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      updateElement(selectedElement.id, "x", newX);
      updateElement(selectedElement.id, "y", newY);
      return;
    }

    if (isResizing && selectedElement && resizeHandle) {
      const minSize = 20;
      let newWidth = selectedElement.width || 100;
      let newHeight = selectedElement.height || 100;
      let newX = selectedElement.x;
      let newY = selectedElement.y;

      switch (resizeHandle) {
        case "nw":
          newWidth = Math.max(minSize, (selectedElement.x + (selectedElement.width || 100)) - x);
          newHeight = Math.max(minSize, (selectedElement.y + (selectedElement.height || 100)) - y);
          newX = x;
          newY = y;
          break;
        case "ne":
          newWidth = Math.max(minSize, x - selectedElement.x);
          newHeight = Math.max(minSize, (selectedElement.y + (selectedElement.height || 100)) - y);
          newY = y;
          break;
        case "sw":
          newWidth = Math.max(minSize, (selectedElement.x + (selectedElement.width || 100)) - x);
          newHeight = Math.max(minSize, y - selectedElement.y);
          newX = x;
          break;
        case "se":
          newWidth = Math.max(minSize, x - selectedElement.x);
          newHeight = Math.max(minSize, y - selectedElement.y);
          break;
        case "n":
          newHeight = Math.max(minSize, (selectedElement.y + (selectedElement.height || 100)) - y);
          newY = y;
          break;
        case "s":
          newHeight = Math.max(minSize, y - selectedElement.y);
          break;
        case "w":
          newWidth = Math.max(minSize, (selectedElement.x + (selectedElement.width || 100)) - x);
          newX = x;
          break;
        case "e":
          newWidth = Math.max(minSize, x - selectedElement.x);
          break;
      }

      updateElement(selectedElement.id, "width", newWidth);
      updateElement(selectedElement.id, "height", newHeight);
      updateElement(selectedElement.id, "x", newX);
      updateElement(selectedElement.id, "y", newY);
      return;
    }

    if (isRotating && selectedElement) {
      const centerX = rotationStart.x;
      const centerY = rotationStart.y;
      const currentAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
      const newRotation = currentAngle - rotationStart.angle;
      const normalizedRotation = ((newRotation % 360) + 360) % 360;
      updateElement(selectedElement.id, "rotation", normalizedRotation);
      return;
    }

    const hoveredEl = findElementAtPosition(x, y, selectedCertificate, canvasRef as React.RefObject<HTMLCanvasElement>);
    setHoveredElement(hoveredEl);

    if (hoveredEl) {
      const { cursorType: newCursorType } = getCursorType(x, y, hoveredEl, canvasRef as React.RefObject<HTMLCanvasElement>);
      setCursorType(newCursorType);
    } else {
      setCursorType("default");
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
    setDragOffset({ x: 0, y: 0 });
    setRotationStart({ x: 0, y: 0, angle: 0 });
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${selectedCertificate.name.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const getCursorStyle = () => {
    switch (cursorType) {
      case "move":
        return "cursor-move";
      case "text":
        return "cursor-text";
      case "nw-resize":
        return "cursor-nw-resize";
      case "ne-resize":
        return "cursor-ne-resize";
      case "sw-resize":
        return "cursor-sw-resize";
      case "se-resize":
        return "cursor-se-resize";
      case "n-resize":
        return "cursor-n-resize";
      case "s-resize":
        return "cursor-s-resize";
      case "w-resize":
        return "cursor-w-resize";
      case "e-resize":
        return "cursor-e-resize";
      case "rotate":
        return "cursor-grab";
      default:
        return "cursor-default";
    }
  };

  return {
    canvasRef,
    inputRef,
    isLoading,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    getCursorStyle,
    downloadCertificate,
  };
};