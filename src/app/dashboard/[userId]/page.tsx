import { getUser } from "@/actions";
import StudentDashboard from "@/components/student/StudentDashboard";
import TeacherDashboard from "@/components/teacher/SupervisorDashboard";
import React from "react";

type Props = {
  params: { userId: string };
};

const Page = async ({ params: { userId } }: Props) => {
  const userData = await getUser(userId);

  const userRole = userData?.role;

  console.log(userData, userRole);

  if (userRole === "STUDENT") return <StudentDashboard userId={userId} />;
  if (userRole === "SUPERVISOR") return <TeacherDashboard userId={userId} />;
};

export default Page;
