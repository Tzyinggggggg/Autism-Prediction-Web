/** @format */
"use client";
import {
	Bird,
	Book,
	Bot,
	Code2,
	CornerDownLeft,
	LifeBuoy,
	Mic,
	Paperclip,
	Rabbit,
	Settings,
	Settings2,
	Share,
	SquareTerminal,
	SquareUser,
	Triangle,
	Turtle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

import JsPDF from "jspdf";
import { useState, useEffect } from "react";

const API_OUTPUT = {
	id: 163,
	title: "try",
	video: "/media/videos/202403071521_TawFlai.mp4",
	video_output: "/media/videos/andretry163_output.mp4",
	results: [
		[
			0,
			2.6666666666666665,
			[
				["armflapping", 68.99],
				["headbanging", 15.32],
				["normal", 14.95],
				["spinning", 0.74],
			],
		],
		[
			2.6666666666666665,
			5.333333333333333,
			[
				["normal", 99.7],
				["headbanging", 0.29],
				["armflapping", 0.0],
				["spinning", 0.0],
			],
		],
		[
			5.333333333333333,
			8.0,
			[
				["normal", 96.57],
				["headbanging", 3.37],
				["armflapping", 0.06],
				["spinning", 0.0],
			],
		],
		[
			8.0,
			10.666666666666666,
			[
				["normal", 96.71],
				["headbanging", 3.28],
				["armflapping", 0.01],
				["spinning", 0.0],
			],
		],
		[
			10.666666666666666,
			13.333333333333332,
			[
				["headbanging", 59.83],
				["normal", 25.8],
				["armflapping", 14.3],
				["spinning", 0.07],
			],
		],
		[
			13.333333333333332,
			15.999999999999998,
			[
				["spinning", 66.32],
				["armflapping", 17.31],
				["headbanging", 16.37],
				["normal", 0.01],
			],
		],
		[
			15.999999999999998,
			18.666666666666664,
			[
				["normal", 99.96],
				["headbanging", 0.03],
				["armflapping", 0.01],
				["spinning", 0.0],
			],
		],
		[
			18.666666666666664,
			21.333333333333332,
			[
				["armflapping", 79.64],
				["headbanging", 19.22],
				["spinning", 1.12],
				["normal", 0.03],
			],
		],
		[
			21.333333333333332,
			24.0,
			[
				["headbanging", 52.17],
				["armflapping", 44.05],
				["normal", 3.42],
				["spinning", 0.37],
			],
		],
		[
			24.0,
			26.666666666666668,
			[
				["normal", 99.99],
				["headbanging", 0.0],
				["armflapping", 0.0],
				["spinning", 0.0],
			],
		],
		[
			26.666666666666668,
			29.333333333333336,
			[
				["normal", 99.76],
				["headbanging", 0.12],
				["armflapping", 0.12],
				["spinning", 0.0],
			],
		],
		[
			29.333333333333336,
			32.0,
			[
				["armflapping", 67.37],
				["headbanging", 16.82],
				["spinning", 15.68],
				["normal", 0.13],
			],
		],
		[
			32.0,
			34.666666666666664,
			[
				["normal", 69.85],
				["armflapping", 24.68],
				["headbanging", 5.43],
				["spinning", 0.04],
			],
		],
		[
			34.666666666666664,
			37.33333333333333,
			[
				["normal", 99.86],
				["headbanging", 0.09],
				["armflapping", 0.05],
				["spinning", 0.0],
			],
		],
		[
			37.33333333333333,
			39.99999999999999,
			[
				["normal", 100.0],
				["headbanging", 0.0],
				["armflapping", 0.0],
				["spinning", 0.0],
			],
		],
		[
			39.99999999999999,
			42.66666666666666,
			[
				["normal", 96.78],
				["headbanging", 3.15],
				["armflapping", 0.06],
				["spinning", 0.0],
			],
		],
		[
			42.66666666666666,
			45.33333333333332,
			[
				["normal", 97.16],
				["headbanging", 2.82],
				["armflapping", 0.02],
				["spinning", 0.0],
			],
		],
		[
			45.33333333333332,
			47.999999999999986,
			[
				["normal", 69.9],
				["headbanging", 29.86],
				["armflapping", 0.22],
				["spinning", 0.02],
			],
		],
		[
			47.999999999999986,
			50.66666666666665,
			[
				["normal", 91.1],
				["headbanging", 8.79],
				["armflapping", 0.11],
				["spinning", 0.01],
			],
		],
		[
			50.66666666666665,
			53.333333333333314,
			[
				["normal", 99.76],
				["headbanging", 0.23],
				["armflapping", 0.01],
				["spinning", 0.0],
			],
		],
	],
	prediction_percentage: "90%",
	created_at: "2024-04-19T09:58:21.283383Z",
	patient: "7dd963da-edaa-4f9b-88ff-348577899b30",
};
type Result = [number, number, [string, number][]];

// import video from "../../public/andretry163_output.mp4";
const generatePDF = () => {
	const reportElement = document.querySelector(".pdf-content") as HTMLElement;
	if (reportElement) {
		const report = new JsPDF("portrait", "pt", "a4");
		report.html(reportElement).then(() => {
			report.save("report.pdf");
		});
	}
};

export default function Dashboard() {
	const [loading, setLoading] = useState(false);
	const [patientName, setPatientName] = useState("");
	const handleSubmit = () => {
		// Check if patientName is valid
		if (patientName.length < 3 || patientName.length > 30) {
			alert("Patient name must be between 3 and 30 characters.");
			return;
		}

		// Check if video file is provided and has the correct format
		const videoFile = data.video;
		if (!videoFile) {
			alert("Please select a video file.");
			return;
		}

		const allowedFormats = ["mp4", "mov"];
		const fileExtension = videoFile.name.split(".").pop().toLowerCase();
		if (!allowedFormats.includes(fileExtension)) {
			alert("Only MP4 and MOV video formats are allowed.");
			return;
		}

		// If both validations pass, call the uploadVideo function
		uploadVideo(data);
	};

	const [data, setData] = useState<{
		patient: string;
		results: any;
		prediction_percentage: string;
		video_output: string;
		video: any;
		emotion_results: { [key: string]: number };
	}>({
		patient: "",
		results: [],
		prediction_percentage: "",
		video_output: "",
		video: null,
		emotion_results: {},
	});
	// Update the patient property in the data state when user inputs something
	const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setPatientName(newName);
		setData((prevData) => ({
			...prevData,
			patient: newName,
		}));
	};

	const [behaviorTimes, setBehaviorTimes] = useState({
		normal: 0,
		headbanging: 0,
		armflapping: 0,
		spinning: 0,
	});
	const [emotionTimes, setEmotionTimes] = useState({});
	const [videoUrl, setVideoUrl] = useState("");
	const uploadVideo = async (data: any) => {
		console.log(data);
		setLoading(true);
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
				console.log(data);
				// close loading
				// api output
				const output_data = await res.json();
				console.log(output_data);
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
					setVideoUrl(outputUrl);
				}
			})
			.catch((e) => {
				// close loading
				console.log(e);
				// shopw somejing when error
			});
		setLoading(false);
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
		<div className='grid h-screen w-full pl-[56px]'>
			<aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
				<div className='border-b p-2'>
					<Button variant='outline' size='icon' aria-label='Home'>
						<Triangle className='size-5 fill-foreground' />
					</Button>
				</div>
				<nav className='mt-auto grid gap-1 p-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='mt-auto rounded-lg'
									aria-label='Help'
								>
									<LifeBuoy className='size-5' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='right' sideOffset={5}>
								Help
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='mt-auto rounded-lg'
									aria-label='Account'
								>
									<SquareUser className='size-5' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='right' sideOffset={5}>
								Account
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			</aside>
			<div className='flex flex-col'>
				<header className='sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4'>
					<h1 className='text-xl font-semibold'>Autism Prediction</h1>
					<div className='ml-auto gap-1.5 text-sm'>
						<div className='ml-auto'>
							<Button
								variant='outline'
								size='sm'
								className='text-sm'
								onClick={generatePDF}
							>
								Generate PDF
							</Button>
						</div>
					</div>
				</header>
				<main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
					<div
						className='pdf-content relative hidden flex-col items-start gap-8 md:flex'
						x-chunk='dashboard-03-chunk-0'
					>
						<form className='grid w-full items-start gap-6'>
							<fieldset className='grid gap-6 rounded-lg border p-4'>
								<legend className='-ml-1 px-1 text-sm font-medium'>
									Result
								</legend>
								<div className='grid gap-3'>
									<Label htmlFor='PatientName'>
										Patient Name:
										<input
											type='text'
											id='PatientName'
											name='PatientName'
											value={patientName}
											onChange={handlePatientNameChange}
											className='border border-gray-300 rounded-md p-2'
											placeholder='Enter patient name'
										/>
									</Label>
									<Label style={{ marginTop: "10px" }}>
										Self-stimulatory behavior :
										<ul style={{ marginTop: "20px" }}>
											<li style={{ marginBottom: "10px" }}>
												Normal : {behaviorTimes.normal.toFixed(2)} seconds
											</li>
											<li style={{ marginBottom: "10px" }}>
												Headbanging : {behaviorTimes.headbanging.toFixed(2)}{" "}
												seconds
											</li>
											<li style={{ marginBottom: "10px" }}>
												Armflapping : {behaviorTimes.armflapping.toFixed(2)}{" "}
												seconds
											</li>
											<li style={{ marginBottom: "10px" }}>
												Spinning : {behaviorTimes.spinning.toFixed(2)} seconds
											</li>
										</ul>
									</Label>
								</div>
							</fieldset>

							<fieldset className='grid gap-6 rounded-lg border p-4'>
								<legend className='-ml-1 px-1 text-sm font-medium'>
									Emotion :
								</legend>
								<Label htmlFor='emotions'>
									<ul>
										{Object.entries(emotionTimes).map(([emotion, value]) => (
											<li key={emotion} style={{ marginBottom: "10px" }}>
												{emotion || "No emotion detected"}: {value.toFixed(2)}
											</li>
										))}
									</ul>
								</Label>
							</fieldset>
						</form>
					</div>
					<div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
						<Badge variant='outline' className='absolute right-3 top-3'>
							Output
						</Badge>
						<div
							className='flex items-center justify-center'
							style={{ height: "50%" }}
						>
							<ReactPlayer
								className='react-player'
								url={videoUrl}
								width='50%'
								height='70%'
								controls={true}
								style={{ minWidth: "100px", minHeight: "100px" }} // Set the minimum width and height for the video
							/>
						</div>

						<div className='resize-none border-0 p-3 shadow-none focus-visible:ring-0' />
						{/* <div className='relative flex-grow'>
							<div className='timeline'>
								<div className='relative flex-grow'></div>
							</div>
						</div> */}
						<div
							className='progress-bar'
							style={{ display: loading ? "block" : "none" }}
						>
							<div className='progress-bar-inner'> LOADINGGGGGGGGGGGGG</div>
						</div>
						<div className='flex items-center p-3 pt-0'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Input
											id='video'
											type='file'
											onChange={(e) => {
												const file = e.target.files?.[0];
												// console.log(data);
												setData({ ...data, video: file });
											}}
										/>
									</TooltipTrigger>
									<TooltipContent side='top'>Attach File</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<Button
								type='submit'
								size='sm'
								className='ml-auto gap-1.5'
								disabled={loading}
								onClick={handleSubmit}
							>
								Predict
								<CornerDownLeft className='size-3.5' />
							</Button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
