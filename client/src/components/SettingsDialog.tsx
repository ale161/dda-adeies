import { useState } from "react";
import { Settings, Plus, Trash2, Edit2, Save, X } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaveType, ProsecutorOffice } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsDialogProps {
  leaveTypes: LeaveType[];
  offices: ProsecutorOffice[];
  onAddLeaveType: (type: LeaveType) => void;
  onUpdateLeaveType: (type: LeaveType) => void;
  onDeleteLeaveType: (id: string) => void;
  onAddOffice: (office: ProsecutorOffice) => void;
  onUpdateOffice: (office: ProsecutorOffice) => void;
  onDeleteOffice: (id: string) => void;
}

export function SettingsDialog({
  leaveTypes,
  offices,
  onAddLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
  onAddOffice,
  onUpdateOffice,
  onDeleteOffice,
}: SettingsDialogProps) {
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [editingOffice, setEditingOffice] = useState<ProsecutorOffice | null>(null);

  const handleSaveLeaveType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: LeaveType = {
      id: editingLeaveType?.id || Math.random().toString(36).substr(2, 9),
      label: formData.get("label") as string,
      code: formData.get("code") as string,
      group: formData.get("group") as "A" | "B",
      groupIndex: parseInt(formData.get("groupIndex") as string),
    };

    if (editingLeaveType) {
      onUpdateLeaveType(data);
    } else {
      onAddLeaveType(data);
    }
    setEditingLeaveType(null);
    e.currentTarget.reset();
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leave-types">Είδη Αδείας</TabsTrigger>
            <TabsTrigger value="offices">Εισαγγελίες / Υπηρεσίες</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-types" className="space-y-4">
            <form onSubmit={handleSaveLeaveType} className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
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
              <div className="col-span-2 flex justify-end gap-2">
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
