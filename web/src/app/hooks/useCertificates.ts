import { Certificate, CertificateElement, MOCK_CERTIFICATES } from "@/lib/mock/mockCertificates";
import { useState } from "react";

export const useCertificateState = () => {
  const [certificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>(
    MOCK_CERTIFICATES[0]
  );
  const [selectedElement, setSelectedElement] =
    useState<CertificateElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [activeSidebarFeature, setActiveSidebarFeature] = useState<"templates" | "elements" | "settings">("templates");

  const createBlankCertificate = () => {
    const blankCertificate: Certificate = {
      id: Date.now(),
      name: "Blank Certificate",
      category: "custom",
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      elements: [],
    };

    setSelectedCertificate(blankCertificate);
    setSelectedElement(null);
  };

  const addTextElement = () => {
    const newElement: CertificateElement = {
      id: Date.now(),
      type: "text",
      content: "New Text",
      x: selectedCertificate.width / 2,
      y: selectedCertificate.height / 2,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      textAlign: "center",
      fontWeight: "normal",
    };

    setSelectedCertificate((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElement(newElement);
  };

  const addShapeElement = (shapeType: "rectangle" | "circle") => {
    const newElement: CertificateElement = {
      id: Date.now(),
      type: shapeType,
      content: "",
      x: selectedCertificate.width / 2,
      y: selectedCertificate.height / 2,
      width: 100,
      height: 100,
      fillColor: "#3B82F6",
      strokeColor: "#1E40AF",
      strokeWidth: 2,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      textAlign: "center",
    };

    setSelectedCertificate((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElement(newElement);
  };

  const updateElement = (elementId: number, property: string, value: any) => {
    setSelectedCertificate((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === elementId ? { ...element, [property]: value } : element
      ),
    }));

    if (selectedElement?.id === elementId) {
      setSelectedElement((prev) =>
        prev ? { ...prev, [property]: value } : null
      );
    }
  };

  const finishEditing = () => {
    if (selectedElement) {
      updateElement(selectedElement.id, "content", editingText);
    }
    setIsEditing(false);
    setEditingText("");
  };

  const handleEditingKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      finishEditing();
    } else if (event.key === "Escape") {
      setIsEditing(false);
      setEditingText("");
    }
  };

  const startInlineEditing = (element: CertificateElement) => {
    setSelectedElement(element);
    setIsEditing(true);
    setEditingText(element.content);
  };

  return {
    certificates,
    selectedCertificate,
    setSelectedCertificate,
    selectedElement,
    setSelectedElement,
    activeSidebarFeature,
    setActiveSidebarFeature,
    isEditing,
    setIsEditing,
    editingText,
    setEditingText,
    createBlankCertificate,
    addTextElement,
    addShapeElement,
    updateElement,
    finishEditing,
    handleEditingKeyDown,
    startInlineEditing,
  };
};