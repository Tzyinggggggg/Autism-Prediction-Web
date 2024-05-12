import * as yup from "yup";

const patient_schema = yup.object().shape({
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

export default patient_schema;
