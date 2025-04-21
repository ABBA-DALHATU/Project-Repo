"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllStudentProjects } from "@/actions";
import { ProjectStatus } from "@prisma/client";
import { Loader } from "@/components/global/Loader";
import UploadModal from "@/components/forms/UploadProjectForm/FormPopUp";
import UploadProjectForm from "@/components/forms/UploadProjectForm";
import { Ellipsis } from "react-css-spinners";

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
  plagiarismReport: string | null;
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

// Mock data for demonstration

export default function AllSubmissions({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const data = await getAllStudentProjects(userId);

        // Ensure you access the projects array correctly and provide a fallback
        const formattedProjects: Project[] = (data?.projects || []).map(
          (project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            fileUrl: project.fileUrl,
            studentId: project.studentId,
            supervisorId: project.supervisorId,
            status: project.status as ProjectStatus, // Ensure status is cast to ProjectStatus
            plagiarismScore: project.plagiarismScore,
            plagiarismReport: project.plagiarismReport || [], // Ensure it's an array
            createdAt: project.createdAt.toISOString(), // Convert Date to string
            updatedAt: project.updatedAt.toISOString(), // Convert Date to string
            student: {
              id: project.student.id,
              name: project.student.fullName, // Ensure this matches the interface
              image: project.student.imageUrl, // Ensure this matches the interface
            },
            supervisor: {
              id: project.supervisor.id,
              name: project.supervisor.fullName, // Ensure this matches the interface
              image: project.supervisor.imageUrl, // Ensure this matches the interface
            },
          })
        );

        setProjects(formattedProjects);
        setFilteredProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Handle error (e.g., show a toast or set an error state)
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchProjects();
  }, [userId]);
  // Filter and sort projects based on current filters
  useEffect(() => {
    setLoading(true);
    let result = [...projects];

    // Apply tab filter
    if (activeTab === "pending") {
      result = result.filter(
        (project) => project.status === ProjectStatus.PENDING
      );
    } else if (activeTab === "approved") {
      result = result.filter(
        (project) => project.status === ProjectStatus.APPROVED
      );
    } else if (activeTab === "rejected") {
      result = result.filter(
        (project) => project.status === ProjectStatus.REJECTED
      );
    } else if (activeTab === "under_review") {
      result = result.filter(
        (project) => project.status === ProjectStatus.UNDER_REVIEW
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.supervisor.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
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
        default:
          return 0;
      }
    });

    setFilteredProjects(result);
    setLoading(false);
  }, [searchQuery, statusFilter, sortBy, activeTab, projects]);

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

  // if (filteredProjects.length === 0) {
  //   return <Loader size="lg" className="w-full h-full" />;
  // }
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="text-muted-foreground">
            View and track all your project submissions
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/projects/new">
            <FileText className="mr-2 h-4 w-4" />
            Submit New Project
          </Link>
        </Button> */}
        <UploadModal title={"Upload Project"} btnText={"Submit New  Project"}>
          <UploadProjectForm />
        </UploadModal>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="under_review">Reviewing</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="relative md:col-span-5">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, supervisors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="md:col-span-3 w-full flex justify-between items-center"
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
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="md:col-span-1 w-full"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
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
          {filteredProjects.length === 1 ? "submission" : "submissions"}
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
                          src={project.supervisor.image}
                          alt={project.supervisor.name}
                        />
                        <AvatarFallback>
                          {project.supervisor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project.supervisor.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Submitted:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {project.feedback && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Feedback available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 sm:justify-between">
                  <Button asChild>
                    <Link
                      href={`/dashboard/${userId}/my-project/${project.id}`}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>

                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={project.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No submissions found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setSortBy("newest");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
