"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Recycle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  addNotification,
  getAllProjects,
  setApproved,
  setRejected,
  setUnderReview,
} from "@/actions"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonLoading } from "@/components/global/ButtonLoading";
import { Ellipsis } from "react-css-spinners";

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
  plagiarismReport: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    fullName: string;
    imageUrl?: string;
  };
}

export default function SupervisorSubmissions({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  // const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);

  const [feedback, setFeedback] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await getAllProjects();

      // Map the fetched data to match the Project interface
      const formattedProjects: Project[] = data.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        fileUrl: project.fileUrl,
        studentId: project.studentId,
        supervisorId: project.supervisorId,
        status: project.status as ProjectStatus, // Ensure status is cast to ProjectStatus
        plagiarismScore: project.plagiarismScore,
        plagiarismReport: project.plagiarismReport,
        createdAt: project.createdAt.toISOString(), // Convert Date to string if necessary
        updatedAt: project.updatedAt.toISOString(), // Convert Date to string if necessary
        student: {
          id: project.student.id,
          fullName: project.student.fullName,
          imageUrl: project.student.imageUrl,
        },
      }));

      setProjects(formattedProjects);
      setFilteredProjects(formattedProjects);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Get unique students for filter
  const students = Array.from(new Set(projects.map((p) => p.student.id))).map(
    (id) => {
      const project = projects.find((p) => p.student.id === id);
      return {
        id,
        name: project?.student.fullName || "",
      };
    }
  );

  // Filter and sort projects based on current filters
  useEffect(() => {
    let result = [...projects];

    // Apply tab filter
    if (activeTab === "pending") {
      result = result.filter(
        (project) => project.status === ProjectStatus.PENDING
      );
    } else if (activeTab === "under_review") {
      result = result.filter(
        (project) => project.status === ProjectStatus.UNDER_REVIEW
      );
    } else if (activeTab === "plagiarism") {
      result = result.filter((project) => (project.plagiarismScore || 0) > 20);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.student.fullName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    // Apply student filter
    if (studentFilter !== "all") {
      result = result.filter((project) => project.student.id === studentFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "plagiarism-high":
          return (b.plagiarismScore || 0) - (a.plagiarismScore || 0);
        case "plagiarism-low":
          return (a.plagiarismScore || 0) - (b.plagiarismScore || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(result);
  }, [searchQuery, statusFilter, studentFilter, sortBy, activeTab, projects]);

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

  // Helper function to render plagiarism badge
  const renderPlagiarismBadge = (score: number | null) => {
    if (!score) return null;

    if (score > 50) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {score}% Match
        </Badge>
      );
    } else if (score > 20) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          {score}% Match
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          {score}% Match
        </Badge>
      );
    }
  };

  // Handle project approval
  const handleApproveProject = async (projectId: string) => {
    setIsApproving(true);

    try {
      // Call the server action to approve the project
      const updatedProject = await setApproved(projectId, feedback);

      // Update the state to reflect the changes

      if (updatedProject) {
        toast("Success!", {
          description: "Project approved successfully.",
          duration: 3000,
        });
        setFeedback("");

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.APPROVED,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );

        setFilteredProjects((prevFilteredProjects) =>
          prevFilteredProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.APPROVED,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );
        await addNotification({
          userId: updatedProject.supervisorId,
          description: `You approved ${updatedProject.student.fullName}'s project`,
        });
        await addNotification({
          userId: updatedProject.studentId,
          description: `Congratulation 🎉 Your project(${updatedProject.title}) was approved`,
        });

        // Refresh the page (optional, if needed)

        console.log(updatedProject);

        router.refresh();
      }
    } catch (error) {
      console.error("Failed to approve project:", error);
    } finally {
      setIsApproving(false);
    }
  };

  // Handle project rejection
  const handleRejectProject = async (projectId: string) => {
    setIsRejecting(true);
    try {
      // Call the server action to reject the project
      const updatedProject = await setRejected(projectId, feedback);

      // Update the projects list

      if (updatedProject) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.REJECTED,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );

        setFilteredProjects((prevFilterProjects) =>
          prevFilterProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.REJECTED,
                  updatedAt: new Date().toISOString(),
                }
              : project
          )
        );

        await addNotification({
          userId: updatedProject.supervisorId,
          description: `You rejected ${updatedProject.student.fullName}'s project`,
        });

        await addNotification({
          userId: updatedProject.studentId,
          description: `❌ Your project(${updatedProject.title}) was rejected`,
        });

        toast("Success!", {
          description: "Project rejected successfully.",
          duration: 3000,
        });

        setFeedback("");

        console.log(updatedProject);

        router.refresh();
      }
    } catch (error) {
      console.error("Failed to approve project:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle setting project to under review
  const handleReviewProject = async (projectId: string, feedback?: string) => {
    setIsReversing(true);
    try {
      // Call the server action to mark the project as "UNDER_REVIEW"
      const updatedProject = await setUnderReview(projectId, feedback);

      // Update the projects list
      if (updatedProject) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.UNDER_REVIEW,
                  updatedAt: new Date().toISOString(),
                  feedback: feedback || "No feedback",
                }
              : project
          )
        );

        setFilteredProjects((prevFilterProjects) =>
          prevFilterProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: ProjectStatus.UNDER_REVIEW,
                  updatedAt: new Date().toISOString(),
                  feedback: feedback || "No feedback",
                }
              : project
          )
        );

        // Add notifications
        await addNotification({
          userId: updatedProject.supervisor.id,
          description: `You marked ${updatedProject.student.fullName}'s project as "Under Review"`,
        });

        await addNotification({
          userId: updatedProject.student.id,
          description: `🔍 Your project (${updatedProject.title}) is under review`,
        });

        // Show a success toast
        toast("Success!", {
          description: "Project marked as under review.",
          duration: 3000,
        });

        // Refresh the page
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to mark project as under review:", error);
    } finally {
      setIsReversing(false);
    }
  };

  // if (filteredProjects.length === 0) {
  //   return <Loader size="lg" className="w-full h-full" />;
  // }
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Submissions
          </h1>
          <p className="text-muted-foreground">
            Review and grade student projects
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="under_review">Reviewing</TabsTrigger>
          <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="relative md:col-span-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={ProjectStatus.APPROVED}>Approved</SelectItem>
              <SelectItem value={ProjectStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={ProjectStatus.UNDER_REVIEW}>
                Under Review
              </SelectItem>
              <SelectItem value={ProjectStatus.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="md:col-span-2 w-full flex justify-between items-center"
            >
              <span className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("title-asc")}>
              Title (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("title-desc")}>
              Title (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("plagiarism-high")}>
              Highest Plagiarism
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("plagiarism-low")}>
              Lowest Plagiarism
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="md:col-span-1 w-full"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setStudentFilter("all");
            setSortBy("newest");
          }}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Projects list */}

      {loading ? (
        <div className="flex w-full items-center justify-center">
          <Ellipsis color="rgba(137,137,137,1)" size={93} />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {renderStatusBadge(project.status)}
                      {renderPlagiarismBadge(project.plagiarismScore)}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={project.student.imageUrl}
                          alt={project.student.fullName}
                        />
                        <AvatarFallback>
                          {project.student.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project.student.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:justify-between">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Review</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>{project.title}</SheetTitle>
                        <SheetDescription>
                          Submitted on{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={project.student.imageUrl}
                                alt={project.student.fullName}
                              />
                              <AvatarFallback>
                                {project.student.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {project.student.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Student
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {renderStatusBadge(project.status)}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium">Description</h3>
                            <p className="text-sm mt-1">
                              {project.description}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium">
                              Plagiarism Check
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {renderPlagiarismBadge(project.plagiarismScore)}
                              <span className="text-sm">
                                {/* {project.plagiarismReport} */}
                              </span>
                            </div>
                          </div>
                          {/* 
                        <div>
                          <h3 className="text-sm font-medium">Project File</h3>
                          <Button
                            variant="outline"
                            className="w-full mt-1"
                            asChild
                          >
                            <a
                              href={project.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Download Project
                            </a>
                          </Button>
                        </div> */}
                          <div>
                            <h3 className="text-sm font-medium">
                              Project File
                            </h3>
                            <Button
                              variant="outline"
                              className="w-full mt-1"
                              asChild
                            >
                              <a
                                href={project.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Download Project
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full mt-2"
                              onClick={() =>
                                router.push(
                                  `/dashboard/${userId}/project/${project.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Checkout project report
                            </Button>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Feedback</h3>
                            <Textarea
                              placeholder="Provide feedback to the student..."
                              className="mt-1 min-h-[120px]"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Select defaultValue="positive">
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Feedback type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="positive">
                                    Positive
                                  </SelectItem>
                                  <SelectItem value="constructive">
                                    Constructive
                                  </SelectItem>
                                  <SelectItem value="critical">
                                    Critical
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setFeedback(
                                    feedback +
                                      "\n\nStrengths:\n- \n\nAreas for improvement:\n- \n\nOverall assessment:\n"
                                  )
                                }
                              >
                                Add Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <SheetFooter className="flex-col sm:flex-row gap-2">
                        {project.status === ProjectStatus.PENDING ||
                        project.status === ProjectStatus.UNDER_REVIEW ? (
                          <>
                            {isRejecting ? (
                              <ButtonLoading />
                            ) : (
                              <Button
                                variant="destructive"
                                onClick={() => handleRejectProject(project.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            )}

                            {isApproving ? (
                              <ButtonLoading />
                            ) : (
                              <Button
                                onClick={() => handleApproveProject(project.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            {isReversing ? (
                              <ButtonLoading />
                            ) : (
                              <Button
                                variant={"outline"}
                                onClick={() => handleReviewProject(project.id)}
                              >
                                <Recycle className="mr-2 h-4 w-4" />
                                Reverse Action
                              </Button>
                            )}
                          </>
                        )}
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a
                          href={project.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </DropdownMenuItem>
                      {project.status === ProjectStatus.PENDING && (
                        <DropdownMenuItem
                          onClick={() => handleReviewProject(project.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Mark as Reviewing
                        </DropdownMenuItem>
                      )}
                      {/* {(project.status === ProjectStatus.PENDING ||
                      project.status === ProjectStatus.UNDER_REVIEW) && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleApproveProject(project.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRejectProject(project.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )} */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {renderStatusBadge(project.status)}
                    {renderPlagiarismBadge(project.plagiarismScore)}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={project.student.imageUrl}
                        alt={project.student.fullName}
                      />
                      <AvatarFallback>
                        {project.student.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.student.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 sm:justify-between">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Review</Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>{project.title}</SheetTitle>
                      <SheetDescription>
                        Submitted on{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={project.student.imageUrl}
                              alt={project.student.fullName}
                            />
                            <AvatarFallback>
                              {project.student.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {project.student.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Student
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {renderStatusBadge(project.status)}
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Description</h3>
                          <p className="text-sm mt-1">{project.description}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            Plagiarism Check
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {renderPlagiarismBadge(project.plagiarismScore)}
                            <span className="text-sm">
                              {/* {project.plagiarismReport} */}
                            </span>
                          </div>
                        </div>
                        {/* 
                        <div>
                          <h3 className="text-sm font-medium">Project File</h3>
                          <Button
                            variant="outline"
                            className="w-full mt-1"
                            asChild
                          >
                            <a
                              href={project.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Download Project
                            </a>
                          </Button>
                        </div> */}
                        <div>
                          <h3 className="text-sm font-medium">Project File</h3>
                          <Button
                            variant="outline"
                            className="w-full mt-1"
                            asChild
                          >
                            <a
                              href={project.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Download Project
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() =>
                              router.push(
                                `/dashboard/${userId}/project/${project.id}`
                              )
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Checkout project report
                          </Button>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Feedback</h3>
                          <Textarea
                            placeholder="Provide feedback to the student..."
                            className="mt-1 min-h-[120px]"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <Select defaultValue="positive">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Feedback type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="positive">
                                  Positive
                                </SelectItem>
                                <SelectItem value="constructive">
                                  Constructive
                                </SelectItem>
                                <SelectItem value="critical">
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setFeedback(
                                  feedback +
                                    "\n\nStrengths:\n- \n\nAreas for improvement:\n- \n\nOverall assessment:\n"
                                )
                              }
                            >
                              Add Template
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <SheetFooter className="flex-col sm:flex-row gap-2">
                      {project.status === ProjectStatus.PENDING ||
                      project.status === ProjectStatus.UNDER_REVIEW ? (
                        <>
                          {isRejecting ? (
                            <ButtonLoading />
                          ) : (
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectProject(project.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          )}

                          {isApproving ? (
                            <ButtonLoading />
                          ) : (
                            <Button
                              onClick={() => handleApproveProject(project.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          {isReversing ? (
                            <ButtonLoading />
                          ) : (
                            <Button
                              variant={"outline"}
                              onClick={() => handleReviewProject(project.id)}
                            >
                              <Recycle className="mr-2 h-4 w-4" />
                              Reverse Action
                            </Button>
                          )}
                        </>
                      )}
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a
                        href={project.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    {project.status === ProjectStatus.PENDING && (
                      <DropdownMenuItem
                        onClick={() => handleReviewProject(project.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Reviewing
                      </DropdownMenuItem>
                    )}
                    {/* {(project.status === ProjectStatus.PENDING ||
                      project.status === ProjectStatus.UNDER_REVIEW) && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleApproveProject(project.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRejectProject(project.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )} */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
