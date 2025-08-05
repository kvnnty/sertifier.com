import {
  Certificate,
  CertificateElement,
  MOCK_CERTIFICATES,
} from "@/lib/mock/mockCertificates";
import { useState } from "react";
import {
  CertificateSize,
  CERTIFICATE_SIZES,
  UploadedImage,
} from "@/components/custom/portal/certificate/credentialDesigns/sidebar";

export const useCertificateState = () => {
  const [certificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>(
    MOCK_CERTIFICATES[0]
  );
  const [selectedElement, setSelectedElement] =
    useState<CertificateElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [activeSidebarFeature, setActiveSidebarFeature] = useState<
    "templates" | "elements" | "settings" | "colorPicker"
  >("templates");
  const [certificateSize, setCertificateSize] =
    useState<CertificateSize>("A4 Landscape");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const createBlankCertificate = () => {
    const sizeConfig = CERTIFICATE_SIZES[certificateSize];

    const blankCertificate: Certificate = {
      id: Date.now(),
      name: "Blank Certificate",
      category: "custom",
      width: sizeConfig.width,
      height: sizeConfig.height,
      backgroundColor: "#ffffff",
      elements: [],
    };

    setSelectedCertificate(blankCertificate);
    setSelectedElement(null);
  };

  const handleCertificateSizeChange = (newSize: CertificateSize) => {
    setCertificateSize(newSize);

    // Update the selected certificate dimensions
    const sizeConfig = CERTIFICATE_SIZES[newSize];

    setSelectedCertificate((prev) => ({
      ...prev,
      width: sizeConfig.width,
      height: sizeConfig.height,
    }));
  };

  const handleImageUpload = (file: File) => {
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);

    // Add the image to the uploaded images list
    const newImage: UploadedImage = {
      id: `upload-${Date.now()}`,
      url: imageUrl,
      name: file.name,
      timestamp: Date.now(),
    };

    setUploadedImages((prev) => [newImage, ...prev]);

    // Create a new certificate with this image as background
    createCertificateFromUploadedImage(newImage);
  };

  const createCertificateFromUploadedImage = (image: UploadedImage) => {
    const sizeConfig = CERTIFICATE_SIZES[certificateSize];

    const newCertificate: Certificate = {
      id: Date.now(),
      name: `Certificate from ${image.name}`,
      category: "custom",
      width: sizeConfig.width,
      height: sizeConfig.height,
      backgroundColor: "#ffffff",
      backgroundImage: image.url,
      elements: [],
    };

    setSelectedCertificate(newCertificate);
    setSelectedElement(null);
  };

  const selectUploadedImage = (image: UploadedImage) => {
    createCertificateFromUploadedImage(image);
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
      fontStyle: "normal",
      textDecoration: "normal",
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
    if (element.type !== "text") return;

    setSelectedElement(element);
    setIsEditing(true);
    setEditingText(element.content);

    // Focus will be handled by the autoFocus attribute on the input
  };

  const deleteImage = (imageId: string) => {
    // Remove the image from the uploaded images list
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));

    // If the current certificate is using this image as background, keep the certificate but remove the background
    if (selectedCertificate?.backgroundImage) {
      const deletedImage = uploadedImages.find((img) => img.id === imageId);
      if (
        deletedImage &&
        selectedCertificate.backgroundImage === deletedImage.url
      ) {
        setSelectedCertificate((prev) => ({
          ...prev,
          backgroundImage: undefined,
        }));
      }
    }
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
    certificateSize,
    handleCertificateSizeChange,
    uploadedImages,
    handleImageUpload,
    selectUploadedImage,
    deleteImage,
  };
};
