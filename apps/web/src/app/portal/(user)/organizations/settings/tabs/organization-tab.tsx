"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/config/axios.config";
import { useOrganizationManager } from "@/hooks/useOrganizationManager";
import { useOrganization } from "@/lib/store/features/organization/organization.selector";
import { Organization } from "@/types/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().min(1, "Slug is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  logo: z.string().optional(),
  contactInfo: z.object({
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    }),
  }),
  subscriptionPlan: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export default function OrganizationTab() {
  const { currentOrganization } = useOrganization();
  const { selectOrganization, loadOrganizations } = useOrganizationManager();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      website: "",
      description: "",
      logo: "",
      contactInfo: {
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      },
      subscriptionPlan: "",
    },
  });

  useEffect(() => {
    if (!currentOrganization?._id) return;
    const fetchOrganization = async () => {
      try {
        const res = await axiosClient.get<Organization>(`/organizations/${currentOrganization._id}`);
        form.reset(res.data);
      } catch (err) {
        console.error("Failed to fetch organization", err);
      }
    };
    fetchOrganization();
  }, [currentOrganization?._id, form]);

  const onSubmit = async (data: OrganizationFormValues) => {
    if (!currentOrganization?._id) return;

    try {
      const response = await axiosClient.put(`/organizations/${currentOrganization._id}`, data);
      toast.success(response.data.message);
      selectOrganization(response.data.organization);
      loadOrganizations();
    } catch (err) {
      console.error("Failed to update organization", err);
      toast.error("Failed to update organization");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Overview
          </CardTitle>
          <CardDescription>Basic information and branding settings for your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" {...form.register("slug")} />
                {form.formState.errors.slug && <p className="text-red-500 text-sm">{form.formState.errors.slug.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...form.register("website")} />
                {form.formState.errors.website && <p className="text-red-500 text-sm">{form.formState.errors.website.message}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={form.getValues("logo") || "/placeholder.svg"} />
                    <AvatarFallback>{form.getValues("name")?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" type="button">
                    Change Logo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" {...form.register("contactInfo.email")} />
              {form.formState.errors.contactInfo?.email && <p className="text-red-500 text-sm">{form.formState.errors.contactInfo.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input id="contact-phone" {...form.register("contactInfo.phone")} />
            </div>
          </div>
          <div className="space-y-4">
            <Label>Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Street" {...form.register("contactInfo.address.street")} />
              <Input placeholder="City" {...form.register("contactInfo.address.city")} />
              <Input placeholder="State" {...form.register("contactInfo.address.state")} />
              <Input placeholder="ZIP Code" {...form.register("contactInfo.address.zipCode")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
