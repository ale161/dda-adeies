import { useState, useEffect } from "react";
import { LeaveType, ProsecutorOffice, LEAVE_TYPES, PROSECUTOR_OFFICES } from "@/lib/data";

const STORAGE_KEY_LEAVE_TYPES = "dda_leave_types";
const STORAGE_KEY_OFFICES = "dda_offices";

export function useSettings() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEAVE_TYPES);
    return saved ? JSON.parse(saved) : LEAVE_TYPES;
  });

  const [offices, setOffices] = useState<ProsecutorOffice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OFFICES);
    return saved ? JSON.parse(saved) : PROSECUTOR_OFFICES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LEAVE_TYPES, JSON.stringify(leaveTypes));
  }, [leaveTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OFFICES, JSON.stringify(offices));
  }, [offices]);

  const addLeaveType = (type: LeaveType) => {
    setLeaveTypes((prev) => [...prev, type]);
  };

  const updateLeaveType = (updated: LeaveType) => {
    setLeaveTypes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteLeaveType = (id: string) => {
    setLeaveTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const addOffice = (office: ProsecutorOffice) => {
    setOffices((prev) => [...prev, office]);
  };

  const updateOffice = (updated: ProsecutorOffice) => {
    setOffices((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const deleteOffice = (id: string) => {
    setOffices((prev) => prev.filter((o) => o.id !== id));
  };

  return {
    leaveTypes,
    offices,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType,
    addOffice,
    updateOffice,
    deleteOffice,
  };
}
