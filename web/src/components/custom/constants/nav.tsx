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
    href: "/portal/user",
  },
  {
    label: "Send Certificates",
    icon: <SquarePlus />,
    href: "/portal/certificate",
  },
  {
    label: "Campaigns",
    icon: <SendHorizonal />,
    href: "/portal/user/compaigns",
  },
  {
    label: "Verification Page",
    icon: <Globe />,
    href: "/portal/user/verification-page",
  },
  {
    label: "Recipients",
    icon: <Users />,
    href: "/portal/user/recipients",
  },
  {
    label: "Analytics",
    icon: <ChartColumn />,
    href: "/portal/user/analytics",
  },
  {
    label: "Components",
    icon: <Component />,
    children: [
      {
        label: "Credential Designs",
        href: "/portal/user/components/credential-designs",
        icon: <Palette className="w-5 h-5" />,
      },
      {
        label: "Credential Details",
        href: "/portal/user/components/credential-details",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        label: "Email Templates",
        href: "/portal/user/components/email-templates",
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
        href: "/portal/user/advanced/collections",
        icon: <ScanQrCode className="w-5 h-5" />,
      },
      {
        label: "Integrations",
        href: "/portal/user/advanced/integrations",
        icon: <Network className="w-5 h-5" />,
      },
      {
        label: "Ads",
        href: "/portal/user/advanced/ads",
        icon: <Megaphone className="w-5 h-5" />,
      },
      {
        label: "Customer Portal",
        href: "/portal/user/advanced/customer-portal",
        icon: <LayoutPanelTop className="w-5 h-5" />,
      },
    ],
  },
];
