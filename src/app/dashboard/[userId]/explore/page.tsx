"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  User,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { getAllProjects } from "@/actions";
import { useRouter } from "next/navigation";
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
  supervisor: {
    id: string;
    fullName: string;
    imageUrl?: string;
  };
}

// Categories for filtering
const categories = [
  "All",
  "Machine Learning",
  "Web Development",
  "Blockchain",
  "IoT",
  "Natural Language Processing",
  "Augmented Reality",
  "Security",
];

export default function ExplorePage({ params: { userId } }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
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
        createdAt: project.createdAt.toISOString(), // Convert Date to string
        updatedAt: project.updatedAt.toISOString(), // Convert Date to string
        student: {
          id: project.student.id,
          fullName: project.student.fullName,
          imageUrl: project.student.imageUrl,
        },
        supervisor: {
          id: project.supervisor.id,
          fullName: project.supervisor.fullName,
          imageUrl: project.supervisor.imageUrl,
        },
      }));

      setProjects(formattedProjects);
      setFilteredProjects(formattedProjects);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Filter and sort projects based on current filters
  useEffect(() => {
    let result = [...projects];

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

    // Apply category filter (this is simplified - in a real app you'd have a category field)
    if (selectedCategory !== "All") {
      result = result.filter((project) =>
        project.title.includes(selectedCategory)
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
        case "plagiarism-high":
          return (b.plagiarismScore || 0) - (a.plagiarismScore || 0);
        case "plagiarism-low":
          return (a.plagiarismScore || 0) - (b.plagiarismScore || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, sortBy, statusFilter, projects]);

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
          <h1 className="text-3xl font-bold tracking-tight">
            Explore Projects
          </h1>
          <p className="text-muted-foreground">
            Discover projects from students across all departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
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
              className="lucide lucide-grid-2x2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 12h18" />
              <path d="M12 3v18" />
            </svg>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-3"
          >
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
              className="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="relative md:col-span-5">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:col-span-1 w-full">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your project search</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="justify-start"
                  >
                    All Statuses
                  </Button>
                  <Button
                    variant={
                      statusFilter === ProjectStatus.APPROVED
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter(ProjectStatus.APPROVED)}
                    className="justify-start"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approved
                  </Button>
                  <Button
                    variant={
                      statusFilter === ProjectStatus.PENDING
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter(ProjectStatus.PENDING)}
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" /> Pending
                  </Button>
                  <Button
                    variant={
                      statusFilter === ProjectStatus.UNDER_REVIEW
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter(ProjectStatus.UNDER_REVIEW)}
                    className="justify-start"
                  >
                    <Eye className="mr-2 h-4 w-4" /> Under Review
                  </Button>
                  <Button
                    variant={
                      statusFilter === ProjectStatus.REJECTED
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter(ProjectStatus.REJECTED)}
                    className="justify-start"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Rejected
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="plagiarism-high">
                      Highest Plagiarism
                    </SelectItem>
                    <SelectItem value="plagiarism-low">
                      Lowest Plagiarism
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setStatusFilter("all");
                    setSortBy("newest");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Projects grid/list */}
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <Ellipsis color="rgba(137,137,137,1)" size={93} />
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">
                    {project.title}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {renderStatusBadge(project.status)}
                  {renderPlagiarismBadge(project.plagiarismScore)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    router.push(`/dashboard/${userId}/project/${project.id}`);
                  }}
                >
                  View Details
                </Button>
                {/* <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
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
                          <h3 className="text-sm font-medium">Supervisor</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={project.supervisor.imageUrl}
                                alt={project.supervisor.fullName}
                              />
                              <AvatarFallback>
                                {project.supervisor.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {project.supervisor.fullName}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            Plagiarism Check
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {renderPlagiarismBadge(project.plagiarismScore)}
                            <span className="text-sm">
                              {project.plagiarismReport}
                            </span>
                          </div>
                        </div>

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
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet> */}
              </CardFooter>
            </Card>
          ))}
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{project.supervisor.fullName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 sm:justify-between">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">View Details</Button>
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
                            <h3 className="text-sm font-medium">Supervisor</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={project.supervisor.imageUrl}
                                  alt={project.supervisor.fullName}
                                />
                                <AvatarFallback>
                                  {project.supervisor.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {project.supervisor.fullName}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium">
                              Plagiarism Check
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {renderPlagiarismBadge(project.plagiarismScore)}
                              <span className="text-sm">
                                {project.plagiarismReport}
                              </span>
                            </div>
                          </div>

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
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={project.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4" />
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
          <h2 className="text-xl font-semibold mb-2">No projects found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
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
