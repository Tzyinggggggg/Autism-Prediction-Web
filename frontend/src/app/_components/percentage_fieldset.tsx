import { Label } from "@/components/ui/label";

const PercentageFieldSet = ({ percentage }: { percentage: number }) => {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Autism Percentage
      </legend>
      <div className="grid gap-3">
        <Label>Severity : {percentage}%</Label>
      </div>
    </fieldset>
  );
};

export default PercentageFieldSet;
