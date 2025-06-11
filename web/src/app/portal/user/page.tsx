import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import React from "react";

const suggestions = [
  {
    title:
      "A completion certificate for participants who have successfully finished our ‘Advanced Digital Marketing’ online course.",
    button: "Try This",
    type: "red",
  },
  {
    title:
      "A participation certificate for attendees of our Annual AI & Machine Learning Summit, which brought together industry experts, ...",
    button: "Try This",
    type: "green",
  },
  {
    title:
      "A recognition certificate for employees who have completed our six-month internal Leadership Development Program. This...",
    button: "Try This",
    type: "blue",
  },
  {
    title:
      "An achievement certificate for students who successfully developed and launched a fully functional mobile application as part of our...",
    button: "Try This",
    type: "green",
  },
];

export default function UserDashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* Gradient Heading */}
      <h1 className="text-4xl font-bold text-center mb-6">
        <span className="bg-gradient-to-r from-red-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          What are we creating a certificate for today?
        </span>
      </h1>
      {/* Description Textarea */}
      <textarea
        className="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg mb-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Provide a detailed description of the certificate. Include the purpose of the certificate, the audience it is intended for, and the specific achievement or event being recognized. The more you share, the better we can craft it!"
      />
      {/* Send Certificates Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-gradient-to-r from-pink-400 via-purple-400 to-green-400 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-md hover:opacity-90 transition">
          Send Certificates
        </Button>
      </div>
      {/* Skip and create manually */}
      <div className="mb-4 font-semibold text-gray-700">
        Skip and create manually
      </div>
      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[180px]"
          >
            <div className="text-base font-medium text-gray-800 mb-4 line-clamp-3">
              {s.title}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="text-sm font-semibold text-gray-600 flex items-center gap-1 hover:underline">
                    See All
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 text-sm text-gray-500">
                    Full description and more options...
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button
                variant="ghost"
                className={
                  s.type === "red"
                    ? "text-red-500 border border-red-200 bg-red-50 hover:bg-red-100"
                    : s.type === "green"
                    ? "text-green-600 border border-green-200 bg-green-50 hover:bg-green-100"
                    : "text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100"
                }
              >
                {s.button}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
