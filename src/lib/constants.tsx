import { ReactNode } from "react";
// import {
//   Bell,
//   CreditCard,
//   FileDuoToneBlack,
//   Settings,
// } from "@/components/icons";
import {
  Compass,
  FileText,
  LayoutDashboard,
  MessageCircleCode,
} from "lucide-react";

import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export const MENU_ITEMS = (
  userId: string,
  role: Role
): Array<{ title: string; href: string; icon: ReactNode }> => {
  if (role === Role.STUDENT) {
    return [
      {
        title: "Dashboard",
        href: `/dashboard/${userId}`,
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      },
      {
        title: "Explore",
        href: `/dashboard/${userId}/explore`,
        icon: <Compass className="mr-2 h-4 w-4" />,
      },

      {
        title: "My Submissions",
        href: `/dashboard/${userId}/student-submissions`,
        icon: <FileText className="mr-2 h-4 w-4" />,
      },
      {
        title: "Message",
        href: `/dashboard/${userId}/messages`,
        icon: <MessageCircleCode className="mr-2 h-4 w-4" />,
      },
    ];
  }

  if (role === Role.SUPERVISOR) {
    return [
      {
        title: "Dashboard",
        href: `/dashboard/${userId}`,
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      },
      {
        title: "Explore",
        href: `/dashboard/${userId}/explore`,
        icon: <Compass className="mr-2 h-4 w-4" />,
      },
      {
        title: "Submissions",
        href: `/dashboard/${userId}/supervisor-submissions`,
        icon: <FileText className="mr-2 h-4 w-4" />,
      },
      // {
      //   title: "My students",
      //   href: `/dashboard/${userId}/billing`,
      //   icon: <Users className="mr-2 h-4 w-4" />,
      // },
      {
        title: "Message",
        href: `/dashboard/${userId}/messages`,
        icon: <MessageCircleCode className="mr-2 h-4 w-4" />,
      },
    ];
  }

  return [];
};

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <AlertCircle className="w-3 h-3 mr-1" /> Under Review
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export const renderPlagiarismBadge = (score: number) => {
  if (score > 50) {
    return (
      <Badge className="bg-red-500 hover:bg-red-600 z-10">{score}% Match</Badge>
    );
  } else if (score > 10) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600 z-10">
        {score}% Match
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 z-10">
        {score}% Match
      </Badge>
    );
  }
};
