// Changelog system for the Greek Leave Application
// Uses semantic versioning and organized by change types

export interface ChangelogEntry {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  improvements: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2025-12-23",
    features: [
      "Δημιουργία συστήματος διαχείρισης αιτήσεων άδειας Δικαστικής Αστυνομίας",
      "Εφαρμογή αυτόματου υπολογισμού ημερών άδειας",
      "Σύστημα ρυθμίσεων για εξαίρεση αργιών και σαββατοκύριακων",
      "Δυνατότητα προσθήκης συνημμένων εγγράφων",
      "Ζωντανή προεπισκόπηση της αίτησης",
      "Υποστήριξη πολλαπλών εισαγγελιών και υπηρεσιών",
      "Σύστημα εισαγωγής και διαχείρισης αργιών",
      "Εξαγωγή PDF με επίσημη μορφοποίηση",
      "Υποστήριξη ελληνικής γλώσσας και ελληνικού ημερολογίου"
    ],
    fixes: [
      "Διόρθωση λειτουργίας checkbox για καθολική ρύθμιση εξαίρεσης",
      "Βελτίωση απόκρισης UI σε κινητές συσκευές",
      "Διόρθωση σφαλμάτων εμφάνισης σε παλιότερους browsers"
    ],
    improvements: [
      "Βελτιωμένη εμπειρία χρήστη με καλύτερη οπτική ανάδραση",
      "Ενίσχυση προσβασιμότητας",
      "Βελτιστοποίηση απόδοσης φόρτωσης",
      "Καλύτερη οργάνωση κώδικα και δομής"
    ]
  },
  {
    version: "1.1.0",
    date: "2025-12-23",
    features: [
      "Σύστημα εμφάνισης πληροφοριών έκδοσης",
      "Δυναμική φόρτωση έκδοσης από package.json",
      "Πλήρες changelog σύστημα με ιστορικό αλλαγών",
      "Διάλογος πληροφοριών εφαρμογής με κατηγορίες αλλαγών"
    ],
    fixes: [],
    improvements: [
      "Βελτιωμένη οργάνωση κώδικα με ξεχωριστά components",
      "Καλύτερη διαχείριση state και props",
      "Ενισχυμένη τυποποίηση κώδικα"
    ]
  }
];

// Helper functions
export const getCurrentVersion = (): string => {
  return changelog[0]?.version || "1.0.0";
};

export const getLatestChanges = (): ChangelogEntry => {
  return changelog[0];
};

export const getChangelogByVersion = (version: string): ChangelogEntry | undefined => {
  return changelog.find(entry => entry.version === version);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};