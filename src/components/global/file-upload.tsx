"use client";
import { FileIcon, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "projectFiles";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const fileType = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {fileType === "pdf" || fileType === "docx" ? (
          <div className="relative flex items-center p-1 mt-1 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 text-indigo-500" />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View {fileType === "pdf" ? "PDF" : "DOCX"}
            </a>
          </div>
        ) : null}
        <Button
          onClick={() => onChange("")}
          variant="ghost"
          type="button"
          className="mt-4"
        >
          <X className="h-4 w-4 mr-2" />
          Remove File
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 rounded-lg p-4">
      <UploadDropzone
        // endpoint={apiEndpoint}
        endpoint="projectFiles"
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert("Upload failed. Please try again.");
        }}
        config={{
          allowedFileTypes: ["pdf", "docx"],
          maxFileSize: "4MB",
        }}
      />
    </div>
  );
};

export default FileUpload;
