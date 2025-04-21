"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  ChevronLeft,
  ExternalLink,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getProject } from "@/actions";
import { Loader } from "@/components/global/Loader";

// Project status enum to match your database model
enum ProjectStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  UNDER_REVIEW = "UNDER_REVIEW",
}

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
  plagiarismReport: PlagiarismReport[];
  feedback?: string;
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

export default function SubmittedProject({
  params: { myProjectId },
}: {
  params: { myProjectId: string };
}) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const projectData = await getProject(myProjectId); // Get the project data as it is

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
            feedback: projectData.feedback || undefined,
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
  }, [myProjectId]);

  if (!project) {
    return <Loader size="lg" className="w-full h-full" />;
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case ProjectStatus.PENDING:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case ProjectStatus.UNDER_REVIEW:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Eye className="w-3 h-3 mr-1" /> Under Review
          </Badge>
        );
      case ProjectStatus.REJECTED:
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case ProjectStatus.PENDING:
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case ProjectStatus.UNDER_REVIEW:
        return <Eye className="h-6 w-6 text-blue-500" />;
      case ProjectStatus.REJECTED:
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
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

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main project info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription>
                  Submitted on{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {renderStatusBadge(project.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="mt-1 text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
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
            </div>
          </CardContent>
        </Card>

        {/* Project status and members */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                {getStatusIcon(project.status)}
                <div>
                  <p className="font-medium">Current Status</p>
                  <p className="text-sm text-muted-foreground">
                    {project.status === ProjectStatus.APPROVED &&
                      "Your project has been approved!"}
                    {project.status === ProjectStatus.PENDING &&
                      "Waiting for supervisor review"}
                    {project.status === ProjectStatus.UNDER_REVIEW &&
                      "Your supervisor is reviewing your project"}
                    {project.status === ProjectStatus.REJECTED &&
                      "Your project needs revision"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Project Members</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
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

                  <div className="flex items-center gap-3">
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
                      <p className="text-sm text-muted-foreground">
                        Supervisor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback section */}
        {project.feedback && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Supervisor Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-line">
                {project.feedback}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plagiarism report */}
        <Card className="md:col-span-3">
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

            {project.plagiarismScore && project.plagiarismScore > 50 ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High Plagiarism Detected</AlertTitle>
                <AlertDescription>
                  Your submission has a high similarity score. Please review the
                  plagiarism report and make necessary revisions.
                </AlertDescription>
              </Alert>
            ) : project.plagiarismScore && project.plagiarismScore > 20 ? (
              <Alert variant="default" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Moderate Plagiarism Detected</AlertTitle>
                <AlertDescription>
                  Your submission has some similarity with existing sources.
                  Consider reviewing and citing sources appropriately.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Low Plagiarism Score</AlertTitle>
                <AlertDescription>
                  Your submission has a low similarity score. Good job on
                  maintaining originality!
                </AlertDescription>
              </Alert>
            )}

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
