
'use client';
import { useState } from 'react';
import { RecentAlertsCard } from '@/components/dashboard/recent-alerts-card';
import { mockIncidents, mockRiskAssessments, mockSensors } from '@/lib/data';
import type { RiskAssessment, SensorEvent, Incident } from '@/lib/types';
import { AlertDetailsSheet } from '@/components/alerts/alert-details-sheet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, BarChart, Bot, Waypoints } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, ComposedChart } from 'recharts';
import { ActionFooter } from '@/components/layout/action-footer';
import dynamic from 'next/dynamic';

const CesiumMap = dynamic(() => import('@/components/dashboard/cesium-map'), { ssr: false });


const timeSeriesData = [
  { time: '6h ago', 水位: 4.2, 雨量: 5, ICOT状態: 0 },
  { time: '5h ago', 水位: 4.3, 雨量: 8, ICOT状態: 0 },
  { time: '4h ago', 水位: 4.5, 雨量: 12, ICOT状態: 0 },
  { time: '3h ago', 水位: 4.6, 雨量: 20, ICOT状態: 1 },
  { time: '2h ago', 水位: 4.7, 雨量: 15, ICOT状態: 1 },
  { time: '1h ago', 水位: 4.75, 雨量: 10, ICOT状態: 1 },
  { time: 'Now', 水位: 4.8, 雨量: 8, ICOT状態: 1 },
];

export default function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState<RiskAssessment | SensorEvent | Incident | null>(mockRiskAssessments[0]);

  const handleSelectItem = (item: RiskAssessment | SensorEvent | Incident) => {
    setSelectedItem(item);
  };
  
  const highestRisk = mockRiskAssessments.reduce((max, current) => current.riskScore > max.riskScore ? current : max, mockRiskAssessments[0]);
  const selectedRiskAssessment = selectedItem && 'riskScore' in selectedItem ? selectedItem : null;

  return (
    <div className="flex flex-col h-full -m-4 md:-m-6 lg:-m-8">
        <div className='flex flex-1 overflow-hidden'>
            {/* Left Pane */}
            <aside className="w-[30%] flex flex-col gap-4 p-4 border-r bg-muted/20">
                <div className="h-[55%] rounded-lg overflow-hidden shadow-md">
                <CesiumMap />
                </div>
                <div className='h-[45%]'>
                    <RecentAlertsCard alerts={mockRiskAssessments} onSelectAlert={handleSelectItem} />
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
                                    <p><span className='font-semibold'>ID:</span> {selectedRiskAssessment.id.replace('alert', 'ICOT')}</p>
                                    <p><span className='font-semibold'>名称:</span> マンホール（海岸通3丁目）</p>
                                    <p><span className='font-semibold'>設備情報:</span> 下水道幹線・口径1200mm・設置年：2018</p>
                                    <p className='text-xs text-muted-foreground pt-2'>{selectedRiskAssessment.location}</p>
                                </CardContent>
                            </Card>
                             <Card className='col-span-2'>
                                <CardHeader>
                                    <CardTitle className='text-lg flex items-center gap-2'><Bot className='size-5'/> 総合評価</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <p className='font-bold text-xl mb-3'>浸水リスク: <span className='text-red-500'>{selectedRiskAssessment.riskScore}%</span> (信頼度: <span className='text-blue-400'>{selectedRiskAssessment.trustScore ? `${(selectedRiskAssessment.trustScore * 100).toFixed(0)}%` : 'N/A'})</span></p>
                                     <p className='text-muted-foreground text-sm'>
                                        AIの多層的な分析により、リスクが「{selectedRiskAssessment.riskCategory}」と判断されました。詳細は「AI判断根拠」ページで確認してください。
                                     </p>
                                </CardContent>
                            </Card>
                        </div>
                         <Card className='h-[60%] flex flex-col'>
                            <CardHeader>
                                <CardTitle className='text-lg flex items-center gap-2'><BarChart className='size-5'/> 時系列グラフ（過去6時間）</CardTitle>
                            </CardHeader>
                             <CardContent className='flex-grow'>
                                 <ResponsiveContainer width="100%" height="100%">
                                     <ComposedChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                         <CartesianGrid strokeDasharray="3 3" />
                                         <XAxis dataKey="time" />
                                         <YAxis yAxisId="left" label={{ value: '水位 (m)', angle: -90, position: 'insideLeft' }} />
                                         <YAxis yAxisId="right" orientation="right" label={{ value: '雨量 (mm/h)', angle: -90, position: 'insideRight' }} />
                                         <YAxis yAxisId="step" orientation="right" domain={[0,1]} ticks={[0,1]} tickFormatter={(val) => val === 1 ? '異常': '正常'}/>
                                         <Tooltip />
                                         <Legend />
                                         <Line yAxisId="left" type="monotone" dataKey="水位" stroke="hsl(var(--chart-1))" strokeWidth={2} name="水位 (m)" />
                                         <Bar yAxisId="right" dataKey="雨量" fill="hsl(var(--chart-2))" name="雨量 (mm/h)" barSize={20} />
                                         <Line yAxisId="step" dataKey="ICOT状態" stroke="hsl(var(--chart-5))" strokeWidth={2} name="ICOT状態" step="center" />
                                     </ComposedChart>
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
        alert={selectedItem && 'riskScore' in selectedItem && !selectedRiskAssessment ? selectedItem as RiskAssessment : null}
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
