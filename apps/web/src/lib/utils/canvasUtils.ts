import { RefObject } from "react";
import { Certificate, CertificateElement } from "../mock/mockCertificates";

export const drawCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  selectedCertificate: Certificate,
  backgroundImage: HTMLImageElement | null,
  selectedElement: CertificateElement | null,
  hoveredElement: CertificateElement | null,
  isEditing: boolean
) => {
  if (!canvasRef.current || !selectedCertificate) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = selectedCertificate.width;
  canvas.height = selectedCertificate.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = selectedCertificate.backgroundColor || "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#dee2e6";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }

  selectedCertificate.elements.forEach((element) => {
    // Always draw all elements, but if we're editing a text element, don't draw that specific element
    // This allows the input field to be visible while still showing all other elements
    if (
      isEditing &&
      selectedElement &&
      element.id === selectedElement.id &&
      element.type === "text"
    ) {
      // Skip drawing the text element that is being edited
      return;
    }

    if (element.type === "text") {
      drawTextElement(ctx, element, selectedElement, hoveredElement);
    } else if (element.type === "rectangle" || element.type === "circle") {
      drawShapeElement(ctx, element, selectedElement, hoveredElement);
    }
  });
};

export const drawShapeElement = (
  ctx: CanvasRenderingContext2D,
  element: CertificateElement,
  selectedElement: CertificateElement | null,
  hoveredElement: CertificateElement | null
) => {
  ctx.save();

  if (element.rotation) {
    ctx.translate(
      element.x + element.width! / 2,
      element.y + element.height! / 2
    );
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.translate(-element.width! / 2, -element.height! / 2);
  }

  ctx.fillStyle = element.fillColor || "#3B82F6";
  ctx.strokeStyle = element.strokeColor || "#1E40AF";
  ctx.lineWidth = element.strokeWidth || 2;

  if (element.type === "rectangle") {
    if (element.borderRadius && element.borderRadius > 0) {
      // Draw rectangle with rounded corners
      const radius = Math.min(
        element.borderRadius,
        element.width! / 2,
        element.height! / 2
      );

      ctx.beginPath();
      ctx.moveTo(element.x + radius, element.y);
      ctx.lineTo(element.x + element.width! - radius, element.y);
      ctx.arcTo(
        element.x + element.width!,
        element.y,
        element.x + element.width!,
        element.y + radius,
        radius
      );
      ctx.lineTo(
        element.x + element.width!,
        element.y + element.height! - radius
      );
      ctx.arcTo(
        element.x + element.width!,
        element.y + element.height!,
        element.x + element.width! - radius,
        element.y + element.height!,
        radius
      );
      ctx.lineTo(element.x + radius, element.y + element.height!);
      ctx.arcTo(
        element.x,
        element.y + element.height!,
        element.x,
        element.y + element.height! - radius,
        radius
      );
      ctx.lineTo(element.x, element.y + radius);
      ctx.arcTo(element.x, element.y, element.x + radius, element.y, radius);
      ctx.closePath();

      ctx.fill();
      if (element.strokeWidth && element.strokeWidth > 0) {
        ctx.stroke();
      }
    } else {
      // Draw regular rectangle
      ctx.fillRect(element.x, element.y, element.width!, element.height!);
      if (element.strokeWidth && element.strokeWidth > 0) {
        ctx.strokeRect(element.x, element.y, element.width!, element.height!);
      }
    }
  } else if (element.type === "circle") {
    const centerX = element.x + element.width! / 2;
    const centerY = element.y + element.height! / 2;
    const radius = Math.min(element.width!, element.height!) / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (element.strokeWidth && element.strokeWidth > 0) {
      ctx.stroke();
    }
  }

  if (hoveredElement?.id === element.id || selectedElement?.id === element.id) {
    drawShapeHighlight(ctx, element, selectedElement);
  }

  ctx.restore();
};

export const drawShapeHighlight = (
  ctx: CanvasRenderingContext2D,
  element: CertificateElement,
  selectedElement: CertificateElement | null
) => {
  // Use #086956 for selected elements, light gray for hovered
  ctx.strokeStyle = selectedElement?.id === element.id ? "#086956" : "#94A3B8";
  ctx.lineWidth = 2;
  ctx.setLineDash(selectedElement?.id === element.id ? [] : [5, 5]);

  const padding = 4;
  const rectX = element.x - padding;
  const rectY = element.y - padding;
  const rectWidth = element.width! + padding * 2;
  const rectHeight = element.height! + padding * 2;

  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

  if (selectedElement?.id === element.id) {
    drawResizeHandles(ctx, rectX, rectY, rectWidth, rectHeight);
  }

  ctx.setLineDash([]);
};

export const drawTextElement = (
  ctx: CanvasRenderingContext2D,
  element: CertificateElement,
  selectedElement: CertificateElement | null,
  hoveredElement: CertificateElement | null
) => {
  ctx.save();

  if (element.rotation) {
    ctx.translate(element.x, element.y);
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.translate(-element.x, -element.y);
  }

  ctx.font = `${element.fontStyle === "italic" ? "italic " : ""}${
    element.fontWeight || "normal"
  } ${element.fontSize}px ${element.fontFamily}`;
  ctx.fillStyle = element.color;
  ctx.textAlign = element.textAlign;
  ctx.textBaseline = "middle";

  if (element.letterSpacing) {
    drawTextWithLetterSpacing(ctx, element);
  } else {
    ctx.fillText(element.content, element.x, element.y);

    // Draw underline if textDecoration is set to underline
    if (element.textDecoration === "underline") {
      const metrics = ctx.measureText(element.content);
      const textWidth = metrics.width;

      // Calculate underline position based on text alignment
      let underlineX = element.x;
      if (element.textAlign === "center") {
        underlineX -= textWidth / 2;
      } else if (element.textAlign === "right") {
        underlineX -= textWidth;
      }

      // Draw the underline with increased offset from the text baseline
      const underlineY = element.y + element.fontSize * 0.3; // Increased from 0.15 to 0.3
      const underlineThickness = Math.max(1, element.fontSize * 0.06); // Slightly thicker

      ctx.beginPath();
      ctx.strokeStyle = element.color;
      ctx.lineWidth = underlineThickness;
      ctx.moveTo(underlineX, underlineY);
      ctx.lineTo(underlineX + textWidth, underlineY);
      ctx.stroke();
    }
  }

  if (hoveredElement?.id === element.id || selectedElement?.id === element.id) {
    drawElementHighlight(ctx, element, selectedElement);
  }

  ctx.restore();
};

export const drawTextWithLetterSpacing = (
  ctx: CanvasRenderingContext2D,
  element: CertificateElement
) => {
  const chars = element.content.split("");
  let totalWidth = 0;
  chars.forEach((char: string) => {
    totalWidth +=
      ctx.measureText(char).width + parseFloat(element.letterSpacing || "0");
  });

  let currentX = element.x;
  if (element.textAlign === "center") {
    currentX -= totalWidth / 2;
  } else if (element.textAlign === "right") {
    currentX -= totalWidth;
  }

  // Store the starting X position for underline
  const startX = currentX;

  chars.forEach((char: string) => {
    ctx.fillText(char, currentX, element.y);
    currentX +=
      ctx.measureText(char).width + parseFloat(element.letterSpacing || "0");
  });

  // Draw underline if textDecoration is set to underline
  if (element.textDecoration === "underline") {
    // Draw the underline with increased offset from the text baseline
    const underlineY = element.y + element.fontSize * 0.3; // Increased from 0.15 to 0.3
    const underlineThickness = Math.max(1, element.fontSize * 0.06); // Slightly thicker

    ctx.beginPath();
    ctx.strokeStyle = element.color;
    ctx.lineWidth = underlineThickness;
    ctx.moveTo(startX, underlineY);
    ctx.lineTo(currentX, underlineY);
    ctx.stroke();
  }
};

export const drawElementHighlight = (
  ctx: CanvasRenderingContext2D,
  element: CertificateElement,
  selectedElement: CertificateElement | null
) => {
  // Get more accurate text metrics
  ctx.font = `${element.fontStyle === "italic" ? "italic " : ""}${
    element.fontWeight || "normal"
  } ${element.fontSize}px ${element.fontFamily}`;

  const metrics = ctx.measureText(element.content);
  // Use more accurate height calculation based on font metrics
  const textHeight = element.fontSize * 1.2; // Multiply by 1.2 for better height approximation

  // Use the actual width of the text from metrics
  const textWidth = metrics.width;

  // Use #086956 for selected elements, light gray for hovered
  ctx.strokeStyle = selectedElement?.id === element.id ? "#086956" : "#94A3B8";
  ctx.lineWidth = 2;
  ctx.setLineDash(selectedElement?.id === element.id ? [] : [5, 5]);

  // Adjust padding based on font size for better proportions
  const padding = Math.max(8, element.fontSize / 3);

  // Calculate rectangle position based on text alignment
  let rectX = element.x - padding;
  let rectWidth = textWidth + padding * 2;

  // Adjust position based on text alignment
  if (element.textAlign === "center") {
    rectX = element.x - textWidth / 2 - padding;
  } else if (element.textAlign === "right") {
    rectX = element.x - textWidth - padding;
  }

  const rectY = element.y - textHeight / 2 - padding;
  const rectHeight = textHeight + padding * 2;

  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

  if (selectedElement?.id === element.id) {
    drawResizeHandles(ctx, rectX, rectY, rectWidth, rectHeight);
  }

  ctx.setLineDash([]);
};

export const drawResizeHandles = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const handleSize = 8;
  ctx.fillStyle = "#086956";

  ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
  ctx.fillRect(
    x + width - handleSize / 2,
    y - handleSize / 2,
    handleSize,
    handleSize
  );
  ctx.fillRect(
    x - handleSize / 2,
    y + height - handleSize / 2,
    handleSize,
    handleSize
  );
  ctx.fillRect(
    x + width - handleSize / 2,
    y + height - handleSize / 2,
    handleSize,
    handleSize
  );

  ctx.fillRect(
    x + width / 2 - handleSize / 2,
    y - handleSize / 2,
    handleSize,
    handleSize
  );
  ctx.fillRect(
    x + width / 2 - handleSize / 2,
    y + height - handleSize / 2,
    handleSize,
    handleSize
  );
  ctx.fillRect(
    x - handleSize / 2,
    y + height / 2 - handleSize / 2,
    handleSize,
    handleSize
  );
  ctx.fillRect(
    x + width - handleSize / 2,
    y + height / 2 - handleSize / 2,
    handleSize,
    handleSize
  );

  const rotateHandleY = y - 25;
  ctx.fillStyle = "#086956";
  ctx.beginPath();
  ctx.arc(x + width / 2, rotateHandleY, handleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "#086956";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, rotateHandleY + handleSize / 2);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
};

export const getCanvasCoordinates = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

export const findElementAtPosition = (
  x: number,
  y: number,
  selectedCertificate: Certificate,
  canvasRef: RefObject<HTMLCanvasElement>
): CertificateElement | null => {
  for (let i = selectedCertificate.elements.length - 1; i >= 0; i--) {
    const element = selectedCertificate.elements[i];

    if (element.type === "rectangle") {
      if (
        x >= element.x &&
        x <= element.x + element.width! &&
        y >= element.y &&
        y <= element.y + element.height!
      ) {
        return element;
      }
    } else if (element.type === "circle") {
      const centerX = element.x + element.width! / 2;
      const centerY = element.y + element.height! / 2;
      const radius = Math.min(element.width!, element.height!) / 2;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );

      if (distance <= radius) {
        return element;
      }
    } else if (element.type === "text") {
      const canvas = canvasRef.current;
      if (!canvas) continue;

      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      ctx.font = `${element.fontWeight || "normal"} ${element.fontSize}px ${
        element.fontFamily
      }`;
      const metrics = ctx.measureText(element.content);
      const textWidth = metrics.width;
      const textHeight = element.fontSize!;

      if (
        x >= element.x - textWidth / 2 &&
        x <= element.x + textWidth / 2 &&
        y >= element.y - textHeight / 2 &&
        y <= element.y + textHeight / 2
      ) {
        return element;
      }
    }
  }

  return null;
};

export const getCursorType = (
  x: number,
  y: number,
  element: CertificateElement,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  if (element.type === "rectangle" || element.type === "circle") {
    const padding = 4;
    const rectX = element.x - padding;
    const rectY = element.y - padding;
    const rectWidth = (element.width || 100) + padding * 2;
    const rectHeight = (element.height || 100) + padding * 2;

    const edgeThreshold = 10;
    const rotateThreshold = 25;

    const rotateHandleX = rectX + rectWidth / 2;
    const rotateHandleY = rectY - rotateThreshold;

    if (
      Math.abs(x - rotateHandleX) < edgeThreshold &&
      Math.abs(y - rotateHandleY) < edgeThreshold
    ) {
      return { cursorType: "rotate" as const, resizeHandle: "rotate" };
    }

    const corners = [
      { x: rectX, y: rectY, handle: "nw", cursor: "nw-resize" },
      { x: rectX + rectWidth, y: rectY, handle: "ne", cursor: "ne-resize" },
      { x: rectX, y: rectY + rectHeight, handle: "sw", cursor: "sw-resize" },
      {
        x: rectX + rectWidth,
        y: rectY + rectHeight,
        handle: "se",
        cursor: "se-resize",
      },
    ];

    for (const corner of corners) {
      if (
        Math.abs(x - corner.x) < edgeThreshold &&
        Math.abs(y - corner.y) < edgeThreshold
      ) {
        return {
          cursorType: corner.cursor as any,
          resizeHandle: corner.handle,
        };
      }
    }

    const edges = [
      {
        condition:
          Math.abs(y - rectY) < edgeThreshold &&
          x > rectX &&
          x < rectX + rectWidth,
        handle: "n",
        cursor: "n-resize",
      },
      {
        condition:
          Math.abs(y - (rectY + rectHeight)) < edgeThreshold &&
          x > rectX &&
          x < rectX + rectWidth,
        handle: "s",
        cursor: "s-resize",
      },
      {
        condition:
          Math.abs(x - rectX) < edgeThreshold &&
          y > rectY &&
          y < rectY + rectHeight,
        handle: "w",
        cursor: "w-resize",
      },
      {
        condition:
          Math.abs(x - (rectX + rectWidth)) < edgeThreshold &&
          y > rectY &&
          y < rectY + rectHeight,
        handle: "e",
        cursor: "e-resize",
      },
    ];

    for (const edge of edges) {
      if (edge.condition) {
        return { cursorType: edge.cursor as any, resizeHandle: edge.handle };
      }
    }

    return { cursorType: "move" as const, resizeHandle: null };
  }

  const canvas = canvasRef.current;
  if (!canvas) return { cursorType: "default" as const, resizeHandle: null };

  const ctx = canvas.getContext("2d");
  if (!ctx) return { cursorType: "default" as const, resizeHandle: null };

  ctx.font = `${element.fontWeight || "normal"} ${element.fontSize}px ${
    element.fontFamily
  }`;
  const metrics = ctx.measureText(element.content);
  const textWidth = metrics.width;
  const textHeight = element.fontSize!;

  const padding = 8;
  const rectX = element.x - textWidth / 2 - padding;
  const rectY = element.y - textHeight / 2 - padding;
  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;

  const edgeThreshold = 10;
  const rotateThreshold = 25;

  const rotateHandleX = rectX + rectWidth / 2;
  const rotateHandleY = rectY - rotateThreshold;

  if (
    Math.abs(x - rotateHandleX) < edgeThreshold &&
    Math.abs(y - rotateHandleY) < edgeThreshold
  ) {
    return { cursorType: "rotate" as const, resizeHandle: "rotate" };
  }

  const corners = [
    { x: rectX, y: rectY, handle: "nw", cursor: "nw-resize" },
    { x: rectX + rectWidth, y: rectY, handle: "ne", cursor: "ne-resize" },
    { x: rectX, y: rectY + rectHeight, handle: "sw", cursor: "sw-resize" },
    {
      x: rectX + rectWidth,
      y: rectY + rectHeight,
      handle: "se",
      cursor: "se-resize",
    },
  ];

  for (const corner of corners) {
    if (
      Math.abs(x - corner.x) < edgeThreshold &&
      Math.abs(y - corner.y) < edgeThreshold
    ) {
      return { cursorType: corner.cursor as any, resizeHandle: corner.handle };
    }
  }

  return { cursorType: "move" as const, resizeHandle: null };
};
