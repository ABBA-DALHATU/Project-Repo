"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onAuthenticate, updateUserRole } from "@/actions";
import { Role } from "@prisma/client";
// import { clerkClient } from "@clerk/nextjs/server";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const response = await onAuthenticate();
      const user = response.data; // Explicitly type the user

      if (!user || !user.id) return; // Check if user is null or id is not present
      setUserId(user.id); // Now TypeScript knows user.id exists
    };

    getUser();
  }, []);

  const handleRoleSelection = async () => {
    console.log("this is the userId 💀😁😁💀😁💀😁😁❌", userId);
    if (!selectedRole || !userId) return;

    setIsSubmitting(true);

    try {
      // Update the user's role in the database
      const userData = await updateUserRole(userId, selectedRole);

      // Update the user's Clerk metadata

      if (userData) {
        router.push(`/auth/callback`);
      }
    } catch (error) {
      console.error("Error setting role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to ProjectHub
          </h1>
          <p className="text-muted-foreground mt-2">
            Please select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === Role.STUDENT
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedRole(Role.STUDENT)}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Student</CardTitle>
              <CardDescription>
                Upload projects and get feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Submit projects for review
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Get feedback from supervisors
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Explore other projects for inspiration
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0 flex justify-center">
              {selectedRole === Role.STUDENT && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-primary text-primary-foreground rounded-full p-1"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
              )}
            </CardFooter>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === Role.SUPERVISOR
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedRole(Role.SUPERVISOR)}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <UserCog className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Supervisor</CardTitle>
              <CardDescription>
                Review and grade student projects
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Review student submissions
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Check for plagiarism
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  Provide feedback and grades
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0 flex justify-center">
              {selectedRole === Role.SUPERVISOR && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-primary text-primary-foreground rounded-full p-1"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            className="w-full max-w-md"
          >
            {isSubmitting ? "Setting up your account..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
