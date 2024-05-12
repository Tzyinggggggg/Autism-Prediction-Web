import { Label } from "@/components/ui/label";

const ActionFieldSet = ({ behaviorTimes }: any) => {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">Result</legend>
      <div className="grid gap-3">
        <Label style={{ marginTop: "10px" }}>
          Self-stimulatory behavior :
          <ul style={{ marginTop: "20px" }}>
            <li style={{ marginBottom: "10px" }}>
              Normal : {behaviorTimes?.normal.toFixed(2)} seconds
            </li>
            <li style={{ marginBottom: "10px" }}>
              Head Banging : {behaviorTimes?.headbanging.toFixed(2)} seconds
            </li>
            <li style={{ marginBottom: "10px" }}>
              Armflapping : {behaviorTimes?.armflapping.toFixed(2)} seconds
            </li>
            <li style={{ marginBottom: "10px" }}>
              Spinning : {behaviorTimes?.spinning.toFixed(2)} seconds
            </li>
          </ul>
        </Label>
      </div>
    </fieldset>
  );
};

export default ActionFieldSet;
