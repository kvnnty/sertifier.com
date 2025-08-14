"use client";

import Spinner from "@/components/loaders/Spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axiosClient from "@/config/axios.config";
import { useOrganization } from "@/lib/store/features/organization/organization.selector";
import { useState } from "react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PermissionConfig {
  key: string;
  label: string;
  description: string;
  permissions: string[];
}

const permissionConfigs: PermissionConfig[] = [
  {
    key: "credential_send",
    label: "Credential Send",
    description: "Let users send credential campaigns.",
    permissions: ["credentials.send"],
  },
  {
    key: "credentials",
    label: "Credentials",
    description: "Let users create, view, and edit credential campaigns.",
    permissions: ["credentials.create", "credentials.read", "credentials.update"],
  },
  {
    key: "credential_details",
    label: "Credential Details",
    description: "Let users create, view, and edit credential details.",
    permissions: ["templates.create", "templates.read", "templates.update"],
  },
];

export default function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const { currentOrganization } = useOrganization();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handlePermissionToggle = (permissionConfig: PermissionConfig, enabled: boolean) => {
    const newPermissions = new Set(selectedPermissions);

    if (enabled) {
      permissionConfig.permissions.forEach((permission) => newPermissions.add(permission));
    } else {
      permissionConfig.permissions.forEach((permission) => newPermissions.delete(permission));
    }

    setSelectedPermissions(newPermissions);
  };

  const isPermissionGroupEnabled = (permissionConfig: PermissionConfig) => {
    return permissionConfig.permissions.some((permission) => selectedPermissions.has(permission));
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Email required", {
        description: "Please enter an email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosClient.post(`/organizations/${currentOrganization?._id}/members/invite`, {
        email,
        permissions: Array.from(selectedPermissions),
        metadata: {
          displayRole: selectedPermissions.has("credentials.create") ? "Manager" : "Member",
        },
      });

      toast.success(response.data.message, {
        description: `Invitation has been sent to ${email}`,
      });

      setEmail("");
      setSelectedPermissions(new Set());
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to send invitation", {
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setSelectedPermissions(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Add a new user with specific permissions. You can edit details later.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="janedoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="space-y-4">
              {permissionConfigs.map((config) => (
                <div key={config.key} className="flex items-start justify-between space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-sm text-gray-600">{config.description}</div>
                  </div>
                  <Switch checked={isPermissionGroupEnabled(config)} onCheckedChange={(checked) => handlePermissionToggle(config, checked)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading} className="min-w-[100px]">
            {isLoading ? <Spinner /> : "Invite member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
