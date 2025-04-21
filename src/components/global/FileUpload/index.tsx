"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function FileUpload({
  onSuccess,
  value,
}: {
  onSuccess: (url: string) => void;
  value?: string;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCloudinary = () => {
      if (!window.cloudinary) {
        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        script.onload = () => setLoading(false);
        document.body.appendChild(script);
      } else {
        setLoading(false);
      }
    };

    initializeCloudinary();
  }, []);

  const openWidget = () => {
    const widget = window.cloudinary?.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url"],
        multiple: false,
        clientAllowedFormats: ["pdf", "doc", "docx"],
        maxFileSize: 5242880, // 5MB in bytes
        cropping: false,
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          onSuccess(result.info.secure_url);
        }
      }
    );

    widget?.open();
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={openWidget}
        variant="outline"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing Upload...
          </div>
        ) : value ? (
          "Change File"
        ) : (
          "Upload Project File"
        )}
      </Button>

      {value && (
        <div className="text-sm text-muted-foreground">
          Uploaded file: {value.split("/").pop()}
        </div>
      )}
    </div>
  );
}
