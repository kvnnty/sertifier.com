"use client";

import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Skills from "@/components/custom/portal/certificate/details/Skills";

const CredentialTitle = ({
  onTitleChange,
  onAttributeSelect,
}: {
  onTitleChange: (value: string) => void;
  onAttributeSelect: (value: string) => void;
}) => {
  return (
    <div className="mb-6 flex space-x-4 items-center">
      <div className="mb-4 w-[80%]">
        <Label htmlFor="credential-title" className="block mb-2 font-medium">
          Credential Title
        </Label>
        <Input
          id="credential-title"
          placeholder="Enter credential name"
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 p-2"
        />
      </div>

      <div className="w-[20%]">
        <Select onValueChange={onAttributeSelect}>
          <SelectTrigger className="w-full border border-gray-300 p-2">
            <SelectValue placeholder="Attributes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="ISSUER"
              disabled
              className="font-bold text-[#086956]"
            >
              ISSUER
            </SelectItem>
            <SelectItem value="Issuer Name">Issuer Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default function CertificateDetailsPage() {
  const [editorContent, setEditorContent] = useState("");
  const [credentialTitle, setCredentialTitle] = useState("");

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    console.log("Formatted Content:", content);
  };

  const handleTitleChange = (title: string) => {
    setCredentialTitle(title);
    console.log("Credential Title:", title);
  };

  const handleAttributeSelect = (attribute: string) => {
    console.log("Selected Attribute:", attribute);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-global">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <CredentialTitle
          onTitleChange={handleTitleChange}
          onAttributeSelect={handleAttributeSelect}
        />

        <h1 className="text-sm font-semibold mb-4">Credential Description</h1>
        <RichTextEditor
          value={editorContent}
          onChange={handleContentChange}
          attributesShown={true}
        />
        <Skills />
      </div>
    </div>
  );
}
