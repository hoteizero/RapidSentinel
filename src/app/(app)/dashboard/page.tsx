'use client';
import { useState } from 'react';
import { DisasterMap } from '@/components/dashboard/disaster-map';
import { RecentAlertsCard } from '@/components/dashboard/recent-alerts-card';
import { RiskOverviewCard } from '@/components/dashboard/risk-overview-card';
import { SensorStatusCard } from '@/components/dashboard/sensor-status-card';
import { mockIncidents, mockRiskAssessments, mockSensors } from '@/lib/data';
import type { RiskAssessment, SensorEvent, Incident } from '@/lib/types';
import { AlertDetailsSheet } from '@/components/alerts/alert-details-sheet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';

export default function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState<RiskAssessment | SensorEvent | Incident | null>(null);

  const handleSelectItem = (item: RiskAssessment | SensorEvent | Incident) => {
    setSelectedItem(item);
  };
  
  const highestRisk = mockRiskAssessments.reduce((max, current) => current.riskScore > max.riskScore ? current : max, mockRiskAssessments[0]);

  return (
    <div className="flex h-[calc(100vh-11rem)] gap-6">
      {/* Left Pane */}
      <div className="w-[30%] flex flex-col gap-6">
        <div className="h-[50%] rounded-lg overflow-hidden shadow-md">
           <DisasterMap sensors={mockSensors} incidents={mockIncidents} alerts={mockRiskAssessments} onSelectItem={handleSelectItem} />
        </div>
        <div className='h-[50%]'>
            <RecentAlertsCard alerts={mockRiskAssessments} />
        </div>
      </div>

      {/* Center Pane */}
      <div className="w-[62%] flex flex-col gap-6">
         {selectedItem && 'riskScore' in selectedItem ? (
            <RiskOverviewCard riskAssessment={selectedItem} />
        ) : selectedItem && 'sensorId' in selectedItem ? (
            <SensorStatusCard sensors={[selectedItem]} />
        ) : (
            <Card className='h-full'>
                <CardHeader>
                    <CardTitle>詳細情報</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center justify-center h-full text-muted-foreground'>
                    <Info className='size-12 mb-4'/>
                    <p>マップ上のアイテムを選択して詳細を表示します。</p>
                </CardContent>
            </Card>
        )}
      </div>

       <AlertDetailsSheet 
        alert={selectedItem && 'riskScore' in selectedItem ? selectedItem : null}
        open={!!(selectedItem && 'riskScore' in selectedItem)}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedItem(null);
            }
        }}
      />
    </div>
  );
}
