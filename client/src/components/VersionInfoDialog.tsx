import { useState } from "react";
import { Info, Calendar, CheckCircle2, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  changelog,
  getCurrentVersion,
  getLatestChanges,
  formatDate,
  type ChangelogEntry,
} from "@/lib/changelog";

interface VersionInfoDialogProps {
  currentVersion?: string;
  className?: string;
}

export function VersionInfoDialog({ 
  currentVersion = getCurrentVersion(),
  className = "" 
}: VersionInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const latestChanges = getLatestChanges();

  const appInfo = {
    name: "Αίτηση Άδειας Δικαστικής Αστυνομίας",
    description: "Εφαρμογή για την έκδοση αιτήσεων άδειας Δικαστικής Αστυνομίας με αυτόματο υπολογισμό ημερών και εξαγωγή PDF.",
    developer: "Υπουργείο Δικαιοσύνης",
    year: new Date().getFullYear(),
    features: [
      "Αυτόματος υπολογισμός ημερών άδειας",
      "Διαχείριση αργιών και σαββατοκύριακων",
      "Εξαγωγή επίσημων PDF",
      "Υποστήριξη πολλαπλών υπηρεσιών",
      "Ελληνικό ημερολόγιο και γλώσσα"
    ]
  };

  const renderChangelogEntry = (entry: ChangelogEntry, isLatest: boolean = false) => (
    <div key={entry.version} className={`p-4 border rounded-lg ${isLatest ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Έκδοση {entry.version}</h3>
          {isLatest && (
            <Badge variant="default" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Τελευταία
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(entry.date)}
        </div>
      </div>

      {entry.features.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-2 flex items-center text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Νέες Λειτουργίες
          </h4>
          <ul className="space-y-1">
            {entry.features.map((feature, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.fixes.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-2 flex items-center text-orange-700 dark:text-orange-400">
            <Wrench className="w-4 h-4 mr-1" />
            Διορθώσεις
          </h4>
          <ul className="space-y-1">
            {entry.fixes.map((fix, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.improvements.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center text-blue-700 dark:text-blue-400">
            <Sparkles className="w-4 h-4 mr-1" />
            Βελτιώσεις
          </h4>
          <ul className="space-y-1">
            {entry.improvements.map((improvement, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className={className} title="Πληροφορίες Εφαρμογής">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Πληροφορίες Εφαρμογής</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="about" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">Σχετικά</TabsTrigger>
            <TabsTrigger value="changelog">Ιστορικό Αλλαγών</TabsTrigger>
            <TabsTrigger value="version">Τρέχουσα Έκδοση</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <h2 className="text-xl font-bold mb-2">{appInfo.name}</h2>
                <p className="text-muted-foreground mb-4">{appInfo.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Badge variant="secondary">
                    Έκδοση {currentVersion}
                  </Badge>
                  <Badge variant="outline">
                    {appInfo.developer}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Βασικές Λειτουργίες</h3>
                  <ul className="space-y-2">
                    {appInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Τεχνικές Πληροφορίες</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Έκδοση:</span>
                      <span className="font-mono">{currentVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Τελευταία ενημέρωση:</span>
                      <span>{formatDate(latestChanges.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Έτος:</span>
                      <span>{appInfo.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Κατάσταση:</span>
                      <Badge variant="default" className="text-xs">Ενεργή</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="changelog" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Ιστορικό Αλλαγών</h3>
              <p className="text-sm text-muted-foreground">
                Παρακολουθήστε όλες τις ενημερώσεις και βελτιώσεις της εφαρμογής
              </p>
            </div>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {changelog.map((entry, index) => 
                  renderChangelogEntry(entry, index === 0)
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="version" className="space-y-4">
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">Τρέχουσα Έκδοση</h3>
                  <div className="text-4xl font-mono font-bold text-primary mt-2">
                    {currentVersion}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ημερομηνία κυκλοφορίας</p>
                    <p className="font-semibold">{formatDate(latestChanges.date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Σύνολο αλλαγών</p>
                    <p className="font-semibold">
                      {latestChanges.features.length + latestChanges.fixes.length + latestChanges.improvements.length} 
                      {' '}αλλαγές
                    </p>
                  </div>
                </div>
                {latestChanges.features.length > 0 && (
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground mb-2">Τελευταίες λειτουργίες:</p>
                    <ul className="space-y-1">
                      {latestChanges.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}