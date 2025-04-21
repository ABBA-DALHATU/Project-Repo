"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  AlertTriangle,
  ExternalLink,
  Download,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProject, setApproved } from "@/actions"; // Adjust the import path as necessary
import { ProjectStatus } from "@prisma/client";
import { Loader } from "@/components/global/Loader";

// Project status enum to match your database model

// Project interface based on your database model
interface Project {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  studentId: string;
  supervisorId: string;
  status: ProjectStatus;
  plagiarismScore: number | null;
  plagiarismReport: PlagiarismReport;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    image?: string;
  };
  supervisor: {
    id: string;
    name: string;
    image?: string;
  };
}

interface PlagiarismReport {
  score: number;
  canAccess: boolean;
  totalNumberOfWords: number;
  plagiarismWords: number;
  identicalWordCounts: number;
  similarWordCounts: number;
  url: string;
  author: string;
  description: string;
  title: string;
  publishedDate: string;
  source: string;
  citation: boolean;
  plagiarismFound: {
    startIndex: number;
    endIndex: number;
    sequence: string;
  }[];
  is_excluded: boolean;
  similarWords: string[];
}

type Props = {
  params: { projectId: string };
};

export default function ProjectDetails({ params: { projectId } }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const projectData = await getProject(projectId); // Get the project data as it is

      // Create a new variable to format the project data
      const formattedProject: Project | null = projectData
        ? {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            fileUrl: projectData.fileUrl,
            studentId: projectData.studentId,
            supervisorId: projectData.supervisorId,
            status: projectData.status as ProjectStatus, // Cast status to ProjectStatus
            plagiarismScore: projectData.plagiarismScore,
            plagiarismReport: projectData.plagiarismReport || [], // Ensure it's an array
            createdAt: projectData.createdAt.toISOString(), // Convert Date to string
            updatedAt: projectData.updatedAt.toISOString(), // Convert Date to string
            student: {
              id: projectData.student.id,
              name: projectData.student.fullName,
              image: projectData.student.imageUrl,
            },
            supervisor: {
              id: projectData.supervisor.id,
              name: projectData.supervisor.fullName,
              image: projectData.supervisor.imageUrl,
            },
          }
        : null; // Set to null if projectData is undefined

      setProject(formattedProject); // Set the formatted project
    };
    fetchData();
  }, [projectId]);

  if (!project) {
    return <Loader size="lg" className="w-full h-full" />;
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case ProjectStatus.PENDING:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
      // case ProjectStatus.UNDER_REVIEW:
      //   return (
      //     <Badge className="bg-blue-500 hover:bg-blue-600">Under Review</Badge>
      //   );
      case ProjectStatus.REJECTED:
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle project approval
  const handleApproveProject = async (projectId: string) => {
    try {
      // Call the server action to approve the project
      const updatedProject = await setApproved(projectId);

      // Update the project state to reflect the changes
      setProject((prevProject) => ({
        ...prevProject!,
        status: ProjectStatus.APPROVED,
        updatedAt: new Date().toISOString(),
      }));

      // Refresh the page (optional, if needed)
      router.refresh();
    } catch (error) {
      console.error("Failed to approve project:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Submissions
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>Project Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {renderStatusBadge(project.status)}
              </div>
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Submitted on{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Last updated on{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={project.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Project File
                </a>
              </Button>

              {/* Approve Button */}
              {/* maybe */}
              {/* {project.status === ProjectStatus.PENDING && (
                <Button
                  onClick={() => handleApproveProject(project.id)}
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Project
                </Button>
              )} */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Members</CardTitle>
            <CardDescription>
              Student and Supervisor Information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={project.student.image}
                    alt={project.student.name}
                  />
                  <AvatarFallback>
                    {project.student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.student.name}</p>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={project.supervisor.image}
                    alt={project.supervisor.name}
                  />
                  <AvatarFallback>
                    {project.supervisor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.supervisor.name}</p>
                  <p className="text-sm text-muted-foreground">Supervisor</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Plagiarism Report</CardTitle>
            <CardDescription>
              Overall Plagiarism Score: {project.plagiarismScore}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={project.plagiarismScore || 0}
              className="h-2 mb-4"
            />
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <Accordion type="single" collapsible className="w-full">
                {project.plagiarismReport.map((report, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            report.score > 50
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        />
                        <span>{report.title}</span>
                        <Badge variant="outline">{report.score}% Match</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Source:</span>{" "}
                          {report.source}
                        </p>
                        <p>
                          <span className="font-medium">Description:</span>{" "}
                          {report.description}
                        </p>
                        <p>
                          <span className="font-medium">Matched Words:</span>{" "}
                          {report.plagiarismWords} / {report.totalNumberOfWords}
                        </p>
                        <div>
                          <span className="font-medium">Matched Content:</span>
                          <p className="mt-1 text-sm bg-yellow-100 p-2 rounded">
                            {report.plagiarismFound
                              .map((found) => found.sequence)
                              .join(" ")}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Source
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
