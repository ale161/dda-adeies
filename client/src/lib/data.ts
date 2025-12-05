export type LeaveGroup = "A" | "B";

export type LeaveType = {
  id: string;
  label: string;
  code: string; // e.g., "αρ. 50 παρ. 9 του ν. 3528/2007"
  group: LeaveGroup;
  groupIndex: number; // e.g., 1 for A.1
};

export type ProsecutorOffice = {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  city: string;
  hasProsecutor: boolean; // true = ΕΙΣΑΓΓΕΛΕΑΣ, false = ΠΡΟΕΔΡΟΣ
  headGender: "M" | "F"; // M = Κ. ΕΙΣΑΓΓΕΛΕΑΣ/ΠΡΟΕΔΡΟΣ, F = Κ. ΕΙΣΑΓΓΕΛΕΑΣ/ΠΡΟΕΔΡΟΣ (generic title usually, but allows customization if needed)
};

export type LeaveApplicationData = {
  officeId: string;
  leaveTypeId: string;
  applicantName: string;
  applicantService: string;
  applicantGender: "M" | "F";
  reason: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  daysCount: number;
  contactAddress: string;
  contactPostalCode: string;
  contactPhone: string;
  contactEmail: string;
  attachments: string[];
  location: string;
  dateRequest: Date;
};

export const PROSECUTOR_OFFICES: ProsecutorOffice[] = [
  { 
    id: "1", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΘΕΣΣΑΛΟΝΙΚΗΣ", 
    address: "26ης Οκτωβρίου 5", 
    postalCode: "54627", 
    phone: "2310507000", 
    email: "eisaggeleas@thess.gr", 
    city: "ΘΕΣΣΑΛΟΝΙΚΗ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "2", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΠΑΤΡΩΝ", 
    address: "Γούναρη 30", 
    postalCode: "26221", 
    phone: "2610329000", 
    email: "eisaggeleas@patras.gr", 
    city: "ΠΑΤΡΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "3", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΚΡΗΤΗΣ", 
    address: "Πλατεία Ελευθερίας", 
    postalCode: "73134", 
    phone: "2821045000", 
    email: "eisaggeleas@crete.gr", 
    city: "ΧΑΝΙΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "4", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΑΘΗΝΩΝ", 
    address: "Λ. Αλεξάνδρας 132", 
    postalCode: "11521", 
    phone: "2106404000", 
    email: "eisaggeleas@athens.gr", 
    city: "ΑΘΗΝΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "5", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΙΩΑΝΝΙΝΩΝ", 
    address: "Δικαστικό Μέγαρο", 
    postalCode: "45110", 
    phone: "2651020000", 
    email: "eisaggeleas@ioannina.gr", 
    city: "ΙΩΑΝΝΙΝΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "6", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΑΝΑΤΟΛΙΚΗΣ ΚΡΗΤΗΣ", 
    address: "Λεωφ. Δικαιοσύνης", 
    postalCode: "71202", 
    phone: "2810300000", 
    email: "eisaggeleas@heraklion.gr", 
    city: "ΗΡΑΚΛΕΙΟ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "7", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΛΑΡΙΣΑΣ", 
    address: "Κεντρική Πλατεία", 
    postalCode: "41222", 
    phone: "2410500000", 
    email: "eisaggeleas@larissa.gr", 
    city: "ΛΑΡΙΣΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "8", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΠΕΙΡΑΙΩΣ", 
    address: "Σκουζέ 3-5", 
    postalCode: "18535", 
    phone: "2104500000", 
    email: "eisaggeleas@piraeus.gr", 
    city: "ΠΕΙΡΑΙΑΣ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "9", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΔΩΔΕΚΑΝΗΣΟΥ", 
    address: "Πλατεία Ελευθερίας", 
    postalCode: "85100", 
    phone: "2241020000", 
    email: "eisaggeleas@rhodes.gr", 
    city: "ΡΟΔΟΣ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "10", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΔΥΤΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ", 
    address: "Δημοκρατίας 1", 
    postalCode: "50100", 
    phone: "2461020000", 
    email: "eisaggeleas@kozani.gr", 
    city: "ΚΟΖΑΝΗ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "11", 
    name: "ΔΙΕΥΘΥΝΣΗ ΔΙΚΑΣΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ", 
    address: "Μεσογείων 96", 
    postalCode: "11527", 
    phone: "2131307633", 
    email: "dda@justice.gov.gr", 
    city: "ΑΘΗΝΑ",
    hasProsecutor: false, // Διευθυντής
    headGender: "M"
  },
  { 
    id: "12", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΝΑΥΠΛΙΟΥ", 
    address: "Πλατεία Συντάγματος", 
    postalCode: "21100", 
    phone: "2752020000", 
    email: "eisaggeleas@nafplio.gr", 
    city: "ΝΑΥΠΛΙΟ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "13", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΑΙΓΑΙΟΥ", 
    address: "Πλατεία Μιαούλη", 
    postalCode: "84100", 
    phone: "2281080000", 
    email: "eisaggeleas@syros.gr", 
    city: "ΕΡΜΟΥΠΟΛΗ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "14", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΘΡΑΚΗΣ", 
    address: "Χαριλάου Τρικούπη 1", 
    postalCode: "69100", 
    phone: "2531020000", 
    email: "eisaggeleas@komotini.gr", 
    city: "ΚΟΜΟΤΗΝΗ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "15", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΕΥΒΟΙΑΣ", 
    address: "Ελ. Βενιζέλου 1", 
    postalCode: "34100", 
    phone: "2221020000", 
    email: "eisaggeleas@chalkida.gr", 
    city: "ΧΑΛΚΙΔΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "16", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΚΕΡΚΥΡΑΣ", 
    address: "Κολοκοτρώνη 1", 
    postalCode: "49100", 
    phone: "2661030000", 
    email: "eisaggeleas@corfu.gr", 
    city: "ΚΕΡΚΥΡΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "17", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΔΥΤΙΚΗΣ ΣΤΕΡΕΑΣ ΕΛΛΑΔΑΣ", 
    address: "Πολυτεχνείου 1", 
    postalCode: "30100", 
    phone: "2641020000", 
    email: "eisaggeleas@agrinio.gr", 
    city: "ΑΓΡΙΝΙΟ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "18", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΚΑΛΑΜΑΤΑΣ", 
    address: "Ψαρών 1", 
    postalCode: "24100", 
    phone: "2721020000", 
    email: "eisaggeleas@kalamata.gr", 
    city: "ΚΑΛΑΜΑΤΑ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "19", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΒΟΡΕΙΟΥ ΑΙΓΑΙΟΥ", 
    address: "Κουντουριώτη 1", 
    postalCode: "81100", 
    phone: "2251020000", 
    email: "eisaggeleas@mytilene.gr", 
    city: "ΜΥΤΙΛΗΝΗ",
    hasProsecutor: true,
    headGender: "M"
  },
  { 
    id: "20", 
    name: "ΕΙΣΑΓΓΕΛΙΑ ΕΦΕΤΩΝ ΛΑΜΙΑΣ", 
    address: "Υψηλάντου 1", 
    postalCode: "35100", 
    phone: "2231020000", 
    email: "eisaggeleas@lamia.gr", 
    city: "ΛΑΜΙΑ",
    hasProsecutor: true,
    headGender: "M"
  },
];

export const LEAVE_TYPES: LeaveType[] = [
  // GROUP A
  { id: "A1", label: "Κανονική άδεια", code: "αρ. 49 του ν. 3528/2007", group: "A", groupIndex: 1 },
  { id: "A2", label: "Ειδική άδεια αιμοληψίας", code: "αρ. 50 παρ. 5 του ν. 3528/2007", group: "A", groupIndex: 2 },
  { id: "A3", label: "Προσαύξηση κανονικής άδειας (παραμεθόριος)", code: "αρ. 48 παρ. 3 του ν. 3528/2007", group: "A", groupIndex: 3 },
  { id: "A4", label: "Αδυναμία προσέλευσης (δυσμενείς καιρικές συνθήκες)", code: "αρ. 50 παρ. 11 του ν. 3528/2007", group: "A", groupIndex: 4 },
  { id: "A5", label: "Παρακολούθηση σχολικής επίδοσης τέκνων", code: "αρ. 53 παρ. 6 του ν. 3528/2007", group: "A", groupIndex: 5 },
  { id: "A6", label: "Ασθένεια τέκνων", code: "αρ. 53 παρ. 8 του ν. 3528/2007", group: "A", groupIndex: 6 },
  { id: "A7", label: "Βραχυχρόνια αναρρωτική (έως 8 ημέρες)", code: "αρ. 55 παρ. 2 του ν. 3528/2007", group: "A", groupIndex: 7 },
  { id: "A8", label: "Επιμορφωτική/Επιστημονική άδεια", code: "αρ. 59 του ν. 3528/2007", group: "A", groupIndex: 8 },
  { id: "A9", label: "Φοιτητική άδεια (εξετάσεις)", code: "αρ. 60 του ν. 3528/2007", group: "A", groupIndex: 9 },
  { id: "A10", label: "Παρουσία σε δίκη", code: "αρ. 50 παρ. 1 του ν. 3528/2007", group: "A", groupIndex: 10 },

  // GROUP B
  { id: "B1", label: "Γάμος / Θάνατος / Εκλογές / Πατρότητα", code: "αρ. 50 παρ. 1 του ν. 3528/2007", group: "B", groupIndex: 1 },
  { id: "B2", label: "Νοσήματα / Αναπηρία (μεταγγίσεις, κλπ)", code: "αρ. 50 παρ. 2 του ν.3528/2007", group: "B", groupIndex: 2 },
  { id: "B3", label: "Αναπηρία υπαλλήλου/τέκνου", code: "αρ. 50 παρ. 3 ν. 3528/2007", group: "B", groupIndex: 3 },
  { id: "B4", label: "Δικαστικός συμπαραστάτης", code: "αρ. 50 παρ. 4 του ν. 3528/2007", group: "B", groupIndex: 4 },
  { id: "B5", label: "Κακοήθεις νεοπλασίες", code: "αρ. 50 παρ. 10 του ν. 3528/2007", group: "B", groupIndex: 5 },
  { id: "B6", label: "Άδεια άνευ αποδοχών", code: "αρ. 51 του ν. 3528/2007", group: "B", groupIndex: 6 },
  { id: "B7", label: "Μητρότητα / Προγεννητικός έλεγχος", code: "αρ. 52 ν. 3528/2007", group: "B", groupIndex: 7 },
  { id: "B8", label: "Διευκολύνσεις οικογενειακών υποχρεώσεων", code: "αρ. 53 του ν. 3528/2007", group: "B", groupIndex: 8 },
  { id: "B9", label: "Αναρρωτική πέραν των 8 ημερών", code: "αρ. 56 παρ. 3 του ν. 3528/2007", group: "B", groupIndex: 9 },
  { id: "B10", label: "Υπηρεσιακή εκπαίδευση", code: "αρ. 58 του ν. 3528/2007", group: "B", groupIndex: 10 },
];
