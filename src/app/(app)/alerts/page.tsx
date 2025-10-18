import { AlertsTable } from "@/components/alerts/alerts-table";
import { mockRiskAssessments } from "@/lib/data";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          View, analyze, and manage all disaster risk alerts.
        </p>
      </div>
      <AlertsTable alerts={mockRiskAssessments} />
    </div>
  );
}
