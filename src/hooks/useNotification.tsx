import { getAllNotifications } from "@/actions";
import { NotificationType } from "@/lib/types";
import { useState, useEffect } from "react";

// Define the Notification typ

const useNotification = () => {
  const [notifications, setNotifications] = useState<{
    read: NotificationType[];
    unread: NotificationType[];
    all: NotificationType[];
  }>({
    read: [],
    unread: [],
    all: [],
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getAllNotifications();
        if (data) {
          setNotifications(data); // Ensure data matches the defined type
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return notifications;
};

export default useNotification;
