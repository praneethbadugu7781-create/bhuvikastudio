import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Declare autotable on jsPDF to satisfy TypeScript compiler
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function exportToCSV(filename: string, headers: string[], rows: any[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map(row => 
      row.map(val => {
        const str = val === null || val === undefined ? "" : String(val);
        // Escape quotes for CSV compliance
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(filename: string, title: string, headers: string[], rows: any[][]) {
  const doc = new jsPDF();
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(127, 62, 71); // brand-900 color: #7f3e47
  doc.text(title, 14, 22);

  // Subtitle / Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 28);
  
  // Table
  doc.autoTable({
    startY: 34,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [127, 62, 71] }, // brand-900
    styles: { font: "helvetica", fontSize: 9 },
    columnStyles: { text: { overflow: "visible" } }
  });

  doc.save(`${filename}.pdf`);
}
