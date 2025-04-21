// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import {
//   ArrowRight,
//   CheckCircle,
//   MessageSquare,
//   FileText,
//   Users,
// } from "lucide-react";

// export default function Home() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignUp = () => {
//     setIsLoading(true);
//     router.push("/auth/sign-up");
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navigation */}
//       <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <MessageSquare className="h-6 w-6 text-primary" />
//             <span className="text-xl font-bold">ProjectHub</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <UserButton />
//             <Button
//               variant="outline"
//               onClick={handleSignUp}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <div className="h-4 w-4 mr-2 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                   Loading...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex-1 flex flex-col md:flex-row">
//         <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 md:max-w-[50%]">
//           <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl md:mx-0">
//             <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-primary">
//               Streamline Your Project Submissions
//             </h1>
//             <p className="mt-6 text-lg text-muted-foreground">
//               Connect students with supervisors, manage project submissions, and
//               collaborate efficiently in one platform.
//             </p>
//             <div className="mt-8 space-y-4">
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
//                 <p className="text-sm">
//                   Direct messaging between students and supervisors
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
//                 <p className="text-sm">
//                   Streamlined project submission and review process
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
//                 <p className="text-sm">
//                   Track project status and receive feedback in real-time
//                 </p>
//               </div>
//             </div>
//             <div className="mt-10">
//               <Button
//                 size="lg"
//                 className="w-full sm:w-auto px-8 py-6 text-lg"
//                 onClick={handleSignUp}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="h-4 w-4 mr-2 border-t-2 border-b-2 border-primary-foreground rounded-full animate-spin"></div>
//                     Loading...
//                   </div>
//                 ) : (
//                   <>
//                     Get Started
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center p-8">
//           <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm flex items-center justify-center">
//               <div className="grid grid-cols-2 gap-4 p-6 w-full max-w-md">
//                 <div className="col-span-2 bg-background rounded-lg p-4 shadow-md">
//                   <div className="flex items-center gap-3 mb-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     <span className="font-medium">Student-Supervisor Chat</span>
//                   </div>
//                   <div className="h-24 bg-muted/50 rounded-md"></div>
//                 </div>
//                 <div className="bg-background rounded-lg p-4 shadow-md">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="h-4 w-4 text-primary" />
//                     <span className="font-medium text-sm">Projects</span>
//                   </div>
//                   <div className="h-16 bg-muted/50 rounded-md"></div>
//                 </div>
//                 <div className="bg-background rounded-lg p-4 shadow-md">
//                   <div className="flex items-center gap-2 mb-2">
//                     <MessageSquare className="h-4 w-4 text-primary" />
//                     <span className="font-medium text-sm">Messages</span>
//                   </div>
//                   <div className="h-16 bg-muted/50 rounded-md"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t py-6 md:py-0">
//         <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
//           <p className="text-sm text-muted-foreground">
//             © {new Date().getFullYear()} ProjectHub. All rights reserved.
//           </p>
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="sm">
//               Privacy
//             </Button>
//             <Button variant="ghost" size="sm">
//               Terms
//             </Button>
//             <Button variant="ghost" size="sm">
//               Contact
//             </Button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Layers,
  Users,
  MessageSquare,
  BarChart2,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-9">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="font-bold text-xl">Project-Repo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:[background:radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center py-16 md:py-24">
          <div className="flex flex-col items-start gap-4 lg:w-1/2">
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300">
              New Version 2.0
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Streamline Academic Project Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              UniTrack connects students and supervisors, simplifies project
              submissions, and provides powerful tools for academic
              collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Button size="lg" variant="outline">
                Book a Demo
              </Button> */}
            </div>
            {/* <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-2">
                <img
                  className="h-8 w-8 rounded-full border-2 border-background"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-background"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-background"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="font-medium">500+</span>{" "}
                universities worldwide
              </p>
            </div> */}
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl"></div>
              <div className="relative rounded-xl border bg-card p-1 shadow-xl">
                <img
                  src="/app_preview.png"
                  alt="Dashboard Preview"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      {/* <section className="border-t border-b bg-muted/40">
        <div className="container px-4 md:px-6 py-12">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            TRUSTED BY LEADING UNIVERSITIES
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="h-8 w-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  University {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to manage academic projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              UniTrack provides a comprehensive set of tools for students and
              supervisors to collaborate effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Project Submissions</h3>
                <p className="text-muted-foreground">
                  Streamlined submission process with version control and
                  feedback tracking.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "File uploads",
                    "Version history",
                    "Plagiarism detection",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Student-Supervisor Matching
                </h3>
                <p className="text-muted-foreground">
                  Intelligent matching system based on research interests and
                  availability.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Profile matching",
                    "Availability tracking",
                    "Research interest alignment",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Integrated Messaging</h3>
                <p className="text-muted-foreground">
                  Direct communication between students and supervisors with
                  context-aware messaging.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Real-time chat", "File sharing", "Meeting scheduling"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics for tracking progress, submissions,
                  and feedback.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Progress tracking",
                    "Submission analytics",
                    "Feedback metrics",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Plagiarism Detection</h3>
                <p className="text-muted-foreground">
                  Advanced plagiarism detection to ensure academic integrity.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Content comparison",
                    "Source identification",
                    "Similarity reports",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M8 11h8" />
                    <path d="M12 15V7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Compliant</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security and compliance with academic
                  standards.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "GDPR compliant",
                    "Data encryption",
                    "Role-based access",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple and effective project management
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              UniTrack streamlines the entire academic project lifecycle from
              start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                step: "01",
                title: "Connect",
                description:
                  "Students and supervisors create profiles and connect based on research interests.",
                icon: Users,
              },
              {
                step: "02",
                title: "Collaborate",
                description:
                  "Work together on projects with integrated messaging and file sharing.",
                icon: MessageSquare,
              },
              {
                step: "03",
                title: "Complete",
                description:
                  "Submit, review, and approve projects with comprehensive feedback.",
                icon: CheckCircle,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -top-6 -left-6 text-7xl font-bold text-muted-foreground/10">
                  {item.step}
                </div>
                <div className="relative bg-background rounded-lg p-6 shadow-sm border">
                  <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4 dark:bg-indigo-900">
                    <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative max-w-3xl w-full">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl"></div>
              <div className="relative rounded-xl border bg-card p-1 shadow-xl">
                <img
                  src="/app_preview.png"
                  alt="Platform Overview"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Trusted by educators and students
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              See what our users have to say about their experience with
              UniTrack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "UniTrack has transformed how I manage student projects. The plagiarism detection and feedback system save me hours every week.",
                name: "Dr. Sarah Mitchell",
                role: "Professor of Computer Science",
                avatar: "/placeholder.svg?height=64&width=64",
              },
              {
                quote:
                  "As a student, I love how easy it is to submit my work and communicate with my supervisor. The progress tracking keeps me on schedule.",
                name: "Alex Johnson",
                role: "PhD Student",
                avatar: "/placeholder.svg?height=64&width=64",
              },
              {
                quote:
                  "The analytics dashboard gives our department valuable insights into student progress and supervisor workload.",
                name: "Dr. Michael Brown",
                role: "Department Head",
                avatar: "/placeholder.svg?height=64&width=64",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="inline-block text-yellow-400"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="flex-1 text-lg italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              Choose the plan that's right for your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small departments",
                features: [
                  "Up to 50 users",
                  "Basic project management",
                  "Email support",
                  "1 GB storage per user",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "$299",
                description: "Ideal for medium-sized institutions",
                features: [
                  "Up to 500 users",
                  "Advanced project management",
                  "Plagiarism detection",
                  "Priority support",
                  "10 GB storage per user",
                ],
                cta: "Get Started",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large universities and organizations",
                features: [
                  "Unlimited users",
                  "Custom integrations",
                  "Advanced analytics",
                  "Dedicated account manager",
                  "Unlimited storage",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`bg-background relative ${
                  plan.popular
                    ? "border-indigo-600 dark:border-indigo-400 border-2"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <Button variant="outline">Compare All Features</Button>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Ready to transform your academic project management?
              </h2>
              <p className="text-xl text-indigo-100 max-w-[800px] mb-8">
                Join thousands of universities worldwide that trust UniTrack for
                their project management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-indigo-700"
                >
                  Schedule a Demo
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <span className="font-bold text-xl">Project-Repo</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xs">
                Streamlining academic project management for universities and
                educational institutions worldwide.
              </p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Pricing",
                  "Testimonials",
                  "Demo",
                  "Documentation",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Careers", "Blog", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Terms", "Privacy", "Cookies", "Security", "Compliance"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Project-Repo. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
