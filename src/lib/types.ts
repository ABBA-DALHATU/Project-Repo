import { getAllProjects } from "@/actions";
import { Prisma } from "@prisma/client";

export type ProjectType = Prisma.PromiseReturnType<typeof getAllProjects>[0];
export type NotificationType = {
  id: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};
