"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Image as ImageIcon,
  PaintBucket,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  attributesShown?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  attributesShown = false,
}) => {
  const [fontSize, setFontSize] = useState("13px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffffff");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md border border-gray-300",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#086956] underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
    },
  });

  const setFontSizeCommand = useCallback(
    (size: string) => {
      editor?.chain().focus().setFontSize(size).run();
      setFontSize(size);
    },
    [editor]
  );

  const setFontFamilyCommand = useCallback(
    (family: string) => {
      editor?.chain().focus().setFontFamily(family).run();
      setFontFamily(family);
    },
    [editor]
  );

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          editor?.chain().focus().setImage({ src: base64 }).run();
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [editor]);

  const setTextColorCommand = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setTextColor(color);
    },
    [editor]
  );

  const setHighlightColorCommand = useCallback(
    (color: string) => {
      editor
        ?.chain()
        .focus()
        .setMark("textStyle", { backgroundColor: color })
        .run();
      setHighlightColor(color);
    },
    [editor]
  );

  const handleAddLink = useCallback(() => {
    if (linkUrl) {
      if (linkText) {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl, target: "_blank" })
          .insertContent(linkText)
          .run();
      } else {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl, target: "_blank" })
          .run();
      }
    }
    setLinkUrl("");
    setLinkText("");
    setIsLinkDialogOpen(false);
  }, [editor, linkUrl, linkText]);

  const handleRemoveLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
    setLinkUrl("");
    setLinkText("");
    setIsLinkDialogOpen(false);
  }, [editor]);

  const setTextAlignment = useCallback(
    (alignment: "left" | "center" | "right" | "justify") => {
      editor?.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  const handleAttributeChange = (value: string) => {
    if (value && !["Attributes", "RECIPIENT", "CREDENTIAL"].includes(value)) {
      editor?.chain().focus().insertContent(`[${value}]`).run();
    }
  };

  const getActiveAlignment = () => {
    if (editor?.isActive({ textAlign: "left" })) return "left";
    if (editor?.isActive({ textAlign: "center" })) return "center";
    if (editor?.isActive({ textAlign: "right" })) return "right";
    if (editor?.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  if (!editor) return <p>Loading editor...</p>;

  const activeAlignment = getActiveAlignment();
  const alignmentIcons = {
    left: <AlignLeft className="h-4 w-4" />,
    center: <AlignCenter className="h-4 w-4" />,
    right: <AlignRight className="h-4 w-4" />,
    justify: <AlignJustify className="h-4 w-4" />,
  };

  return (
    <div className="border-[1px] border-gray-200 p-5 rounded-md">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select value={fontFamily} onValueChange={setFontFamilyCommand}>
          <SelectTrigger className="w-[120px] border border-gray-300 rounded-md p-2 h-8">
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fontSize} onValueChange={setFontSizeCommand}>
          <SelectTrigger className="w-[80px] outline-none border border-gray-300 p-2 h-8">
            <SelectValue placeholder="13px" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10px">10px</SelectItem>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="13px">13px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="18px">18px</SelectItem>
            <SelectItem value="24px">24px</SelectItem>
            <SelectItem value="36px">36px</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 px-2 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 px-2 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 px-2 ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <PaintBucket className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-col gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColorCommand(e.target.value)}
                className="w-10 h-8 cursor-pointer"
              />
              <span className="text-xs text-center">Text Color</span>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-col gap-2">
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColorCommand(e.target.value)}
                className="w-10 h-8 cursor-pointer"
              />
              <span className="text-xs text-center">Highlight</span>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 px-2 ${
                editor.isActive("link") ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                const previousUrl = editor?.getAttributes("link").href;
                if (previousUrl) {
                  setLinkUrl(previousUrl);
                }
              }}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Link URL</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL *
                </Label>
                <Input
                  id="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="col-span-3 border-[1px] border-[#086956] rounded-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                  Text *
                </Label>
                <Input
                  id="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                  className="col-span-3 border-[1px] border-[#086956] rounded-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Remove
              </Button>
              <Button
                onClick={handleAddLink}
                style={{ backgroundColor: "#086956" }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={addImage}
          className="h-8 px-2"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 px-2 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 px-2 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
              {alignmentIcons[activeAlignment]}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTextAlignment("left")}>
              <AlignLeft className="mr-2 h-4 w-4" />
              <span>Left</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlignment("center")}>
              <AlignCenter className="mr-2 h-4 w-4" />
              <span>Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlignment("right")}>
              <AlignRight className="mr-2 h-4 w-4" />
              <span>Right</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlignment("justify")}>
              <AlignJustify className="mr-2 h-4 w-4" />
              <span>Justify</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {attributesShown && (
          <Select onValueChange={handleAttributeChange}>
            <SelectTrigger className="w-[120px] border border-gray-300 rounded-md p-2 h-8">
              <SelectValue placeholder="Attributes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Attributes" disabled>
                Attributes
              </SelectItem>
              <h1 className="text-[#187361] pl-2 text-xs font-semibold">
                RECIPIENT
              </h1>
              <SelectItem value="Recipient Name">Recipient Name</SelectItem>
              <SelectItem value="Recipient E-Mail">Recipient E-Mail</SelectItem>
              <hr className="my-1" />
              <h1 className="text-[#187361] pl-2 text-xs font-semibold">
                CREDENTIAL
              </h1>
              <SelectItem value="Credential ID">Credential ID</SelectItem>
              <SelectItem value="Issue Date">Issue Date</SelectItem>
              <SelectItem value="Credential Name">Credential Name</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      <hr className="my-4" />
      <EditorContent
        editor={editor}
        style={{
          fontSize,
          fontFamily,
          backgroundColor: "white",
          minHeight: "300px",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
