import { Skeleton } from "@/components/ui/skeleton";
import ActionFieldSet from "./action_fieldset";
import EmotionFieldSet from "./emotion_fieldset";
import { Button } from "@/components/ui/button";
import ReportPDF from "./pdf_document";
import { pdf } from "@react-pdf/renderer";
import PercentageFieldSet from "./percentage_fieldset";

const ActionEmotionOutput = ({
  patientName,
  behaviorTimes,
  emotionTimes,
  percentage,
  isSubmitting,
  isSubmitSuccessful,
}: {
  patientName: string;
  behaviorTimes: any;
  emotionTimes: any;
  percentage: any;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
}) => {
  const generatePDF = async ({
    patientName,
    actions,
    emotions,
    percentage,
  }: {
    patientName: string;
    actions: any;
    emotions: any;
    percentage: any;
  }) => {
    const reportPDF = (
      <ReportPDF
        percentage={percentage}
        actions={actions}
        emotions={emotions}
        patientName={patientName}
      />
    );
    const blob = await pdf(reportPDF).toBlob();
    const fileURL = window.URL.createObjectURL(blob);
    let alink = document.createElement("a");
    alink.href = fileURL;
    alink.download = "report.pdf";
    alink.click();
  };

  if (isSubmitting) {
    return (
      <>
        <Skeleton className="h-[62px] w-full rounded-xl" />
        <Skeleton className="h-[124px] w-full rounded-xl" />
        <Skeleton className="h-[124px] w-full rounded-xl" />
      </>
    );
  }

  if (isSubmitSuccessful) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() =>
            generatePDF({
              percentage: percentage,
              actions: behaviorTimes,
              emotions: emotionTimes,
              patientName: patientName,
            })
          }
        >
          Generate PDF
        </Button>
        <PercentageFieldSet percentage={percentage} />
        <ActionFieldSet behaviorTimes={behaviorTimes} />
        <EmotionFieldSet emotionTimes={emotionTimes} />
      </>
    );
  }
};

export default ActionEmotionOutput;
