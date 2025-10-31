
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as BarChartIconLucide, Clock, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart } from 'recharts';

type Period = 'daily' | 'monthly' | 'yearly';

const dataSets = {
  daily: {
    trend: [
      { time: '0時', alerts: 1 },
      { time: '3時', alerts: 0 },
      { time: '6時', alerts: 2 },
      { time: '9時', alerts: 3 },
      { time: '12時', alerts: 5 },
      { time: '15時', alerts: 4 },
      { time: '18時', alerts: 2 },
      { time: '21時', alerts: 1 },
    ],
    category: [
      { name: 'Low', value: 8, color: 'hsl(var(--chart-2))' },
      { name: 'Moderate', value: 5, color: 'hsl(var(--chart-4))' },
      { name: 'High', value: 3, color: 'hsl(var(--chart-5))' },
      { name: 'Severe', value: 2, color: 'hsl(var(--destructive))' },
    ],
    avgResponse: "8分15秒",
    falsePositive: [
        { name: '正検知', value: 95, color: 'hsl(var(--primary))' },
        { name: '誤検知', value: 5, color: 'hsl(var(--muted))' },
    ],
    trendXKey: 'time',
    avgResponseLabel: '過去24時間の平均',
    trendBarName: '警報数',
  },
  monthly: {
    trend: [
      { time: '1月', alerts: 40 },
      { time: '2月', alerts: 32 },
      { time: '3月', alerts: 55 },
      { time: '4月', alerts: 81 },
      { time: '5月', alerts: 72 },
      { time: '6月', alerts: 123 },
    ],
    category: [
      { name: 'Low', value: 400, color: 'hsl(var(--chart-2))' },
      { name: 'Moderate', value: 300, color: 'hsl(var(--chart-4))' },
      { name: 'High', value: 200, color: 'hsl(var(--chart-5))' },
      { name: 'Severe', value: 100, color: 'hsl(var(--destructive))' },
    ],
    avgResponse: "12分30秒",
    falsePositive: [
        { name: '正検知', value: 92, color: 'hsl(var(--primary))' },
        { name: '誤検知', value: 8, color: 'hsl(var(--muted))' },
    ],
    trendXKey: 'time',
    avgResponseLabel: '過去30日間の平均',
    trendBarName: '警報数',
  },
  yearly: {
    trend: [
      { time: '2022', alerts: 540 },
      { time: '2023', alerts: 680 },
      { time: '2024', alerts: 820 },
      { time: '2025', alerts: 950 },
    ],
    category: [
        { name: 'Low', value: 5000, color: 'hsl(var(--chart-2))' },
        { name: 'Moderate', value: 3500, color: 'hsl(var(--chart-4))' },
        { name: 'High', value: 1500, color: 'hsl(var(--chart-5))' },
        { name: 'Severe', value: 500, color: 'hsl(var(--destructive))' },
    ],
    avgResponse: "15分05秒",
    falsePositive: [
        { name: '正検知', value: 93, color: 'hsl(var(--primary))' },
        { name: '誤検知', value: 7, color: 'hsl(var(--muted))' },
    ],
    trendXKey: 'time',
    avgResponseLabel: '過去1年間の平均',
    trendBarName: '警報数',
  }
};


export default function AnalysisPage() {
  const [period, setPeriod] = useState<Period>('monthly');
  const currentData = dataSets[period];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <BarChartIconLucide />
            分析ダッシュボード
          </h1>
          <p className="text-muted-foreground">
            過去の警報データを分析し、運用改善のためのインサイトを得ます。
          </p>
        </div>
         <Tabs defaultValue="monthly" onValueChange={(value) => setPeriod(value as Period)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="daily">日次</TabsTrigger>
            <TabsTrigger value="monthly">月次</TabsTrigger>
            <TabsTrigger value="yearly">年次</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <PieChartIcon className='size-5 text-muted-foreground' />
                警報カテゴリ内訳
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={currentData.category} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {currentData.category.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <BarChartIconLucide className='size-5 text-muted-foreground' />
                警報トレンド
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={currentData.trendXKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="hsl(var(--primary))" name={currentData.trendBarName} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className='size-5 text-muted-foreground' />
                平均対応時間
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold">{currentData.avgResponse}</p>
            <p className="text-sm text-muted-foreground">{currentData.avgResponseLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className='size-5 text-muted-foreground' />
                誤検知率分析
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={currentData.falsePositive} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {currentData.falsePositive.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
