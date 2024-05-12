import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoSection = ({
  videoUrl,
  isSubmitting,
}: {
  videoUrl: string | undefined;
  isSubmitting: boolean;
}) => {
  return (
    <div className="relative flex h-[calc(100vh-90px)]  flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3">
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <div className="resize-none border-0 p-3 shadow-none focus-visible:ring-0" />
      <div className="flex items-center justify-center h-full">
        {videoUrl ? (
          <ReactPlayer
            className="react-player"
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
            style={{ minWidth: "100px", minHeight: "100px" }}
          />
        ) : isSubmitting ? (
          <Skeleton className="flex flex-col items-center justify-center h-full w-full rounded-xl bg-gray-300">
            <h2 className="text-2xl font-semibold tracking-tight first:mt-0">
              Generating Video...
            </h2>
          </Skeleton>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold tracking-tight first:mt-0">
              {" "}
              Get Started{" "}
            </h1>
            <div className="flex flex-col text-left text-muted-foreground">
              <p> 1. Enter patient name </p>
              <p> 2. Upload patient video </p>
              <p> 3. Press predict button </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection;
