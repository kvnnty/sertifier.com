import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, SearchIcon } from "lucide-react";
import Image from "next/image";

export default function Collections() {
  return (
    <div>
      <div className="border-b border-gray-200 bg-white h-[70px] flex items-center justify-between px-8 sticky top-0 z-50">
        <Button className="hover:bg-teal-700 bg-teal-600 rounded-sm" size="sm">
          Create New Collection
        </Button>

        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-sm bg-background pl-8 md:w-[200px] lg:w-[336px]"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-8 max-h-screen overflow-hidden">
      {/* Illustration */}
      <Image
        src="/images/empty-state.png"
        alt="Empty state"
        width={400}
        height={400}
      />
      {/* Content */}
      <div className="text-center max-w-2xl overflow-y-hidden">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Let's Create Collection</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">Collections are used to organize your credentials. They work as catalogs that contain different credentials issued by your organization. Collections can be shared publicly to showcase your various credentials.</p>

        <Button
        //   onClick={onButtonClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Collection
        </Button>

        <div className="mt-4">
          <Button variant="link" className="text-gray-500 hover:text-gray-700 underline text-sm cursor-pointer ">
            Learn More
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}
