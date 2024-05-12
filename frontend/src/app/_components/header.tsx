import JsPDF from "jspdf";
import { Button } from "@/components/ui/button";

const Header = () => {
  const generatePDF = () => {
    const reportElement = document.querySelector(".pdf-content") as HTMLElement;
    if (reportElement) {
      const report = new JsPDF("portrait", "pt", "a4");
      report.html(reportElement).then(() => {
        report.save("report.pdf");
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 className="text-xl font-semibold">Autism Prediction</h1>
      <div className="ml-auto gap-1.5 text-sm">
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
