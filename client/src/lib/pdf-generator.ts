import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { LeaveApplicationData, LeaveType, ProsecutorOffice } from "./data";
import { fontBase64 } from "./fonts/Roboto-Regular-normal"; // We will need to create this
import { fontBoldBase64 } from "./fonts/Roboto-Bold-bold"; // We will need to create this

// Helper to load fonts if not already loaded
const loadFonts = (doc: jsPDF) => {
  console.log("Regular font preview:", fontBase64.substring(0, 100));
  console.log("Regular font length:", fontBase64.length);
  console.log("Bold font preview:", fontBoldBase64.substring(0, 100));
  console.log("Bold font length:", fontBoldBase64.length);
  // Check if font is already added to avoid duplicates/errors
  if (doc.getFontList().Roboto) {
    return;
  }

  try {
    // Add Regular
    doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    // Add Bold
    doc.addFileToVFS("Roboto-Bold.ttf", fontBoldBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  } catch (e) {
    console.error("Error loading fonts:", e);
  }
};

export const generatePDF = (
  data: LeaveApplicationData,
  settings: { leaveTypes: LeaveType[]; offices: ProsecutorOffice[] }
) => {
  const doc = new jsPDF();
  
  // Load Fonts (We need to ensure we have a Greek-supporting font)
  // For this environment, I'll assume we've set up the fonts correctly.
  // If not, I'll use a fallback or the user will see garbage text for Greek.
  // CRITICAL: jsPDF needs a custom font for Greek.
  
  loadFonts(doc);

  const officeData = settings.offices.find(o => o.id === data.officeId);
  const officeName = officeData?.name || "";
  const leaveType = settings.leaveTypes.find(l => l.id === data.leaveTypeId);
  const leaveTypeName = leaveType ? `${leaveType.group}.${leaveType.groupIndex}] ${leaveType.label}` : "";
  const leaveTypeCode = leaveType?.code || "";

  // --- Header ---
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold");
  doc.text("ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ", 20, 20);
  doc.text("ΥΠΟΥΡΓΕΙΟ ΔΙΚΑΙΟΣΥΝΗΣ", 20, 25);
  
  doc.text("ΠΕΡΙΦΕΡΕΙΑΚΗ ΥΠΗΡΕΣΙΑ", 20, 35);
  doc.text("ΔΙΚΑΣΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ", 20, 40);
  doc.text("ΠΟΛΙΤΙΚΟΣ ΤΟΜΕΑΣ", 20, 45);
  
  // Split office name if too long
  const splitOffice = doc.splitTextToSize(officeName, 80);
  doc.text(splitOffice, 20, 50);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  
  doc.text(`Ταχ. Διεύθυνση: ${data.contactAddress}`, 20, 65);
  doc.text(`Ταχ. Κώδικας: ${data.contactPostalCode}`, 20, 70);
  doc.text(`Τηλέφωνο: ${data.contactPhone}`, 20, 75);
  doc.text(`Email: ${data.contactEmail}`, 20, 80);

  doc.setFontSize(10);
  doc.text(`ΗΜ/ΜΜ/ΕΤΟΣ: ${format(data.dateRequest, "dd/MM/yyyy")}`, 150, 20);
  doc.text("Αρ. Πρωτ.", 150, 25);

  // --- ΠΡΟΣ ---
  doc.setFont("Roboto", "bold");
  doc.text("ΠΡΟΣ:", 150, 40);
  doc.setFont("Roboto", "normal");
  doc.text("Υπουργείο Δικαιοσύνης", 150, 45);
  doc.text("Δ/νση Ανθρώπινου Δυναμικού", 150, 50);
  doc.text("και Οργάνωσης", 150, 55);
  doc.text("Τμήμα Διοίκησης", 150, 60);
  doc.text("Ανθρώπινου Δυναμικού", 150, 65);

  // --- Title ---
  doc.setFontSize(14);
  doc.setFont("Roboto", "bold");
  const title = "ΑΙΤΗΣΗ ΑΔΕΙΑΣ";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (210 - titleWidth) / 2, 105);

  // --- Body ---
  let y = 120;
  const leftCol = 20;
  const rightCol = 80;
  const lineHeight = 10;

  doc.setFontSize(11);
  
  // Name
  doc.setFont("Roboto", "bold");
  doc.text("ΟΝΟΜΑΤΕΠΩΝΥΜΟ ΥΠΑΛΛΗΛΟΥ:", leftCol, y);
  doc.setFont("Roboto", "normal");
  doc.text(data.applicantName, rightCol, y);
  y += lineHeight;

  // Service
  doc.setFont("Roboto", "bold");
  doc.text("ΥΠΗΡΕΣΙΑ ΣΤΗΝ ΟΠΟΙΑ ΥΠΗΡΕΤΕΙ:", leftCol, y);
  doc.setFont("Roboto", "normal");
  doc.text(data.applicantService, rightCol, y);
  y += lineHeight;

  // Leave Type
  doc.setFont("Roboto", "bold");
  doc.text("ΕΙΔΟΣ ΑΔΕΙΑΣ:", leftCol, y);
  doc.setFont("Roboto", "normal");
  const splitLeave = doc.splitTextToSize(`${leaveTypeName} (${leaveTypeCode})`, 110);
  doc.text(splitLeave, rightCol, y);
  y += (lineHeight * splitLeave.length);

  // Reason
  // Ensure font is set after loading
  doc.setFont("Roboto", "bold");
  doc.text("ΛΟΓΟΙ:", leftCol, y);
  doc.setFont("Roboto", "normal");
  const splitReason = doc.splitTextToSize(data.reason, 110);
  doc.text(splitReason, rightCol, y);
  y += (lineHeight * Math.max(1, splitReason.length)) + 5;

  // Duration
  doc.setFont("Roboto", "bold");
  doc.text("ΔΙΑΡΚΕΙΑ:", leftCol, y);
  doc.setFont("Roboto", "normal");
  const dateStr = `ΑΠΟ ${data.dateFrom ? format(data.dateFrom, "dd/MM/yyyy") : "..."} ΕΩΣ ${data.dateTo ? format(data.dateTo, "dd/MM/yyyy") : "..."}`;
  doc.text(dateStr, rightCol, y);
  y += lineHeight;
  
  doc.text(`(Σύνολο ημερών: ${data.daysCount})`, rightCol, y);
  y += lineHeight * 2;

  // --- Signatures ---
  const sigY = 240;
  
  doc.setFont("Roboto", "bold");
  const applicantTitle = data.applicantGender === "M" ? "Ο ΑΙΤΩΝ" : "Η ΑΙΤΟΥΣΑ";
  doc.text(applicantTitle, 30, sigY);
  doc.text("ΣΥΜΦΩΝΩ", 100, sigY);
  
  const headTitle = officeData?.hasProsecutor 
    ? (officeData.headGender === "M" ? "Ο Κ. ΕΙΣΑΓΓΕΛΕΑΣ" : "Η Κ. ΕΙΣΑΓΓΕΛΕΑΣ")
    : (officeData?.headGender === "M" ? "Ο Κ. ΠΡΟΕΔΡΟΣ" : "Η Κ. ΠΡΟΕΔΡΟΣ");
    
  doc.text(headTitle, 30, sigY + 15);
  doc.text("Ο/Η ΠΡΟΪΣΤΑΜ.........", 140, sigY + 15);
  doc.text("ΤΟΥ ΤΜΗΜΑΤΟΣ", 140, sigY + 20);

  doc.setFont("Roboto", "normal");
  const location = officeData?.city || "ΑΘΗΝΑ";
  doc.text(`${location}, ${format(data.dateRequest, "dd/MM/yyyy")}`, 140, sigY + 40);

  // --- Attachments Page (if any) ---
  if (data.attachments.length > 0) {
    doc.addPage();
    doc.setFont("Roboto", "bold");
    doc.setFontSize(14);
    doc.text("ΣΥΝΗΜΜΕΝΑ ΕΓΓΡΑΦΑ", 20, 20);
    
    doc.setFont("Roboto", "normal");
    doc.setFontSize(11);
    let attachY = 40;
    data.attachments.forEach((att, index) => {
      doc.text(`${index + 1}. ${att}`, 20, attachY);
      attachY += 10;
    });
  }

  doc.save("aitisi_adeias.pdf");
};
