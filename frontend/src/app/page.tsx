/** @format */
"use client";
import { AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

import { useState } from "react";
import Header from "./_components/header";
import ActionFieldSet from "./_components/action_fieldset";
import { useForm } from "react-hook-form";
import EmotionFieldSet from "./_components/emotion_fieldset";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type Result = [number, number, [string, number][]];

const schema = yup.object().shape({
  patient: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Invalid patient name format. Cannot include numbers or special characters."
    )
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters")
    .required("Patient name is required"),
  video: yup
    .mixed()
    .required("Video is required")
    .test(
      "file-selected",
      "Please select a video file.",
      (value: any) => value[0] !== undefined && value[0] !== null
    )
    .test(
      "file-size",
      "The maximum file size that can be uploaded is 100MB.",
      (value: any) =>
        !value[0] || (value[0] && value[0].size <= 100 * 1024 * 1024)
    )
    .test(
      "file-format",
      "Only MP4 and MOV video formats are allowed.",
      (value: any) =>
        !value[0] ||
        (value[0] &&
          ["mp4", "mov"].includes(
            value[0].name?.split(".").pop().toLowerCase()
          ))
    ),
});

export default function Dashboard() {
  const [behaviorTimes, setBehaviorTimes] = useState({
    normal: 0,
    headbanging: 0,
    armflapping: 0,
    spinning: 0,
  });
  const [emotionTimes, setEmotionTimes] = useState({});

  const formMethods = useForm({
    defaultValues: {
      patient: undefined,
      video: undefined,
    },
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = formMethods;

  const onSubmit = (values: any) => {
    const { patient, video } = values;
    const videoFile = video[0];

    const data = {
      patient: patient,
      results: [],
      prediction_percentage: "",
      video_output: "",
      video: videoFile,
      emotion_results: {},
    };

    uploadVideo(data);
  };

  const [videoUrl, setVideoUrl] = useState("");

  const uploadVideo = async (data: any) => {
    const formData = new FormData();
    formData.append("patient", data["patient"]);
    formData.append("results", JSON.stringify(data["results"])),
      formData.append("prediction_percentage", data["prediction_percentage"]);
    formData.append("video_output", data["video_output"]);
    formData.append("video", data["video"]);
    formData.append("emotion_results", JSON.stringify(data["emotion_results"]));

    // show loading
    await fetch("http://127.0.0.1:8000/api/upload/", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const output_data = await res.json();
        if (output_data.results && output_data.results.length > 0) {
          const normalTime = calculateBehaviorTime(
            output_data.results as Result[],
            "normal"
          );
          const headbangingTime = calculateBehaviorTime(
            output_data.results as Result[],
            "headbanging"
          );
          const armflappingTime = calculateBehaviorTime(
            output_data.results as Result[],
            "armflapping"
          );
          const spinningTime = calculateBehaviorTime(
            output_data.results as Result[],
            "spinning"
          );
          // Store the calculated times in a library for later retrieval
          setBehaviorTimes({
            normal: normalTime,
            headbanging: headbangingTime,
            armflapping: armflappingTime,
            spinning: spinningTime,
          });
          setEmotionTimes(output_data.emotion_results);
        }
        console.log(behaviorTimes.armflapping);
        if (output_data.video_output) {
          const outputUrl = `http://127.0.0.1:8000${output_data.video_output}`;
          console.log(outputUrl);
          setVideoUrl(outputUrl);
        }
      })
      .catch((e) => {
        // close loading
        console.log(e);
        // shopw somejing when error
      });
  };

  // Update behavior times when data changes
  function calculateBehaviorTime(results: Result[], behavior: string): number {
    let behaviorTime = 0;
    results.forEach(([start, end, behaviors]) => {
      const behaviorPercentage = behaviors.find(
        ([name]) => name === behavior
      )?.[1];
      if (behaviorPercentage) {
        behaviorTime += (end - start) * (behaviorPercentage / 100);
      }
    });
    return behaviorTime;
  }

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <Header />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pdf-content relative flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="grid w-full items-start gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="PatientName">Patient Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter patient name"
                    {...register("patient", { required: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="PatientName">Patient Video</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="video"
                          type="file"
                          {...register("video", { required: true })}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? "Loading" : "Predict"}
                </Button>

                {errors && (errors.patient || errors.video) ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    {errors.patient && (
                      <AlertDescription>
                        {errors.patient.message}
                      </AlertDescription>
                    )}
                    {errors.video && (
                      <AlertDescription>
                        {errors.video.message}
                      </AlertDescription>
                    )}
                  </Alert>
                ) : null}
              </div>
              <Separator />

              <ActionFieldSet behaviorTimes={behaviorTimes} />
              <EmotionFieldSet emotionTimes={emotionTimes} />
            </div>
          </div>
          <div className="relative flex h-[calc(100vh-90px)]  flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="resize-none border-0 p-3 shadow-none focus-visible:ring-0" />
            <div className="flex items-center justify-center h-full">
              <ReactPlayer
                className="react-player"
                url={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                style={{ minWidth: "100px", minHeight: "100px" }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
