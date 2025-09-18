import {
  BookOpen,
  ChartColumn,
  Component,
  Globe,
  LayoutDashboard,
  LayoutPanelTop,
  Mail,
  Megaphone,
  Network,
  Palette,
  ScanQrCode,
  SendHorizonal,
  SquarePlus,
  Star,
  Users
} from "lucide-react";

export const SIDEBAR_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard />,
    href: "/portal",
  },
  {
    label: "Send Certificates",
    icon: <SquarePlus />,
    href: "/portal/certificate",
  },
  {
    label: "Campaigns",
    icon: <SendHorizonal />,
    href: "/portal/compaigns",
  },
  {
    label: "Verification Page",
    icon: <Globe />,
    href: "/portal/verification-page",
  },
  {
    label: "Recipients",
    icon: <Users />,
    href: "/portal/recipients",
  },
  {
    label: "Analytics",
    icon: <ChartColumn />,
    href: "/portal/analytics",
  },
  {
    label: "Components",
    icon: <Component />,
    children: [
      {
        label: "Credential Designs",
        href: "/portal/components/credential-designs",
        icon: <Palette className="w-5 h-5" />,
      },
      {
        label: "Credential Details",
        href: "/portal/components/credential-details",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        label: "Email Templates",
        href: "/portal/components/email-templates",
        icon: <Mail className="w-5 h-5" />,
      },
    ],
  },
  {
    label: "Advanced",
    icon: <Star />,
    children: [
      {
        label: "Collections",
        href: "/portal/advanced/collections",
        icon: <ScanQrCode className="w-5 h-5" />,
      },
      {
        label: "Integrations",
        href: "/portal/advanced/integrations",
        icon: <Network className="w-5 h-5" />,
      },
      {
        label: "Ads",
        href: "/portal/advanced/ads",
        icon: <Megaphone className="w-5 h-5" />,
      },
      {
        label: "Customer Portal",
        href: "/portal/advanced/customer-portal",
        icon: <LayoutPanelTop className="w-5 h-5" />,
      },
    ],
  },
];
