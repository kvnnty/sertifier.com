"use client";

import RichTextEditor from "@/components/custom/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface EarningCriteriaComponentProps {
  onRemove: () => void;
}

export const EarningCriteriaComponent = ({
  onRemove,
}: EarningCriteriaComponentProps) => {
  const [editorContent, setEditorContent] = useState("");

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <h1 className="text-sm font-semibold mb-4">Earning Criteria</h1>
      <RichTextEditor
        value={editorContent}
        onChange={handleContentChange}
        attributesShown={true}
      />
      <h1 className="mt-2 text-sm text-gray-500">
        Specify the requirements to earn this credential. These will be
        displayed on the credential page as the official earning criteria.
      </h1>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FaTrashAlt className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </button>
    </div>
  );
};
