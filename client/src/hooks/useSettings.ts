import { useState, useEffect } from "react";
import { LeaveType, ProsecutorOffice, Holiday, LEAVE_TYPES, PROSECUTOR_OFFICES, HOLIDAYS } from "@/lib/data";

const STORAGE_KEY_LEAVE_TYPES = "dda_leave_types";
const STORAGE_KEY_OFFICES = "dda_offices";
const STORAGE_KEY_HOLIDAYS = "dda_holidays";
const STORAGE_KEY_EXCLUDE_HOLIDAYS_AND_WEEKENDS = "dda_exclude_holidays_and_weekends";

export function useSettings() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEAVE_TYPES);
    return saved ? JSON.parse(saved) : LEAVE_TYPES;
  });

  const [offices, setOffices] = useState<ProsecutorOffice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OFFICES);
    return saved ? JSON.parse(saved) : PROSECUTOR_OFFICES;
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HOLIDAYS);
    return saved ? JSON.parse(saved) : HOLIDAYS;
  });

  const [excludeHolidaysAndWeekends, setExcludeHolidaysAndWeekends] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXCLUDE_HOLIDAYS_AND_WEEKENDS);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LEAVE_TYPES, JSON.stringify(leaveTypes));
  }, [leaveTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OFFICES, JSON.stringify(offices));
  }, [offices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HOLIDAYS, JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXCLUDE_HOLIDAYS_AND_WEEKENDS, JSON.stringify(excludeHolidaysAndWeekends));
  }, [excludeHolidaysAndWeekends]);

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

  const addHoliday = (holiday: Holiday) => {
    setHolidays((prev) => [...prev, holiday]);
  };

  const updateHoliday = (updated: Holiday) => {
    setHolidays((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const deleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const fetchHolidaysFromAPI = async (year: number): Promise<Holiday[]> => {
    try {
      const response = await fetch(`https://www.argies.gr/${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      
      // Parse the HTML to extract holiday information
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // This is a simplified parser - you may need to adjust based on the actual website structure
      const holidays: Holiday[] = [];
      
      // Try to find holiday tables or lists in the HTML
      // Common patterns for holiday websites
      const holidayElements = doc.querySelectorAll('table tr, .holiday, [class*="holiday"], [class*="argia"]');
      
      holidayElements.forEach((element, index) => {
        try {
          // Extract date and name from the element
          const text = element.textContent?.trim() || '';
          if (text) {
            // This is a placeholder implementation
            // In a real scenario, you would parse the specific HTML structure
            // For now, we'll try to extract common Greek holiday patterns
            const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})/);
            const nameMatch = text.match(/[Α-Ωα-ω\s]+/);
            
            if (dateMatch && nameMatch) {
              const day = dateMatch[1].padStart(2, '0');
              const month = dateMatch[2].padStart(2, '0');
              const holidayName = nameMatch[0].trim();
              
              if (holidayName.length > 2) {
                holidays.push({
                  id: `api_${year}_${index}`,
                  date: `${year}-${month}-${day}`,
                  name: holidayName,
                  description: `Imported from argies.gr ${year}`,
                  isFixed: false,
                });
              }
            }
          }
        } catch (parseError) {
          console.warn(`Failed to parse holiday element ${index}:`, parseError);
        }
      });
      
      // If no holidays were found, provide some common Greek holidays for the year
      if (holidays.length === 0) {
        console.warn('No holidays found in API response, using fallback data');
        // Add some common Greek holidays as fallback
        const fallbackHolidays = [
          { month: '01', day: '01', name: 'Πρωτοχρονιά' },
          { month: '01', day: '06', name: 'Θεοφάνεια' },
          { month: '03', day: '25', name: 'Εθνική Εορτή' },
          { month: '05', day: '01', name: 'Εργατική Πρωτομαγιά' },
          { month: '08', day: '15', name: 'Κοίμηση Θεοτόκου' },
          { month: '10', day: '28', name: 'Εθνική Εορτή' },
          { month: '12', day: '25', name: 'Χριστούγεννα' },
          { month: '12', day: '26', name: 'Σύναξη Θεοτόκου' },
        ];
        
        fallbackHolidays.forEach((holiday, index) => {
          holidays.push({
            id: `fallback_${year}_${index}`,
            date: `${year}-${holiday.month}-${holiday.day}`,
            name: holiday.name,
            description: `Fallback data for ${year}`,
            isFixed: true,
          });
        });
      }
      
      return holidays;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  };

  const importHolidaysFromAPI = async (year: number) => {
    try {
      const fetchedHolidays = await fetchHolidaysFromAPI(year);
      if (fetchedHolidays.length > 0) {
        // Add new holidays, avoiding duplicates
        setHolidays((prev) => {
          const existingDates = new Set(prev.map(h => h.date));
          const newHolidays = fetchedHolidays.filter(h => !existingDates.has(h.date));
          return [...prev, ...newHolidays];
        });
      }
    } catch (error) {
      console.error('Failed to import holidays:', error);
      throw error;
    }
  };

  return {
    leaveTypes,
    offices,
    holidays,
    excludeHolidaysAndWeekends,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType,
    addOffice,
    updateOffice,
    deleteOffice,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    importHolidaysFromAPI,
    setExcludeHolidaysAndWeekends,
  };
}
