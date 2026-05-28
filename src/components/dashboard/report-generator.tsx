"use client";

import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Threat } from "@/types/security";

export function ReportGenerator({ threat }: { threat: Threat }) {
  function download() {
    const doc = new jsPDF();
    const issuedAt = new Date().toLocaleString();
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(8, 145, 178);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Sentinel Swarm Incident Report", 18, 14);
    doc.setFontSize(9);
    doc.text("CLASSIFICATION: CONFIDENTIAL // SOC EYES ONLY", 132, 14);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Issued: ${issuedAt}`, 18, 34);
    doc.text(`Incident: ${threat.id}`, 18, 44);
    doc.text(`Severity: ${threat.severity.toUpperCase()}`, 18, 54);
    doc.text(`Threat: ${threat.title}`, 18, 64);
    doc.text(`Vector: ${threat.vector}`, 18, 74);
    doc.text(`Target: ${threat.target}`, 18, 84);
    doc.text(`Confidence: ${threat.confidence}%`, 18, 94);
    doc.setFont("helvetica", "bold");
    doc.text("Affected Systems", 18, 112);
    doc.setFont("helvetica", "normal");
    threat.affectedSystems.forEach((system, index) => doc.text(`- ${system}`, 22, 124 + index * 8));
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Remediation", 18, 158);
    doc.setFont("helvetica", "normal");
    threat.remediation.forEach((line, index) => doc.text(`- ${line}`, 22, 170 + index * 8));
    doc.setFont("helvetica", "bold");
    doc.text("AI Analyst Summary", 18, 214);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Sentinel Swarm recommends containment approval, credential rotation, and detection rule propagation before closing this incident.",
      18,
      226,
      { maxWidth: 174 },
    );
    doc.save(`${threat.id}-sentinel-swarm-report.pdf`);
  }

  return (
    <Button onClick={download} variant="secondary" className="w-full">
      <FileDown className="h-4 w-4" />
      Download incident PDF
    </Button>
  );
}
