"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationPanel } from "./notification-panel";
import useNotification from "@/hooks/useNotification";

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { all, read, unread } = useNotification();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unread ? "(unread)" : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unread && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-red-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </Button>

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={all}
      />
    </div>
  );
}
