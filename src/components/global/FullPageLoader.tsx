import { Loader2 } from "lucide-react";

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h3 className="text-lg font-medium mt-2">Loading...</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  );
}
