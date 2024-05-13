/** @format */
"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";
import Header from "./_components/header";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ActionEmotionOutput from "./_components/fieldset";
import patient_schema from "./_schema/patient";
import VideoSection from "./_components/video_section";

type Result = [number, number, [string, number][]];

export default function Dashboard() {
  const { toast } = useToast();

  const [behaviorTimes, setBehaviorTimes] = useState({
    normal: 0,
    headbanging: 0,
    armflapping: 0,
    spinning: 0,
  });
  const [emotionTimes, setEmotionTimes] = useState({});
  const [autismPercentage, setAutismPercentage] = useState(0);

  const formMethods = useForm({
    defaultValues: {
      patient: undefined,
      video: undefined,
    },
    resolver: yupResolver(patient_schema),
  });
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = formMethods;

  useEffect(() => {
    if (errors && (errors.patient || errors.video)) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          errors.patient?.message && errors.video?.message
            ? `${errors.patient?.message}\n\n${errors.video?.message}`
            : errors.patient?.message || errors.video?.message,
      });
    }
  }, [errors, toast]);

  const onSubmit = async (values: any) => {
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

    const formData = new FormData();
    formData.append("patient", data["patient"]);
    formData.append("results", JSON.stringify(data["results"])),
      formData.append("prediction_percentage", data["prediction_percentage"]);
    formData.append("video_output", data["video_output"]);
    formData.append("video", data["video"]);
    formData.append("emotion_results", JSON.stringify(data["emotion_results"]));

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

          setBehaviorTimes({
            normal: normalTime,
            headbanging: headbangingTime,
            armflapping: armflappingTime,
            spinning: spinningTime,
          });

          setEmotionTimes(output_data.emotion_results);
        }

        setAutismPercentage(output_data.prediction_percentage);

        if (output_data.video_output) {
          const outputUrl = `http://127.0.0.1:8000${output_data.video_output}`;
          setVideoUrl(outputUrl);
        }
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
        });
      });
  };

  const [videoUrl, setVideoUrl] = useState("");

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
        <main className="grid flex-1 gap-4 overflow-auto p-2 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pdf-content relative flex-col items-start gap-8 md:flex overflow-auto p-2"
            x-chunk="dashboard-03-chunk-0"
            style={{
              maxHeight: "calc(100vh - 90px)",
              scrollbarWidth: "thin",
              scrollbarColor: "#F97316 #ffffff",
            }}
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
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Loading" : "Predict"}
                </Button>
              </div>
              <Separator />
              <ActionEmotionOutput
                patientName={getValues("patient")}
                percentage={autismPercentage}
                behaviorTimes={behaviorTimes}
                emotionTimes={emotionTimes}
                isSubmitting={isSubmitting}
                isSubmitSuccessful={isSubmitSuccessful}
              />
            </div>
          </div>
          <VideoSection videoUrl={videoUrl} isSubmitting={isSubmitting} />
        </main>
      </div>
    </div>
  );
}
