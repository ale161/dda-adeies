import { useState } from "react";
import { Settings, Plus, Trash2, Edit2, Save, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaveType, ProsecutorOffice, Holiday } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsDialogProps {
  leaveTypes: LeaveType[];
  offices: ProsecutorOffice[];
  holidays: Holiday[];
  onAddLeaveType: (type: LeaveType) => void;
  onUpdateLeaveType: (type: LeaveType) => void;
  onDeleteLeaveType: (id: string) => void;
  onAddOffice: (office: ProsecutorOffice) => void;
  onUpdateOffice: (office: ProsecutorOffice) => void;
  onDeleteOffice: (id: string) => void;
  onAddHoliday: (holiday: Holiday) => void;
  onUpdateHoliday: (holiday: Holiday) => void;
  onDeleteHoliday: (id: string) => void;
  onImportHolidaysFromAPI: (year: number) => Promise<void>;
}

export function SettingsDialog({
  leaveTypes,
  offices,
  holidays,
  onAddLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
  onAddOffice,
  onUpdateOffice,
  onDeleteOffice,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
  onImportHolidaysFromAPI,
}: SettingsDialogProps) {
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [editingOffice, setEditingOffice] = useState<ProsecutorOffice | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [importYear, setImportYear] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [newRequiredDocument, setNewRequiredDocument] = useState<string>("");

  const handleSaveLeaveType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: LeaveType = {
      id: editingLeaveType?.id || Math.random().toString(36).substr(2, 9),
      label: formData.get("label") as string,
      code: formData.get("code") as string,
      group: formData.get("group") as "A" | "B",
      groupIndex: parseInt(formData.get("groupIndex") as string),
      excludeHolidaysAndWeekends: formData.get("excludeHolidaysAndWeekends") === "on",
      requiredDocuments: editingLeaveType?.requiredDocuments || [],
    };

    if (editingLeaveType) {
      onUpdateLeaveType(data);
    } else {
      onAddLeaveType(data);
    }
    setEditingLeaveType(null);
    e.currentTarget.reset();
    setNewRequiredDocument("");
  };

  const addRequiredDocument = () => {
    if (newRequiredDocument.trim() && editingLeaveType) {
      const updatedLeaveType = {
        ...editingLeaveType,
        requiredDocuments: [...editingLeaveType.requiredDocuments, newRequiredDocument.trim()]
      };
      setEditingLeaveType(updatedLeaveType);
      setNewRequiredDocument("");
    }
  };

  const removeRequiredDocument = (index: number) => {
    if (editingLeaveType) {
      const updatedLeaveType = {
        ...editingLeaveType,
        requiredDocuments: editingLeaveType.requiredDocuments.filter((_, i) => i !== index)
      };
      setEditingLeaveType(updatedLeaveType);
    }
  };

  const handleSaveOffice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ProsecutorOffice = {
      id: editingOffice?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      postalCode: formData.get("postalCode") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      city: formData.get("city") as string,
      hasProsecutor: formData.get("hasProsecutor") === "true",
      headGender: formData.get("headGender") as "M" | "F",
    };

    if (editingOffice) {
      onUpdateOffice(data);
    } else {
      onAddOffice(data);
    }
    setEditingOffice(null);
    e.currentTarget.reset();
  };

  const handleSaveHoliday = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Holiday = {
      id: editingHoliday?.id || Math.random().toString(36).substr(2, 9),
      date: formData.get("date") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isFixed: formData.get("isFixed") === "true",
    };

    if (editingHoliday) {
      onUpdateHoliday(data);
    } else {
      onAddHoliday(data);
    }
    setEditingHoliday(null);
    e.currentTarget.reset();
  };

  const handleImportHolidays = async () => {
    if (!importYear.trim()) return;
    
    const year = parseInt(importYear);
    if (isNaN(year) || year < 2020 || year > 2030) {
      alert("Παρακαλώ εισάγετε ένα έγκυρο έτος (2020-2030)");
      return;
    }

    setIsImporting(true);
    try {
      await onImportHolidaysFromAPI(year);
      setImportYear("");
      alert(`Επιτυχής εισαγωγή αργιών για το έτος ${year}`);
    } catch (error) {
      alert("Σφάλμα κατά την εισαγωγή αργιών. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ρυθμίσεις Εφαρμογής</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="leave-types">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leave-types">Είδη Αδείας</TabsTrigger>
            <TabsTrigger value="offices">Εισαγγελίες / Υπηρεσίες</TabsTrigger>
            <TabsTrigger value="holidays">Αργίες</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-types" className="space-y-4">
            <form onSubmit={handleSaveLeaveType} className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Τίτλος Άδειας</Label>
                  <Input name="label" defaultValue={editingLeaveType?.label} required />
                </div>
                <div className="space-y-2">
                  <Label>Νομικό Πλαίσιο (Code)</Label>
                  <Input name="code" defaultValue={editingLeaveType?.code} required />
                </div>
                <div className="space-y-2">
                  <Label>Ομάδα</Label>
                  <Select name="group" defaultValue={editingLeaveType?.group || "A"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Ομάδα Α</SelectItem>
                      <SelectItem value="B">Ομάδα Β</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Αύξων Αριθμός Ομάδας</Label>
                  <Input name="groupIndex" type="number" defaultValue={editingLeaveType?.groupIndex || 1} required />
                </div>
              </div>
              
              {/* Exclusion Settings */}
              <div className="space-y-3 p-3 border rounded bg-background">
                <Label className="text-sm font-medium">Ρυθμίσεις Ημερών</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="excludeHolidaysAndWeekends"
                    name="excludeHolidaysAndWeekends"
                    defaultChecked={editingLeaveType?.excludeHolidaysAndWeekends || false}
                  />
                  <Label htmlFor="excludeHolidaysAndWeekends" className="text-sm">
                    Εξαίρεση αργιών και σαββατοκύριακων για αυτό το είδος άδειας
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Εάν ενεργοποιηθεί, θα αντικαθιστά την καθολική ρύθμιση
                </p>
              </div>

              {/* Required Documents */}
              {editingLeaveType && (
                <div className="space-y-3 p-3 border rounded bg-background">
                  <Label className="text-sm font-medium">Υποχρεωτικά Έγγραφα</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newRequiredDocument}
                      onChange={(e) => setNewRequiredDocument(e.target.value)}
                      placeholder="Τίτλος εγγράφου..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequiredDocument();
                        }
                      }}
                    />
                    <Button type="button" onClick={addRequiredDocument} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Προσθήκη
                    </Button>
                  </div>
                  {editingLeaveType.requiredDocuments.length > 0 && (
                    <div className="space-y-1">
                      {editingLeaveType.requiredDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                          <span>{doc}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeRequiredDocument(index)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                {editingLeaveType && (
                  <Button type="button" variant="ghost" onClick={() => setEditingLeaveType(null)}>
                    <X className="h-4 w-4 mr-2" /> Ακύρωση
                  </Button>
                )}
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> {editingLeaveType ? "Ενημέρωση" : "Προσθήκη"}
                </Button>
              </div>
            </form>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-2">
                {leaveTypes.sort((a, b) => a.group.localeCompare(b.group) || a.groupIndex - b.groupIndex).map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div>
                      <span className="font-bold mr-2">{type.group}.{type.groupIndex}</span>
                      <span>{type.label}</span>
                      <p className="text-xs text-muted-foreground">{type.code}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingLeaveType(type)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onDeleteLeaveType(type.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="offices" className="space-y-4">
            <form onSubmit={handleSaveOffice} className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2 col-span-2">
                <Label>Όνομα Υπηρεσίας</Label>
                <Input name="name" defaultValue={editingOffice?.name} required />
              </div>
              <div className="space-y-2">
                <Label>Διεύθυνση</Label>
                <Input name="address" defaultValue={editingOffice?.address} required />
              </div>
              <div className="space-y-2">
                <Label>Τ.Κ.</Label>
                <Input name="postalCode" defaultValue={editingOffice?.postalCode} required />
              </div>
              <div className="space-y-2">
                <Label>Τηλέφωνο</Label>
                <Input name="phone" defaultValue={editingOffice?.phone} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" defaultValue={editingOffice?.email} required />
              </div>
              <div className="space-y-2">
                <Label>Πόλη (για ημερομηνία)</Label>
                <Input name="city" defaultValue={editingOffice?.city} required />
              </div>
              <div className="space-y-2">
                <Label>Τίτλος Προϊσταμένου</Label>
                <Select name="hasProsecutor" defaultValue={editingOffice?.hasProsecutor ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Εισαγγελέας</SelectItem>
                    <SelectItem value="false">Πρόεδρος</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Φύλο Προϊσταμένου</Label>
                <Select name="headGender" defaultValue={editingOffice?.headGender || "M"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Άνδρας</SelectItem>
                    <SelectItem value="F">Γυναίκα</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                {editingOffice && (
                  <Button type="button" variant="ghost" onClick={() => setEditingOffice(null)}>
                    <X className="h-4 w-4 mr-2" /> Ακύρωση
                  </Button>
                )}
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> {editingOffice ? "Ενημέρωση" : "Προσθήκη"}
                </Button>
              </div>
            </form>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-2">
                {offices.map((office) => (
                  <div key={office.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div>
                      <span className="font-bold">{office.name}</span>
                      <p className="text-xs text-muted-foreground">{office.city} - {office.phone}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingOffice(office)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onDeleteOffice(office.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="holidays" className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <div className="space-y-2">
                <Label>Εισαγωγή Αργιών από API</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={importYear} 
                    onChange={(e) => setImportYear(e.target.value)}
                    placeholder="Ετος (π.χ. 2024)" 
                    className="flex-1"
                    min="2020" 
                    max="2030"
                  />
                  <Button 
                    type="button" 
                    onClick={handleImportHolidays} 
                    disabled={isImporting || !importYear.trim()}
                  >
                    <Download className="h-4 w-4 mr-2" /> 
                    {isImporting ? "Εισαγωγή..." : "Εισαγωγή"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Εισαγωγή αργιών από το www.argies.gr για το καθορισμένο έτος
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveHoliday} className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ημερομηνία (MM-DD ή YYYY-MM-DD)</Label>
                  <Input name="date" defaultValue={editingHoliday?.date} placeholder="π.χ. 12-25 ή 2024-12-25" required />
                </div>
                <div className="space-y-2">
                  <Label>Ονομα Αργίας</Label>
                  <Input name="name" defaultValue={editingHoliday?.name} placeholder="π.χ. Χριστούγεννα" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Περιγραφή (Προαιρετικό)</Label>
                  <Input name="description" defaultValue={editingHoliday?.description} placeholder="π.χ. Αγίου Σπυρίδωνα" />
                </div>
                <div className="space-y-2">
                  <Label>Σταθερή Ημερομηνία</Label>
                  <Select name="isFixed" defaultValue={editingHoliday?.isFixed ? "true" : "false"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ναι (π.χ. Χριστούγεννα)</SelectItem>
                      <SelectItem value="false">Όχι (συγκεκριμένο έτος)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {editingHoliday && (
                  <Button type="button" variant="ghost" onClick={() => setEditingHoliday(null)}>
                    <X className="h-4 w-4 mr-2" /> Ακύρωση
                  </Button>
                )}
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> {editingHoliday ? "Ενημέρωση" : "Προσθήκη"}
                </Button>
              </div>
            </form>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-2">
                {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div>
                      <span className="font-bold mr-2">{holiday.date}</span>
                      <span>{holiday.name}</span>
                      {holiday.description && (
                        <p className="text-xs text-muted-foreground">{holiday.description}</p>
                      )}
                      {holiday.isFixed && (
                        <p className="text-xs text-blue-600">Σταθερή</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingHoliday(holiday)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onDeleteHoliday(holiday.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
