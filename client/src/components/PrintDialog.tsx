import { useState } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Printer, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeaveApplicationData, LeaveType, ProsecutorOffice } from "@/lib/data";

interface PrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LeaveApplicationData;
  leaveTypes: LeaveType[];
  offices: ProsecutorOffice[];
}

export function PrintDialog({
  open,
  onOpenChange,
  data,
  leaveTypes,
  offices,
}: PrintDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const officeData = offices.find(o => o.id === data.officeId);
  const leaveType = leaveTypes.find(l => l.id === data.leaveTypeId);
  const leaveTypeName = leaveType 
    ? `${leaveType.group}.${leaveType.groupIndex}] ${leaveType.label}` 
    : "";
  const leaveTypeCode = leaveType?.code || "";

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Παρακαλώ επιτρέψτε τα pop-ups για την εκτύπωση');
        return;
      }

      // Generate print-friendly HTML
      const printContent = generatePrintHTML(data, leaveTypeName, leaveTypeCode, officeData);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load and then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } catch (error) {
      console.error('Error during printing:', error);
      alert('Παρουσιάστηκε σφάλμα κατά την εκτύπωση');
    } finally {
      setIsPrinting(false);
      onOpenChange(false);
    }
  };

  const generatePrintHTML = (
    data: LeaveApplicationData,
    leaveTypeName: string,
    leaveTypeCode: string,
    officeData?: ProsecutorOffice
  ) => {
    const currentDate = format(new Date(), "dd/MM/yyyy");
    
    return `
      <!DOCTYPE html>
      <html lang="el">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Αίτηση Άδειας</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: black;
            background: white;
          }
          
          .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
          }
          
          .header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20mm;
            margin-bottom: 15mm;
          }
          
          .header-left {
            font-size: 10pt;
          }
          
          .header-right {
            text-align: right;
            font-size: 10pt;
          }
          
          .office-name {
            font-weight: bold;
            margin: 3mm 0;
          }
          
          .office-details {
            font-size: 9pt;
            line-height: 1.2;
            opacity: 0.8;
            margin-top: 1mm;
          }
          
          .ministry-address {
            margin-top: 8mm;
          }
          
          .title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            text-decoration: underline;
            text-decoration-thickness: 2pt;
            text-underline-offset: 4pt;
            margin: 15mm 0;
          }
          
          .content {
            margin: 8mm 0;
          }
          
          .field-row {
            display: grid;
            grid-template-columns: 45mm 1fr;
            gap: 3mm;
            margin-bottom: 6mm;
            align-items: start;
          }
          
          .field-label {
            font-weight: bold;
            font-size: 11pt;
          }
          
          .field-value {
            font-family: 'Courier New', monospace;
            border-bottom: 1pt dotted #666;
            padding-bottom: 1mm;
            min-height: 6mm;
            line-height: 1.2;
          }
          
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20mm;
            margin-top: 25mm;
          }
          
          .signature-section {
            text-align: center;
          }
          
          .signature-label {
            font-weight: bold;
            margin-bottom: 8mm;
          }
          
          .signature-title {
            font-weight: bold;
            margin-bottom: 3mm;
          }
          
          .date-location {
            margin-top: 15mm;
            text-align: right;
          }
          
          .attachments {
            margin-top: 15mm;
            border-top: 2pt solid black;
            padding-top: 5mm;
          }
          
          .attachments-title {
            font-weight: bold;
            margin-bottom: 3mm;
          }
          
          .attachments-list {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
          }
          
          .attachments-list ol {
            margin-left: 5mm;
          }
          
          .attachments-list li {
            margin-bottom: 1mm;
          }
          
          .footer-note {
            margin-top: 5mm;
            font-size: 9pt;
            text-align: center;
            font-style: italic;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <p><strong>ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ</strong></p>
              <p>ΥΠΟΥΡΓΕΙΟ ΔΙΚΑΙΟΣΥΝΗΣ</p>
              <br />
              <p>ΠΕΡΙΦΕΡΕΙΑΚΗ ΥΠΗΡΕΣΙΑ</p>
              <p>ΔΙΚΑΣΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ</p>
              <p>ΠΟΛΙΤΙΚΟΣ ΤΟΜΕΑΣ</p>
              <div class="office-name">
                ${officeData ? officeData.name : '...'}
              </div>
              ${officeData ? `
                <div class="office-details">
                  <p>${officeData.address}, ${officeData.postalCode}</p>
                  <p>Τηλ: ${officeData.phone} | Email: ${officeData.email}</p>
                </div>
              ` : ''}
              <div class="ministry-address">
                <p><strong>ΠΡΟΣ:</strong></p>
                <p>Υπουργείο Δικαιοσύνης</p>
                <p>Δ/νση Ανθρώπινου Δυναμικού και Οργάνωσης</p>
                <p>Τμήμα Διοίκησης Ανθρώπινου Δυναμικού</p>
              </div>
            </div>
            <div class="header-right">
              <p>Ημερομηνία: ${currentDate}</p>
              <p>Αρ. Πρωτ.: _______</p>
            </div>
          </div>

          <!-- Title -->
          <div class="title">ΑΙΤΗΣΗ ΑΔΕΙΑΣ</div>

          <!-- Content -->
          <div class="content">
            <div class="field-row">
              <div class="field-label">ΟΝΟΜΑΤΕΠΩΝΥΜΟ ΥΠΑΛΛΗΛΟΥ:</div>
              <div class="field-value">${data.applicantName || '...'}</div>
            </div>

            <div class="field-row">
              <div class="field-label">ΕΙΔΟΣ ΑΔΕΙΑΣ:</div>
              <div class="field-value">${leaveTypeName} (${leaveTypeCode})</div>
            </div>

            <div class="field-row">
              <div class="field-label">ΛΟΓΟΙ:</div>
              <div class="field-value">${data.reason || '...'}</div>
            </div>

            <div class="field-row">
              <div class="field-label">ΔΙΑΡΚΕΙΑ:</div>
              <div class="field-value">
                ΑΠΟ ${data.dateFrom ? format(data.dateFrom, "dd/MM/yyyy") : '...'} 
                ΕΩΣ ${data.dateTo ? format(data.dateTo, "dd/MM/yyyy") : '...'}
                <br />
                (Σύνολο ημερών: ${data.daysCount})
              </div>
            </div>
          </div>

          <!-- Signatures -->
          <div class="signatures">
            <div class="signature-section">
              <div class="signature-label">ΣΥΜΦΩΝΩ</div>
              <div class="signature-title">
                ${
                  officeData?.hasProsecutor 
                    ? (officeData.headGender === "M" ? "Ο Κ. ΕΙΣΑΓΓΕΛΕΑΣ" : "Η Κ. ΕΙΣΑΓΓΕΛΕΑΣ")
                    : (officeData?.headGender === "M" ? "Ο Κ. ΠΡΟΕΔΡΟΣ" : "Η Κ. ΠΡΟΕΔΡΟΣ")
                }
              </div>
            </div>
            <div class="signature-section">
              <div class="signature-label">${data.applicantGender === "F" ? "Η ΑΙΤΟΥΣΑ" : "Ο ΑΙΤΩΝ"}</div>
              <div class="signature-title">Ο/Η ΠΡΟΪΣΤΑΜ.........</div>
              <div class="signature-title">ΤΟΥ ΤΜΗΜΑΤΟΣ</div>
              <div class="date-location">
                ${officeData?.city || "ΑΘΗΝΑ"}, ${currentDate}
              </div>
            </div>
          </div>

          <!-- Attachments -->
          ${data.attachments.length > 0 ? `
            <div class="attachments">
              <div class="attachments-title">ΣΥΝΗΜΜΕΝΑ ΕΓΓΡΑΦΑ:</div>
              <div class="attachments-list">
                <ol>
                  ${data.attachments.map(att => `<li>${att}</li>`).join('')}
                </ol>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="footer-note no-print">
          Αυτό το έγγραφο δημιουργήθηκε από την εφαρμογή Αίτησης Άδειας Δικαστικής Αστυνομίας
        </div>
      </body>
      </html>
    `;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Προεπισκόπηση Εκτύπωσης
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Παρακάτω βλέπετε πώς θα εμφανίζεται η αίτησή σας όταν εκτυπωθεί:
          </div>
          
          {/* Print Preview */}
          <div className="border rounded-lg bg-white shadow-sm">
            <div className="max-w-[210mm] mx-auto bg-white p-[20mm] text-[10pt] font-serif text-black leading-relaxed min-h-[297mm]">
              {/* Header */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="font-bold">ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ</p>
                  <p>ΥΠΟΥΡΓΕΙΟ ΔΙΚΑΙΟΣΥΝΗΣ</p>
                  <br />
                  <p>ΠΕΡΙΦΕΡΕΙΑΚΗ ΥΠΗΡΕΣΙΑ</p>
                  <p>ΔΙΚΑΣΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ</p>
                  <p>ΠΟΛΙΤΙΚΟΣ ΤΟΜΕΑΣ</p>
                  <div className="mt-2">
                    <p className="font-bold">
                      {officeData?.name || "..."}
                    </p>
                    {officeData && (
                      <div className="text-[8pt] leading-tight mt-1 opacity-80">
                        <p>{officeData.address}, {officeData.postalCode}</p>
                        <p>Τηλ: {officeData.phone} | Email: {officeData.email}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">ΠΡΟΣ:</p>
                    <p>Υπουργείο Δικαιοσύνης</p>
                    <p>Δ/νση Ανθρώπινου Δυναμικού και Οργάνωσης</p>
                    <p>Τμήμα Διοίκησης Ανθρώπινου Δυναμικού</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>Ημερομηνία: {format(new Date(), "dd/MM/yyyy")}</p>
                  <p>Αρ. Πρωτ.: _______</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-12">
                <h1 className="text-xl font-bold underline decoration-2 underline-offset-4">ΑΙΤΗΣΗ ΑΔΕΙΑΣ</h1>
              </div>

              {/* Body */}
              <div className="space-y-6">
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="font-bold">ΟΝΟΜΑΤΕΠΩΝΥΜΟ ΥΠΑΛΛΗΛΟΥ:</div>
                  <div className="font-mono border-b border-dotted border-black/30 pb-1">
                    {data.applicantName || "..."}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="font-bold">ΕΙΔΟΣ ΑΔΕΙΑΣ:</div>
                  <div className="font-mono border-b border-dotted border-black/30 pb-1">
                    {leaveTypeName} ({leaveTypeCode})
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="font-bold">ΛΟΓΟΙ:</div>
                  <div className="font-mono border-b border-dotted border-black/30 pb-1 min-h-[40px]">
                    {data.reason || "..."}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="font-bold">ΔΙΑΡΚΕΙΑ:</div>
                  <div className="font-mono border-b border-dotted border-black/30 pb-1">
                    ΑΠΟ {data.dateFrom ? format(data.dateFrom, "dd/MM/yyyy") : "..."} ΕΩΣ {data.dateTo ? format(data.dateTo, "dd/MM/yyyy") : "..."}
                    <span className="ml-4">(Σύνολο ημερών: {data.daysCount})</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-24 grid grid-cols-2 gap-12">
                <div className="space-y-12">
                  <div>
                    <p className="font-bold">ΣΥΜΦΩΝΩ</p>
                  </div>
                  <div>
                    <p className="font-bold">
                      {officeData?.hasProsecutor 
                        ? (officeData.headGender === "M" ? "Ο Κ. ΕΙΣΑΓΓΕΛΕΑΣ" : "Η Κ. ΕΙΣΑΓΓΕΛΕΑΣ")
                        : (officeData?.headGender === "M" ? "Ο Κ. ΠΡΟΕΔΡΟΣ" : "Η Κ. ΠΡΟΕΔΡΟΣ")
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div>
                    <p className="font-bold">{data.applicantGender === "F" ? "Η ΑΙΤΟΥΣΑ" : "Ο ΑΙΤΩΝ"}</p>
                  </div>
                  <div>
                    <p className="font-bold">Ο/Η ΠΡΟΪΣΤΑΜ.........</p>
                    <p>ΤΟΥ ΤΜΗΜΑΤΟΣ</p>
                  </div>
                  <div className="pt-8">
                    <p>{officeData?.city || "ΑΘΗΝΑ"}, {format(new Date(), "dd/MM/yyyy")}</p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {data.attachments.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-black">
                  <p className="font-bold mb-4">ΣΥΝΗΜΜΕΝΑ ΕΓΓΡΑΦΑ:</p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-sm">
                    {data.attachments.map((att, i) => (
                      <li key={i}>{att}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Ακύρωση
          </Button>
          <Button 
            onClick={handlePrint} 
            disabled={isPrinting}
            className="w-full sm:w-auto"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isPrinting ? "Προετοιμασία..." : "Εκτύπωση"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}