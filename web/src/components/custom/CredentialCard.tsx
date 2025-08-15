"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CredentialCardProps = {
  title: string;
  creationDate: string;
  recipientsCount: number;
  details: string;
  //   onEdit: () => void;
  //   onDelete: () => void;
};

export default function CredentialCard({
  title,
  creationDate,
  recipientsCount,
  details,
}: //   onEdit,
//   onDelete,
CredentialCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg hover:scale-103 duration-300 space-y-[-3rem]">
      <CardContent className="">
        {/* Design preview area */}
          <div className="bg-gray-100 w-full h-[150px]">
            <p className="text-gray-500 text-sm flex justify-center items-center h-full">
              No design added
            </p>
          </div>
          <div className="bottom-4 flex justify-center gap-4 py-4">
            <EyeIcon className="h-5 w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800" />
            <FileTextIcon className="h-5 w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800" />
          </div>
      </CardContent>

      {/* Credential details */}
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl font-semibold text-gray-800 mb-1">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-500 text-sm mb-4">
          Created on {creationDate} with {recipientsCount} recipient(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <p className="text-gray-700 text-base mb-6">
          {details || "No detail added"}
        </p>
      </CardContent>

      {/* Action buttons */}
      <CardFooter className="p-6 pt-0 flex justify-start gap-3">
        <Button
          //   onClick={onEdit}
          size="sm"
          className="px-12 bg-[#428f7d] text-white font-semibold py-2 rounded-md hover:bg-[#428f7d]/90 transition-colors"
        >
          Edit
        </Button>
        <Button
          //   onClick={onDelete}
          variant="outline"
          size="icon"
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Trash2Icon className="h-5 w-5 text-gray-600" />
        </Button>
      </CardFooter>
    </Card>
  );
}
