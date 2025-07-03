import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, CloudCheck, Loader, X } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    name: "Credential Designs",
    href: "/portal/certificate/credential-design",
    status: "complete",
  },
  { name: "Details", href: "/portal/certificate/details", status: "current" },
  { name: "Campaign Options", href: "/portal/certificate/campaign-options", status: "upcoming" },
  { name: "Recipients", href: "#", status: "upcoming" },
  { name: "Preview and Send", href: "#", status: "upcoming" },
];

const TopBar = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-12 sticky top-0">
      <Link href="/portal/user/compaigns">
        <Button variant="ghost" className="hover:rounded-full duration-300 cursor-pointer" size="icon">
          <X className="h-6 w-6" />
        </Button>
      </Link>
      <nav className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center">
            <Link href={step.href} className="flex items-center">
            <Loader className={cn("h-5 w-5", {
                  "text-teal-500":
                    step.status === "complete" || step.status === "current",
                  "text-gray-400": step.status === "upcoming",
                })}/>
             
              <span
                className={cn("ml-2 text-sm font-medium", {
                  "text-gray-900":
                    step.status === "complete" || step.status === "current",
                  "text-gray-500": step.status === "upcoming",
                })}
              >
                {step.name}
              </span>
            </Link>
            {index < steps.length - 1 && (
              <ChevronRight className="ml-4 h-5 w-5 text-gray-300" />
            )}
          </div>
        ))}
      </nav>
      <div className="flex items-center space-x-2">
        <CloudCheck className="h-5 w-5 text-teal-500" />
        <span className="text-sm font-medium text-teal-500">
          All changes saved
        </span>
      </div>
    </header>
  );
};

export default TopBar;
