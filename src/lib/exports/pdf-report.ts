import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
  jobId: string;
  address: string;
  inspectionDate: string;
  imageCount: number;
  findings: {
    damage_type: string;
    severity: string;
    confidence: number;
    notes?: string | null;
  }[];
  measurements?: {
    areaSqft: number;
    perimeterFt: number;
    estimatedSquares: number;
    edges: { lengthFt: number }[];
  } | null;
}

const DAMAGE_LABELS: Record<string, string> = {
  hail: "Hail Damage",
  wind: "Wind Damage",
  impact: "Impact Damage",
  granule_loss: "Granule Loss",
  cracking: "Cracking",
  missing_shingle: "Missing Shingle",
  flashing_damage: "Flashing Damage",
  ponding: "Ponding",
  debris: "Debris",
  mechanical: "Mechanical Damage",
  other: "Other",
};

export function generatePDFReport(data: ReportData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ─── Header ───────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PROPERTY INSPECTION REPORT", 20, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Apex Drone Solutions", 20, 32);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 20, 38);

  doc.setFontSize(9);
  doc.text(`Report ID: ${data.jobId.slice(0, 8).toUpperCase()}`, pageWidth - 20, 32, { align: "right" });

  y = 55;

  // ─── Property Info ────────────────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Property Information", 20, y);
  y += 8;

  doc.setDrawColor(59, 130, 246); // blue-500
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const propertyInfo = [
    ["Address", data.address],
    ["Inspection Date", data.inspectionDate],
    ["Images Analyzed", String(data.imageCount)],
    ["Total Findings", String(data.findings.length)],
  ];

  propertyInfo.forEach(([label, value]) => {
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(label + ":", 20, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(value, 80, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  });

  y += 5;

  // ─── Measurements ─────────────────────────────────────────
  if (data.measurements) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Roof Measurements", 20, y);
    y += 8;

    doc.setDrawColor(59, 130, 246);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    const measurementData = [
      ["Roof Area", `${data.measurements.areaSqft.toLocaleString()} sqft`],
      ["Perimeter", `${data.measurements.perimeterFt.toLocaleString()} ft`],
      ["Roofing Squares", String(data.measurements.estimatedSquares)],
      ["Edge Count", String(data.measurements.edges.length)],
    ];

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    measurementData.forEach(([label, value]) => {
      doc.setTextColor(107, 114, 128);
      doc.text(label + ":", 20, y);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(value, 80, y);
      doc.setFont("helvetica", "normal");
      y += 6;
    });
    y += 5;
  }

  // ─── Damage Summary ───────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Damage Summary", 20, y);
  y += 8;

  doc.setDrawColor(59, 130, 246);
  doc.line(20, y, pageWidth - 20, y);
  y += 4;

  // Aggregate by type
  const summary: Record<string, { count: number; maxSeverity: string }> = {};
  data.findings.forEach((f) => {
    if (!summary[f.damage_type]) {
      summary[f.damage_type] = { count: 0, maxSeverity: f.severity };
    }
    summary[f.damage_type].count++;
    const order = ["low", "medium", "high", "critical"];
    if (order.indexOf(f.severity) > order.indexOf(summary[f.damage_type].maxSeverity)) {
      summary[f.damage_type].maxSeverity = f.severity;
    }
  });

  const summaryRows = Object.entries(summary).map(([type, info]) => [
    DAMAGE_LABELS[type] || type,
    info.maxSeverity.charAt(0).toUpperCase() + info.maxSeverity.slice(1),
    String(info.count),
  ]);

  if (summaryRows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Damage Type", "Max Severity", "Count"]],
      body: summaryRows,
      theme: "striped",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("No damage findings detected.", 20, y);
    y += 10;
  }

  // ─── Detailed Findings ────────────────────────────────────
  if (data.findings.length > 0) {
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Detailed Findings", 20, y);
    y += 8;

    doc.setDrawColor(59, 130, 246);
    doc.line(20, y, pageWidth - 20, y);
    y += 4;

    const findingRows = data.findings.map((f, i) => [
      String(i + 1),
      DAMAGE_LABELS[f.damage_type] || f.damage_type,
      f.severity.charAt(0).toUpperCase() + f.severity.slice(1),
      `${Math.round(f.confidence * 100)}%`,
      f.notes?.slice(0, 60) || "—",
    ]);

    autoTable(doc, {
      startY: y,
      head: [["#", "Type", "Severity", "Confidence", "Notes"]],
      body: findingRows,
      theme: "striped",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 },
        4: { cellWidth: 50 },
      },
      margin: { left: 20, right: 20 },
    });
  }

  // ─── Footer ───────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Apex Drone Solutions — Confidential — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
}
