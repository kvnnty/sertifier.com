"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

export default function VerificationPage() {
  const [isLive, setIsLive] = useState(true);
  const [credentialUrl, setCredentialUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [hostname, setHostname] = useState("");
  const [aliasOf, setAliasOf] = useState("");
  const [ttl, setTtl] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Website Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Website Customization Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium text-gray-700">
                Website Customization Live
              </Label>
              <p className="text-sm text-gray-500">
                Your website can be accessed, viewed, and found in search
                results.
              </p>
            </div>
            <Switch
              checked={isLive}
              onCheckedChange={setIsLive}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Visit Website Button */}
          <Button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2">
            Visit website
          </Button>

          {/* Credential Website URL */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-700">
              Credential Website URL
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                className="flex-1"
                placeholder="Enter URL"
              />
              <span className="text-gray-600">.verified.cv</span>
            </div>
            <p className="text-sm text-gray-500">
              This is the auto-generated webpage for your credential. It will be
              displayed at this domain.
            </p>
          </div>

          {/* Custom Domain Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-gray-700">
                Your Custom Domain
              </Label>
              <Button variant="link" className="text-orange-500 text-sm p-0">
                Collapse Setup Details
              </Button>
            </div>

            <Input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full"
              placeholder="Enter custom domain"
            />

            <p className="text-sm text-gray-600">
              To use a custom domain, expand setup details and follow the
              instructions.{" "}
              <span className="font-medium">
                Before saving, create the DNS records with the details provided.
              </span>
            </p>

            {/* DNS Records Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                <div>HOSTNAME</div>
                <div>IS AN ALIAS OF</div>
                <div>TTL</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Input
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(hostname)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="relative">
                  <Input
                    value={aliasOf}
                    onChange={(e) => setAliasOf(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(aliasOf)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="relative">
                  <Input
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(ttl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CNAME Instructions */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              To access the website using your custom domain, create a{" "}
              <span className="font-semibold">CNAME</span> DNS record with the
              values provided above.
            </p>
            <p className="text-sm text-gray-600">
              Your hosted verified.cv URL will always be accessible without any
              additional configuration.
            </p>
          </div>

          {/* Save Changes Button */}
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2">
            Save Changes
          </Button>

          {/* Website Design & Global Settings Section */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Website Design & Global Settings
              </h3>
              <p className="text-sm text-gray-600">
                Use the website builder to customize the layout and edit global
                settings of your website.
              </p>
            </div>

            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2">
              Go to Website Builder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
