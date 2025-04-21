"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationCard } from "./notification-card";
import { NotificationType } from "@/lib/types";
import { createPortal } from "react-dom";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationType[];
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) {
  // const { userId } = useParams();
  // useEffect(() => {
  //   const read = async () => {
  //     try {
  //       await makeAllRead(Array.isArray(userId) ? userId[0] : userId);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   read();
  // }, [userId]);
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-y-0 right-0 z-[100] w-full sm:w-80 md:w-96 shadow-xl transition-transform duration-300 ease-in-out transform bg-background border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          {/* <Link
            href="/notifications"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>,
    document.body
  );
}
