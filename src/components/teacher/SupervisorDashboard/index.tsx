"use client"; // Add this directive to indicate this is a client component

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  AlertTriangle,
  Filter,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSupervisorProjects,
  getPendingReviews,
  getReviewedThisWeek,
  getPlagiarismAlerts,
  getAverageScore,
  getRecentNotifications,
  getRecentSupervisorProjects,
} from "@/actions";
import { renderPlagiarismBadge, renderStatusBadge } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { Ellipsis } from "react-css-spinners";

export default function TeacherDashboard({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any>([]);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [reviewedThisWeek, setReviewedThisWeek] = useState(0);
  const [plagiarismAlerts, setPlagiarismAlerts] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { user: clerkUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          submissionsData,
          pendingReviewsData,
          reviewedThisWeekData,
          plagiarismAlertsData,
          averageScoreData,
          recentNotificationsData,
        ] = await Promise.all([
          getRecentSupervisorProjects(),
          getPendingReviews(),
          getReviewedThisWeek(),
          getPlagiarismAlerts(),
          getAverageScore(),
          getRecentNotifications(),
        ]);

        setUser(clerkUser);
        setSubmissions(submissionsData.data?.supervisedProjects || []);
        setPendingReviews(pendingReviewsData.data || 0);
        setReviewedThisWeek(reviewedThisWeekData.data || 0);
        setPlagiarismAlerts(plagiarismAlertsData.data || 0);
        setAverageScore(averageScoreData.data || 0);
        setRecentNotifications(recentNotificationsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clerkUser]);

  const plagiarismAlertsDataMock =
    submissions?.filter(
      (sub: any) => sub.plagiarismScore !== null && sub.plagiarismScore > 10
    ) || [];

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome,{" "}
              {loading ? (
                <Ellipsis color="rgba(137,137,137,1)" size={30} />
              ) : (
                user?.firstName || "Supervisor"
              )}
            </h1>
            <p className="text-muted-foreground">
              Manage student projects and submissions
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">+3 new today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Reviewed This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewedThisWeek}</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Plagiarism Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {plagiarismAlerts}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last semester
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="mb-6">
          <TabsList>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            <TabsTrigger value="plagiarism">Plagiarism Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Submissions</CardTitle>
                <CardDescription>
                  Review and grade student projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex w-full items-center justify-center">
                    <Ellipsis color="rgba(137,137,137,1)" size={93} />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Plagiarism</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions?.map((submission: any) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {submission.student.firstName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{submission.student.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              submission.updatedAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell>
                            {renderPlagiarismBadge(
                              submission.plagiarismScore ?? 0
                            )}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/dashboard/${userId}/project/${submission.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Review
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/${userId}/supervisor-submissions`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    View All Submissions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="plagiarism">
            <Card>
              <CardHeader>
                <CardTitle>Plagiarism Alerts</CardTitle>
                <CardDescription>
                  Submissions with high similarity scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Similarity Score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plagiarismAlertsDataMock.length > 0 ? (
                      plagiarismAlertsDataMock.map((alert: any) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">
                            {alert.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {alert.student.firstName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{alert.student.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(alert.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-red-500 hover:bg-red-600">
                              {alert.plagiarismScore}% Match
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Investigate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No plagiarism alerts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex w-full items-center justify-center">
                <Ellipsis color="rgba(137,137,137,1)" size={93} />
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 border-b pb-4"
                    >
                      <div className="bg-green-500/10 p-2 rounded-md">
                        {notification.message.includes("approved") ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : notification.message.includes("Plagiarism") ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent activity.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
