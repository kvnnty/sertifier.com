"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import { useOrganization } from "@/lib/store/features/organization/organization.selector";
import { OrganizationMember } from "@/types/organization-member";
import { Crown, MoreHorizontal, Shield, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import InviteMemberDialog from "./components/invite-member";

export default function MembersTab() {
  const { currentOrganization } = useOrganization();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosClient.get(`/organizations/${currentOrganization?._id}/members`);
        setMembers(response.data.members || []);
      } catch (error) {
        console.error("Failed to fetch members", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      suspended: "destructive",
      left: "outline",
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const getRoleIcon = (permissions: string[]) => {
    if (permissions.includes("*")) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (permissions.includes("manage_users")) return <Shield className="h-4 w-4 text-blue-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return <div className="p-6">Loading members...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* User Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{members.filter((m) => m.status === "active").length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{members.filter((m) => m.status === "pending").length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">143</div>
              <div className="text-sm text-gray-600">Credentials</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">43</div>
              <div className="text-sm text-gray-600">Templates</div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage user permissions and access</CardDescription>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>Invite Member</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.user.firstName[0]}
                            {member.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {member.user.firstName} {member.user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{member.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.permissions)}
                        <span>{member.metadata?.displayRole}</span>
                      </div>
                      <span className="text-xs text-gray-500">{member.metadata?.notes}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        {member.permissions.map((perm) => (
                          <Badge key={perm} className="mr-1 mb-1" variant="secondary">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>View Activity</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Invite Member Dialog */}
      <InviteMemberDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
    </>
  );
}
