"use client";

import { SignUp } from "@clerk/nextjs";
import {
  ArrowLeft,
  MessageSquare,
  CheckCircle,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Animated illustration and info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 p-8 relative overflow-hidden">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        {mounted && (
          <motion.div
            className="flex flex-col justify-center items-center h-full w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center mb-8"
            >
              <MessageSquare className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">ProjectHub</h1>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold mb-8 text-center"
            >
              Join our community of students and supervisors
            </motion.h2>

            <div className="space-y-6 max-w-md">
              <motion.div
                variants={itemVariants}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">
                      Connect with Supervisors
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Direct messaging with your project supervisors for
                      real-time feedback and guidance.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-4">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">Manage Your Projects</h3>
                    <p className="text-sm text-muted-foreground">
                      Submit, track, and receive feedback on your projects all
                      in one place.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">Streamlined Workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Simplified process from submission to approval with status
                      tracking.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-12 text-center text-sm text-muted-foreground"
            >
              <p>Already have an account? Sign in after registration.</p>
            </motion.div>
          </motion.div>
        )}

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mounted && (
            <>
              <motion.div
                className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-primary/5"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute bottom-[15%] left-[5%] w-48 h-48 rounded-full bg-primary/10"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Right side - Sign Up form */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <Link
            href="/"
            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold">ProjectHub</span>
          </div>
          <div className="w-[60px]"></div> {/* Spacer for centering */}
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Join ProjectHub to connect with supervisors and manage your
                projects.
              </p>
            </div>

            <div className="bg-background rounded-xl shadow-lg p-1 md:p-2 border">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none p-6",
                    header: "text-center",
                    headerTitle: "text-2xl font-bold",
                    headerSubtitle: "text-muted-foreground",
                    formButtonPrimary:
                      "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all",
                    formFieldLabel: "text-foreground font-medium",
                    formFieldInput:
                      "border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                    footer: "text-center text-sm text-muted-foreground",
                    footerActionLink:
                      "text-primary hover:text-primary/80 font-medium",
                  },
                }}
                routing="path"
                path="/auth/sign-up"
                signInUrl="/auth/sign-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
