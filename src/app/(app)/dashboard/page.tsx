import { DisasterMap } from '@/components/dashboard/disaster-map';
import { RecentAlertsCard } from '@/components/dashboard/recent-alerts-card';
import { RiskOverviewCard } from '@/components/dashboard/risk-overview-card';
import { SensorStatusCard } from '@/components/dashboard/sensor-status-card';
import { mockIncidents, mockRiskAssessments, mockSensors } from '@/lib/data';

export default function DashboardPage() {
  const highestRisk = mockRiskAssessments.reduce((max, current) => current.riskScore > max.riskScore ? current : max, mockRiskAssessments[0]);

  return (
    <div className="flex flex-col gap-6">
       <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[400px] lg:h-[650px] rounded-lg overflow-hidden shadow-md">
           <DisasterMap sensors={mockSensors} incidents={mockIncidents} alerts={mockRiskAssessments} />
        </div>
        <div className="flex flex-col gap-6">
          <RiskOverviewCard riskAssessment={highestRisk} />
          <RecentAlertsCard alerts={mockRiskAssessments} />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SensorStatusCard sensors={mockSensors} />
      </div>
    </div>
  );
}
