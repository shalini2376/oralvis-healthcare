import jsPDF from "jspdf";

export const generatePDF = (scan) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Patient Scan Report", 105, 20, { align: "center" });

  // Patient Info
  doc.setFontSize(12);
  doc.text(`Patient Name: ${scan.patientName}`, 20, 40);
  doc.text(`Patient ID: ${scan.patientId}`, 20, 50);
  doc.text(`Scan Type: ${scan.scanType}`, 20, 60);
  doc.text(`Region: ${scan.region}`, 20, 70);
  doc.text(
    `Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`,
    20,
    80
  );

  // Add Image
  const img = new Image();
  img.crossOrigin = "anonymous"; // important for Cloudinary images
  img.src = scan.imageUrl;

  img.onload = () => {
    doc.addImage(img, "JPEG", 20, 100, 170, 100); // adjusting size
    doc.save(`Scan_Report_${scan.patientId}.pdf`);
  };
};
