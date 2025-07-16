import React, { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_COLORS = [
  "#002855",
  "#0077CC",
  "#7DD3FC",
  "#22D3EE",
  "#4ADE80",
  "#10B981",
  "#064E3B",
  "#059669",
  "#2DD4BF",
  "#5EEAD4",
  "#E0F2F1",
  "#EF4444",
  "#F87171",
  "#FB923C",
  "#FBBF24",
  "#086956",
];

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

// Convert hex to HSV
const hexToHsv = (hex: string): { h: number; s: number; v: number } => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta === 0) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return { h, s, v };
};

const hsvToHex = (h: number, s: number, v: number): string => {
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const rValue = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gValue = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bValue = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rValue}${gValue}${bValue}`;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorChange,
  onClose,
}) => {
  const initialHsv = hexToHsv(currentColor || "#000000");

  const [hue, setHue] = useState<number>(initialHsv.h);
  const [saturation, setSaturation] = useState<number>(initialHsv.s);
  const [value, setValue] = useState<number>(initialHsv.v);
  const [hexColor, setHexColor] = useState<string>(currentColor || "#000000");
  const [previousColors, setPreviousColors] = useState<string[]>([]);

  const saturationValueRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hueThumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedColors = localStorage.getItem("previousColors");
    if (savedColors) {
      setPreviousColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    const newHexColor = hsvToHex(hue, saturation, value);
    setHexColor(newHexColor);
  }, [hue, saturation, value]);

  useEffect(() => {
    if (thumbRef.current && saturationValueRef.current) {
      const svRect = saturationValueRef.current.getBoundingClientRect();
      thumbRef.current.style.left = `${saturation * svRect.width}px`;
      thumbRef.current.style.top = `${(1 - value) * svRect.height}px`;
    }
  }, [saturation, value]);

  useEffect(() => {
    if (hueThumbRef.current && hueSliderRef.current) {
      const hueRect = hueSliderRef.current.getBoundingClientRect();
      hueThumbRef.current.style.left = `${(hue / 360) * hueRect.width}px`;
    }
  }, [hue]);

  const handleSaturationValueChange = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (saturationValueRef.current) {
        const rect = saturationValueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        const newSaturation = x / rect.width;
        const newValue = 1 - y / rect.height;

        setSaturation(newSaturation);
        setValue(newValue);
      }
    },
    []
  );

  const handleHueChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newHue = Math.round((x / rect.width) * 360);
      setHue(newHue);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        const target = e.target as HTMLElement;
        if (saturationValueRef.current?.contains(target)) {
          handleSaturationValueChange(e);
        } else if (hueSliderRef.current?.contains(target)) {
          handleHueChange(e);
        }
      }
    };

    const handleMouseUp = () => {
      const newHexColor = hsvToHex(hue, saturation, value);

      onColorChange(newHexColor);

      if (!previousColors.includes(newHexColor)) {
        const updatedColors = [newHexColor, ...previousColors.slice(0, 3)];
        setPreviousColors(updatedColors);
        localStorage.setItem("previousColors", JSON.stringify(updatedColors));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    handleSaturationValueChange,
    handleHueChange,
    hue,
    saturation,
    value,
    previousColors,
    onColorChange,
  ]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue.startsWith("#")) {
      newValue = newValue.substring(1);
    }

    newValue = newValue.replace(/[^0-9A-Fa-f]/g, "");

    newValue = newValue.substring(0, 6);

    const newHex = "#" + newValue;

    setHexColor(newHex);

    if (
      newValue.length === 6 ||
      (newValue.length === 3 && /^([0-9A-Fa-f]{3})$/.test(newValue))
    ) {
      const fullHex =
        newValue.length === 3
          ? `#${newValue[0]}${newValue[0]}${newValue[1]}${newValue[1]}${newValue[2]}${newValue[2]}`
          : newHex;

      try {
        const newHsv = hexToHsv(fullHex);
        setHue(newHsv.h);
        setSaturation(newHsv.s);
        setValue(newHsv.v);

        onColorChange(fullHex);
      } catch (error) {
        console.error("Error parsing hex color:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full max-w-xs">
      <div className="mb-6">
        <div
          ref={saturationValueRef}
          className="w-full h-64 rounded-lg relative cursor-pointer mb-4 overflow-hidden"
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
            backgroundImage: `
              linear-gradient(to right, #fff 0%, transparent 100%),
              linear-gradient(to top, #000 0%, transparent 100%)
            `,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
          }}
          onMouseDown={handleSaturationValueChange}
        >
          <div
            ref={thumbRef}
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: hexColor,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <div
          ref={hueSliderRef}
          className="w-full h-6 rounded-full relative cursor-pointer overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, 
              #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
          }}
          onMouseDown={handleHueChange}
        >
          <div
            ref={hueThumbRef}
            className="absolute top-0 w-6 h-6 rounded-full border-2 border-white transform -translate-x-1/2"
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">HEX</span>
          <input
            type="text"
            value={hexColor}
            onChange={handleHexChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-full"
          />
        </div>
      </div>

      {previousColors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium uppercase text-gray-700 mb-2">
            PREVIOUS COLORS
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {previousColors.map((prevColor, index) => (
              <button
                key={`prev-${index}`}
                className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer"
                style={{ backgroundColor: prevColor }}
                onClick={() => {
                  const hsv = hexToHsv(prevColor);
                  setHue(hsv.h);
                  setSaturation(hsv.s);
                  setValue(hsv.v);
                  setHexColor(prevColor);
                  onColorChange(prevColor);
                }}
                aria-label={`Previous color ${prevColor}`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium uppercase text-gray-700 mb-2">
          DEFAULT COLORS
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {DEFAULT_COLORS.map((defaultColor, index) => (
            <button
              key={`default-${index}`}
              className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer"
              style={{ backgroundColor: defaultColor }}
              onClick={() => {
                const hsv = hexToHsv(defaultColor);
                setHue(hsv.h);
                setSaturation(hsv.s);
                setValue(hsv.v);
                setHexColor(defaultColor);
                onColorChange(defaultColor);
              }}
              aria-label={`Default color ${defaultColor}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;