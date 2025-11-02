import { AlertsTable } from "@/components/alerts/alerts-table";
import { mockRiskAssessments } from "@/lib/data";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">警報</h1>
        <p className="text-muted-foreground">
          すべての災害リスク警報を表示、分析、管理します。
        </p>
      </div>
      <AlertsTable alerts={mockRiskAssessments} />
    </div>
  );
}
