"use client";

import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Threat } from "@/types/security";

export function ReportGenerator({ threat }: { threat: Threat }) {
  function download() {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Sentinel Swarm Incident Report", 18, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Incident: ${threat.id}`, 18, 34);
    doc.text(`Severity: ${threat.severity.toUpperCase()}`, 18, 42);
    doc.text(`Threat: ${threat.title}`, 18, 50);
    doc.text(`Vector: ${threat.vector}`, 18, 58);
    doc.text(`Target: ${threat.target}`, 18, 66);
    doc.text("Recommended Remediation:", 18, 82);
    [
      "Enforce adaptive MFA for risky sessions.",
      "Rotate exposed credentials and tokens.",
      "Quarantine affected workloads pending forensic review.",
      "Deploy detection rule updates to SIEM and EDR.",
    ].forEach((line, index) => doc.text(`- ${line}`, 22, 94 + index * 8));
    doc.save(`${threat.id}-sentinel-swarm-report.pdf`);
  }

  return (
    <Button onClick={download} variant="secondary" className="w-full">
      <FileDown className="h-4 w-4" />
      Download incident PDF
    </Button>
  );
}
