import { Skeleton } from "@/components/ui/skeleton";
import ActionFieldSet from "./action_fieldset";
import EmotionFieldSet from "./emotion_fieldset";
import { Button } from "@/components/ui/button";
import ReportPDF from "./pdf_document";
import { pdf } from "@react-pdf/renderer";

const ActionEmotionOutput = ({
  patientName,
  behaviorTimes,
  emotionTimes,
  isSubmitting,
  isSubmitSuccessful,
}: {
  patientName: string;
  behaviorTimes: any;
  emotionTimes: any;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
}) => {
  const generatePDF = async ({
    patientName,
    actions,
    emotions,
  }: {
    patientName: string;
    actions: any;
    emotions: any;
  }) => {
    const reportPDF = (
      <ReportPDF
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
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
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
              actions: behaviorTimes,
              emotions: emotionTimes,
              patientName: patientName,
            })
          }
        >
          Generate PDF
        </Button>
        <ActionFieldSet behaviorTimes={behaviorTimes} />
        <EmotionFieldSet emotionTimes={emotionTimes} />
      </>
    );
  }
};

export default ActionEmotionOutput;
