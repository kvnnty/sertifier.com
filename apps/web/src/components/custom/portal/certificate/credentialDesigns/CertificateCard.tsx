import { Certificate } from "@/lib/mock/mockCertificates";
import React, { useEffect, useRef, useState } from "react";

interface CertificateCardProps {
  certificate: Certificate;
  isSelected: boolean;
  onSelect: (certificate: Certificate) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  isSelected,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!certificate.backgroundImage) {
      setBackgroundImage(null);
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

    img.src = certificate.backgroundImage;
  }, [certificate.backgroundImage]);

  useEffect(() => {
    drawPreview();
  }, [certificate, backgroundImage]);

  const drawPreview = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 0.2;
    canvas.width = certificate.width * scale;
    canvas.height = certificate.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(scale, scale);

    if (backgroundImage) {
      ctx.drawImage(
        backgroundImage,
        0,
        0,
        certificate.width,
        certificate.height
      );
    } else {
      ctx.fillStyle = certificate.backgroundColor || "#f8f9fa";
      ctx.fillRect(0, 0, certificate.width, certificate.height);
    }

    certificate.elements.forEach((element) => {
      if (element.type === "text") {
        drawTextElement(ctx, element);
      } else if (element.type === "rectangle") {
        drawRectangleElement(ctx, element);
      } else if (element.type === "circle") {
        drawCircleElement(ctx, element);
      }
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const drawTextElement = (ctx: CanvasRenderingContext2D, element: any) => {
    ctx.save();

    if (element.rotation) {
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-element.x, -element.y);
    }

    ctx.font = `${element.fontStyle === "italic" ? "italic " : ""}${
      element.fontWeight || "normal"
    } ${element.fontSize || 16}px ${element.fontFamily || "Arial"}`;
    ctx.fillStyle = element.color || "#000000";
    ctx.textAlign = element.textAlign || "center";
    ctx.textBaseline = "middle";

    // Draw text with letter spacing if specified
    if (element.letterSpacing) {
      drawTextWithLetterSpacing(ctx, element);
    } else {
      ctx.fillText(element.content, element.x, element.y);
    }

    ctx.restore();
  };

  const drawTextWithLetterSpacing = (
    ctx: CanvasRenderingContext2D,
    element: any
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

    chars.forEach((char: string) => {
      ctx.fillText(char, currentX, element.y);
      currentX +=
        ctx.measureText(char).width + parseFloat(element.letterSpacing || "0");
    });
  };

  const drawRectangleElement = (
    ctx: CanvasRenderingContext2D,
    element: any
  ) => {
    ctx.save();

    // Handle rotation
    if (element.rotation) {
      ctx.translate(
        element.x + (element.width || 0) / 2,
        element.y + (element.height || 0) / 2
      );
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(element.width || 0) / 2, -(element.height || 0) / 2);
    }

    // Set fill and stroke styles
    ctx.fillStyle = element.fillColor || "#3B82F6";
    ctx.strokeStyle = element.strokeColor || "#1E40AF";
    ctx.lineWidth = element.strokeWidth || 2;

    // Draw rectangle
    ctx.fillRect(
      element.x,
      element.y,
      element.width || 100,
      element.height || 100
    );

    if (element.strokeWidth && element.strokeWidth > 0) {
      ctx.strokeRect(
        element.x,
        element.y,
        element.width || 100,
        element.height || 100
      );
    }

    ctx.restore();
  };

  const drawCircleElement = (ctx: CanvasRenderingContext2D, element: any) => {
    ctx.save();

    const centerX = element.x + (element.width || 100) / 2;
    const centerY = element.y + (element.height || 100) / 2;
    const radius = Math.min(element.width || 100, element.height || 100) / 2;

    // Set fill and stroke styles
    ctx.fillStyle = element.fillColor || "#3B82F6";
    ctx.strokeStyle = element.strokeColor || "#1E40AF";
    ctx.lineWidth = element.strokeWidth || 2;

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (element.strokeWidth && element.strokeWidth > 0) {
      ctx.stroke();
    }

    ctx.restore();
  };

  return (
    <div
      className={`relative cursor-pointer rounded-sm  border-2 transition-all duration-200 ${
        isSelected
          ? "border-[#086956] bg-[#086956]shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={() => onSelect(certificate)}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-sm  bg-gray-100 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#086956] rounded-sm animate-spin"></div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{
              filter: isSelected ? "brightness(1.05)" : "brightness(1)",
              transition: "filter 0.2s ease",
            }}
          />
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#086956] text-white rounded-sm ll w-6 h-6 flex items-center justify-center">
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

export default CertificateCard;
