import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays } from "date-fns";
import { el } from "date-fns/locale";
import { CalendarIcon, FileText, Plus, Trash2, Printer, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LeaveApplicationData } from "@/lib/data";
import { generatePDF } from "@/lib/pdf-generator";
import { useSettings } from "@/hooks/useSettings";
import { SettingsDialog } from "@/components/SettingsDialog";

const formSchema = z.object({
  officeId: z.string().min(1, "Επιλέξτε εισαγγελία"),
  leaveTypeId: z.string().min(1, "Επιλέξτε είδος άδειας"),
  applicantName: z.string().min(2, "Το ονοματεπώνυμο είναι υποχρεωτικό"),
  applicantService: z.string().min(2, "Η υπηρεσία είναι υποχρεωτική"),
  applicantGender: z.enum(["M", "F"]),
  reason: z.string().optional(),
  dateFrom: z.date(),
  dateTo: z.date(),
});

export default function Home() {
  const {
    leaveTypes,
    offices,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType,
    addOffice,
    updateOffice,
    deleteOffice,
  } = useSettings();

  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      applicantService: "",
      applicantGender: "M",
      reason: "",
    },
  });

  const watchAllFields = form.watch();

  // Auto-fill contact details when office changes
  const handleOfficeChange = (officeId: string) => {
    form.setValue("officeId", officeId);
  };
  const daysCount = watchAllFields.dateFrom && watchAllFields.dateTo 
    ? differenceInDays(watchAllFields.dateTo, watchAllFields.dateFrom) + 1 
    : 0;

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setAttachments([...attachments, newAttachment.trim()]);
      setNewAttachment("");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const office = offices.find(o => o.id === values.officeId);
    const data: LeaveApplicationData = {
      ...values,
      reason: values.reason || "",
      daysCount: daysCount > 0 ? daysCount : 0,
      attachments,
      location: office?.city || "ΑΘΗΝΑ",
      dateRequest: new Date(),
    };
    generatePDF(data, { leaveTypes, offices });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans text-foreground">
      {/* Left Panel: Form Input */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto border-r border-border bg-background">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Αίτηση Άδειας</h1>
              <p className="text-muted-foreground">
                Συμπληρώστε τα στοιχεία για την έκδοση της αίτησης άδειας Δικαστικής Αστυνομίας.
              </p>
            </div>
            <SettingsDialog
              leaveTypes={leaveTypes}
              offices={offices}
              onAddLeaveType={addLeaveType}
              onUpdateLeaveType={updateLeaveType}
              onDeleteLeaveType={deleteLeaveType}
              onAddOffice={addOffice}
              onUpdateOffice={updateOffice}
              onDeleteOffice={deleteOffice}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section 1: Υπηρεσιακά Στοιχεία */}
              <div className="space-y-4 border-l-4 border-primary pl-4 py-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Υπηρεσιακά Στοιχεία
                </h2>
                
                <FormField
                  control={form.control}
                  name="officeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Εισαγγελία / Υπηρεσία</FormLabel>
                      <Select onValueChange={handleOfficeChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue placeholder="Επιλέξτε υπηρεσία..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {offices.map((office) => (
                            <SelectItem key={office.id} value={office.id}>
                              <div className="flex flex-col">
                                <span className="font-bold">{office.name}</span>
                                <span className="text-xs opacity-70">
                                  {office.address}, {office.postalCode} | Τηλ: {office.phone} | Email: {office.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaveTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Είδος Άδειας</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue placeholder="Επιλέξτε είδος άδειας..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ΟΜΑΔΑ Α</div>
                          {leaveTypes.filter(t => t.group === "A").sort((a,b) => a.groupIndex - b.groupIndex).map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.group}.{type.groupIndex}] {type.label}
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">ΟΜΑΔΑ Β</div>
                          {leaveTypes.filter(t => t.group === "B").sort((a,b) => a.groupIndex - b.groupIndex).map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.group}.{type.groupIndex}] {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 2: Προσωπικά Στοιχεία */}
              <div className="space-y-4 border-l-4 border-primary pl-4 py-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Προσωπικά Στοιχεία
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ονοματεπώνυμο</FormLabel>
                        <FormControl>
                          <Input placeholder="π.χ. ΓΕΩΡΓΙΟΣ ΠΑΠΑΔΟΠΟΥΛΟΣ" className="font-mono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applicantService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Υπηρεσία Υπηρέτησης</FormLabel>
                        <FormControl>
                          <Input placeholder="π.χ. ΤΜΗΜΑ ΔΙΟΙΚΗΤΙΚΟΥ" className="font-mono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="applicantGender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Φύλο (για τίτλο αίτησης)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono">
                            <SelectValue placeholder="Επιλέξτε φύλο" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Άντρας (Ο ΑΙΤΩΝ)</SelectItem>
                          <SelectItem value="F">Γυναίκα (Η ΑΙΤΟΥΣΑ)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Λόγοι (Προαιρετικό)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Αιτιολογία άδειας..." 
                          className="font-mono min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 3: Διάρκεια */}
              <div className="space-y-4 border-l-4 border-primary pl-4 py-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Διάρκεια Άδειας
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Από</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal font-mono",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: el })
                                ) : (
                                  <span>Επιλογή ημερομηνίας</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Έως</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal font-mono",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: el })
                                ) : (
                                  <span>Επιλογή ημερομηνίας</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => 
                                watchAllFields.dateFrom ? date < watchAllFields.dateFrom : false
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {daysCount > 0 && (
                  <div className="text-sm font-medium text-primary bg-primary/10 p-2 rounded inline-block">
                    Σύνολο ημερών: {daysCount}
                  </div>
                )}
              </div>


              {/* Section 5: Συνημμένα */}
              <div className="space-y-4 border-l-4 border-primary pl-4 py-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Συνημμένα Έγγραφα
                </h2>
                
                <div className="flex gap-2">
                  <Input 
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    placeholder="Τίτλος συνημμένου..."
                    className="font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAttachment();
                      }
                    }}
                  />
                  <Button type="button" onClick={addAttachment} variant="secondary">
                    <Plus className="w-4 h-4 mr-2" /> Προσθήκη
                  </Button>
                </div>

                {attachments.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {attachments.map((att, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm font-mono">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {att}
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeAttachment(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6">
                <Button type="submit" size="lg" className="w-full md:w-auto font-bold text-lg h-12 px-8 shadow-lg hover:shadow-xl transition-all">
                  <Printer className="w-5 h-5 mr-2" />
                  Εκτύπωση PDF
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Panel: Live Preview (Simplified Visual Representation) */}
      <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-y-auto sticky top-0 h-screen">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[20mm] relative text-[10pt] font-serif text-black leading-relaxed">
          {/* Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="font-bold">ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ</p>
              <p>ΥΠΟΥΡΓΕΙΟ ΔΙΚΑΙΟΣΥΝΗΣ</p>
              <br />
              <p>ΠΕΡΙΦΕΡΕΙΑΚΗ ΥΠΗΡΕΣΙΑ</p>
              <p>ΔΙΚΑΣΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ</p>
              <p>ΠΟΛΙΤΙΚΟΣ ΤΟΜΕΑΣ</p>
              <p className="font-bold mt-2">
                {offices.find(o => o.id === watchAllFields.officeId)?.name || "..."}
              </p>
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
                {watchAllFields.applicantName || "..."}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="font-bold">ΥΠΗΡΕΣΙΑ ΣΤΗΝ ΟΠΟΙΑ ΥΠΗΡΕΤΕΙ:</div>
              <div className="font-mono border-b border-dotted border-black/30 pb-1">
                {watchAllFields.applicantService || "..."}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="font-bold">ΕΙΔΟΣ ΑΔΕΙΑΣ:</div>
              <div className="font-mono border-b border-dotted border-black/30 pb-1">
                {leaveTypes.find(l => l.id === watchAllFields.leaveTypeId)?.label || "..."}
                <span className="block text-xs text-muted-foreground mt-1">
                  {leaveTypes.find(l => l.id === watchAllFields.leaveTypeId)?.code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="font-bold">ΛΟΓΟΙ:</div>
              <div className="font-mono border-b border-dotted border-black/30 pb-1 min-h-[40px]">
                {watchAllFields.reason || "..."}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="font-bold">ΔΙΑΡΚΕΙΑ:</div>
              <div className="font-mono border-b border-dotted border-black/30 pb-1">
                ΑΠΟ {watchAllFields.dateFrom ? format(watchAllFields.dateFrom, "dd/MM/yyyy") : "..."} ΕΩΣ {watchAllFields.dateTo ? format(watchAllFields.dateTo, "dd/MM/yyyy") : "..."}
                {daysCount > 0 && <span className="ml-4">(Σύνολο ημερών: {daysCount})</span>}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-24 grid grid-cols-2 gap-12">
            <div className="space-y-12">
              <div>
                <p className="font-bold">{watchAllFields.applicantGender === "F" ? "Η ΑΙΤΟΥΣΑ" : "Ο ΑΙΤΩΝ"}</p>
              </div>
              <div>
                <p className="font-bold">
                  {(() => {
                    const office = offices.find(o => o.id === watchAllFields.officeId);
                    if (!office) return "Ο/Η Κ. ΕΙΣΑΓΓΕΛΕΑΣ/Κ. ΠΡΟΕΔΡΟΣ";
                    const title = office.hasProsecutor ? "ΕΙΣΑΓΓΕΛΕΑΣ" : "ΠΡΟΕΔΡΟΣ";
                    const prefix = office.headGender === "F" ? "Η Κ." : "Ο Κ.";
                    return `${prefix} ${title}`;
                  })()}
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <p className="font-bold">ΣΥΜΦΩΝΩ</p>
              </div>
              <div>
                <p className="font-bold">Ο/Η ΠΡΟΪΣΤΑΜ.........</p>
                <p>ΤΟΥ ΤΜΗΜΑΤΟΣ</p>
              </div>
              <div className="pt-8">
                <p>{offices.find(o => o.id === watchAllFields.officeId)?.city || "ΑΘΗΝΑ"}, {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-black">
              <p className="font-bold mb-4">ΣΥΝΗΜΜΕΝΑ ΕΓΓΡΑΦΑ:</p>
              <ol className="list-decimal list-inside space-y-1 font-mono text-sm">
                {attachments.map((att, i) => (
                  <li key={i}>{att}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
