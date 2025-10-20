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
import { Info, BarChart, Bot, Droplet, Waves } from 'lucide-react';
import { SystemStatusCard } from '@/components/dashboard/system-status-card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar } from 'recharts';
import { ActionFooter } from '@/components/layout/action-footer';

const timeSeriesData = [
  { time: '6h ago', 水位: 4.2, 雨量: 5 },
  { time: '5h ago', 水位: 4.3, 雨量: 8 },
  { time: '4h ago', 水位: 4.5, 雨量: 12 },
  { time: '3h ago', 水位: 4.6, 雨量: 20 },
  { time: '2h ago', 水位: 4.7, 雨量: 15 },
  { time: '1h ago', 水位: 4.75, 雨量: 10 },
  { time: 'Now', 水位: 4.8, 雨量: 8 },
];

export default function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState<RiskAssessment | SensorEvent | Incident | null>(mockRiskAssessments[0]);

  const handleSelectItem = (item: RiskAssessment | SensorEvent | Incident) => {
    setSelectedItem(item);
  };
  
  const highestRisk = mockRiskAssessments.reduce((max, current) => current.riskScore > max.riskScore ? current : max, mockRiskAssessments[0]);
  const selectedRiskAssessment = selectedItem && 'riskScore' in selectedItem ? selectedItem : null;

  return (
    <div className="flex flex-col h-full -m-8">
        <div className='flex flex-1 overflow-hidden'>
            {/* Left Pane */}
            <aside className="w-[30%] flex flex-col gap-4 p-4 border-r bg-muted/20">
                <div className="h-[45%] rounded-lg overflow-hidden shadow-md">
                <DisasterMap sensors={mockSensors} incidents={mockIncidents} alerts={mockRiskAssessments} onSelectItem={handleSelectItem} />
                </div>
                <div className='h-[35%]'>
                    <RecentAlertsCard alerts={mockRiskAssessments} onSelectAlert={handleSelectItem} />
                </div>
                <div className='h-[20%]'>
                    <SystemStatusCard />
                </div>
            </aside>

            {/* Center Pane */}
            <main className="w-[70%] p-4 flex flex-col gap-4">
                {selectedRiskAssessment ? (
                    <>
                        <div className="grid grid-cols-3 gap-4 h-[40%]">
                            <Card className='col-span-1'>
                                <CardHeader>
                                    <CardTitle className='text-lg'>地点情報</CardTitle>
                                </CardHeader>
                                <CardContent className='text-sm space-y-2'>
                                    <p><span className='font-semibold'>ID:</span> {selectedRiskAssessment.id}</p>
                                    <p><span className='font-semibold'>名称:</span> マンホール（海岸通3丁目）</p>
                                    <p><span className='font-semibold'>設備情報:</span> 下水道幹線・口径1200mm・設置年：2018</p>
                                    <p className='text-xs text-muted-foreground pt-2'>{selectedRiskAssessment.location}</p>
                                </CardContent>
                            </Card>
                             <Card className='col-span-2'>
                                <CardHeader>
                                    <CardTitle className='text-lg flex items-center gap-2'><Bot className='size-5'/> AI判断根拠 (XAI)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <p className='font-bold text-lg mb-2'>土砂災害リスク: <span className='text-red-500'>{selectedRiskAssessment.riskScore}%</span></p>
                                    <ul className='text-sm space-y-1 list-disc pl-5'>
                                        <li>過去3時間累積雨量：120mm（基準80mm超過）</li>
                                        <li>地盤水分：92%（飽和）</li>
                                        <li>ICOT-2045：水没検出（信頼度92%）</li>
                                        <li>周辺3地点も同傾向</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                         <Card className='h-[60%] flex flex-col'>
                            <CardHeader>
                                <CardTitle className='text-lg flex items-center gap-2'><BarChart className='size-5'/> 時系列グラフ（過去6時間）</CardTitle>
                            </CardHeader>
                             <CardContent className='flex-grow'>
                                 <ResponsiveContainer width="100%" height="100%">
                                     <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                         <CartesianGrid strokeDasharray="3 3" />
                                         <XAxis dataKey="time" />
                                         <YAxis yAxisId="left" label={{ value: '水位 (m)', angle: -90, position: 'insideLeft' }} />
                                         <YAxis yAxisId="right" orientation="right" label={{ value: '雨量 (mm/h)', angle: -90, position: 'insideRight' }} />
                                         <Tooltip />
                                         <Legend />
                                         <Line yAxisId="left" type="monotone" dataKey="水位" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={<Waves className='size-3'/>} name="水位 (m)" />
                                         <Bar yAxisId="right" dataKey="雨量" fill="hsl(var(--chart-2))" name="雨量 (mm/h)" barSize={20} />
                                     </LineChart>
                                 </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </>
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
            </main>
        </div>

        <ActionFooter latestAlert={highestRisk} />

       <AlertDetailsSheet 
        alert={selectedItem && 'riskScore' in selectedItem ? selectedItem : null}
        open={!!(selectedItem && 'riskScore' in selectedItem && !selectedRiskAssessment)}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedItem(null);
            }
        }}
      />
    </div>
  );
}
