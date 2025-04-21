"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project, User } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import FileUpload from "@/components/global/FileUpload";
import { useParams, useRouter } from "next/navigation";
import FileUpload from "@/components/global/file-upload";
import { toast } from "sonner";
import { addNotification, upsertProject } from "@/actions";

type Props = {
  data?: Partial<Project>;
  //   onSuccess: () => void;
  //   onClose: () => void;
};

const FormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  fileUrl: z.string().min(1),
  supervisorId: z.string().min(1),
});

const UploadProjectForm = ({ data }: Props) => {
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  useEffect(() => {
    const fetchSupervisors = async () => {
      setLoadingSupervisors(true);
      try {
        const response = await fetch("/api/supervisors");
        if (!response.ok) throw new Error("Network response was not ok");
        const supervisors = await response.json();
        setSupervisors(supervisors);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      } finally {
        setLoadingSupervisors(false);
      }
    };

    fetchSupervisors();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      fileUrl: data?.fileUrl || "",
      supervisorId: data?.supervisorId || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const proj = await upsertProject(values, userId);

      if (proj) {
        await addNotification({
          userId: proj.supervisorId,
          description: `New Project awaiting review from ${proj.student.firstName} ${proj.student.lastName}`,
        });
        await addNotification({
          userId: proj.studentId,
          description: `You submitted a new project (${proj.title})`,
        });

        toast("Success!", {
          description: "Project uploaded successfully.",
          duration: 3000,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Error uploading project.", {
        description: "Please try again later.",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="w-full pt-4">
      {/* <CardHeader>
        <CardTitle>Upload Project</CardTitle>
      </CardHeader> */}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              disabled={isLoading}
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="projectFile"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project File</FormLabel>
                  <FormControl>
                    {/* <FileUpload
                      onSuccess={field.onChange}
                      value={field.value}
                    /> */}
                    <FileUpload
                      apiEndpoint="projectFiles"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={loadingSupervisors}
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingSupervisors || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supervisor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supervisors.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.firstName} ({supervisor.lastName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Submit Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadProjectForm;
