import { Label } from "@/components/ui/label";

const EmotionFieldSet = ({
  emotionTimes,
}: {
  emotionTimes: { [emotion: string]: number };
}) => {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">Emotion :</legend>
      <Label htmlFor="emotions">
        <ul>
          {Object.entries(emotionTimes).map(([emotion, value]) => (
            <li key={emotion} style={{ marginBottom: "10px" }}>
              {emotion || "No emotion detected"}: {value.toFixed(2)} seconds
            </li>
          ))}
        </ul>
      </Label>
    </fieldset>
  );
};

export default EmotionFieldSet;
