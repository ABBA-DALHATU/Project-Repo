import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationType } from "@/lib/types";

interface NotificationCardProps {
  notification: NotificationType;
  expanded?: boolean;
}

export function NotificationCard({
  notification,
  expanded = false,
}: NotificationCardProps) {
  const { user, message, createdAt, isRead } = notification;

  // Get initials for avatar fallback
  const initials = user.firstName.toUpperCase().slice(0, 2);

  // Format the date
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card
      className={`${
        isRead ? "bg-background" : "bg-muted/30"
      } transition-colors hover:bg-muted/20`}
    >
      <CardContent className={`p-3 ${expanded ? "p-4" : ""}`}>
        <div className="flex gap-3">
          <Avatar className={expanded ? "h-10 w-10" : "h-8 w-8"}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <p className="font-medium text-sm">{user.firstName}</p>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            <p
              className={`text-sm ${
                expanded ? "line-clamp-none" : "line-clamp-2"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
