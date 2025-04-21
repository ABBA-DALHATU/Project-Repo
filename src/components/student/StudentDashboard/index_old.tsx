import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSubmissionsCount,
  getApprovalRate,
  getPendingReviews,
  getRecentStudentProjects,
} from "@/actions";
import { currentUser } from "@clerk/nextjs/server";
import UploadModal from "@/components/forms/UploadProjectForm/FormPopUp";
import { renderStatusBadge } from "@/lib/constants";
import UploadProjectForm from "@/components/forms/UploadProjectForm";

export default async function StudentDashboard({ userId }: { userId: string }) {
  const deadlines = [
    {
      id: 1,
      title: "Final Project Submission",
      course: "CS401",
      date: "2025-03-15",
    },
    {
      id: 2,
      title: "Research Paper",
      course: "CS302",
      date: "2025-03-10",
    },
    {
      id: 3,
      title: "Group Presentation",
      course: "CS350",
      date: "2025-03-05",
    },
  ];

  // const authUser = await currentUser();
  // const recentSubmissions = (await getRecentStudentProjects()).data?.projects;

  // Get the last 3 submissions

  // Fetch stats data
  const [
    authUser,
    recentSubmissionsData,
    submissionsResponse,
    approvalRateResponse,
    pendingReviewsResponse,
  ] = await Promise.all([
    await currentUser(),
    await getRecentStudentProjects(),
    getSubmissionsCount(),
    getApprovalRate(),
    getPendingReviews(),
  ]);

  const recentSubmissions = recentSubmissionsData.data?.projects;

  const totalSubmissions = submissionsResponse.data || 0;
  const approvalRate = approvalRateResponse.data || 0;
  const pendingReviews = pendingReviewsResponse.data || 0;

  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {authUser?.firstName || "Student"}
            </h1>
            <p className="text-muted-foreground">
              Track your project submissions and deadlines
            </p>
          </div>
          {/* <div className="flex items-center gap-4">
            <NotificationButton />
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt={authUser?.firstName || "Student"}
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div> */}
        </header>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last semester
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Approval Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvalRate.toFixed(1)}%
              </div>
              <Progress value={approvalRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Expected response in 2 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          {/* Recent submissions */}
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  Your recently submitted projects
                </CardDescription>
              </div>
              <UploadModal
                title={"Upload Project"}
                btnText={"Add new submission"}
              >
                <UploadProjectForm />
              </UploadModal>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {/* <TableHead>Course</TableHead> */}
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions?.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.title}
                      </TableCell>
                      {/* <TableCell>{submission.course}</TableCell> */}
                      <TableCell>
                        {new Date(submission.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/${userId}/my-project/${submission.id}`}
                          >
                            {/* <Eye className="mr-2 h-4 w-4" /> */}
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link href={`/dashboard/${userId}/student-submissions`}>
                  View All Submissions
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming deadlines */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Don&apos;t miss these important dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {deadline.course}
                      </p>
                      <p className="text-sm font-medium">
                        Due: {new Date(deadline.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {/* <CardFooter>
              <Button variant="outline" className="w-full">
                View All Deadlines
              </Button>
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
