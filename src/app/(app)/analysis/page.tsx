
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Clock, PieChart as PieChartIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const monthlyTrendData = [
  { month: '1月', alerts: 4 },
  { month: '2月', alerts: 3 },
  { month: '3月', alerts: 5 },
  { month: '4月', alerts: 8 },
  { month: '5月', alerts: 7 },
  { month: '6月', alerts: 12 },
];

const categoryData = [
  { name: 'Low', value: 40, color: 'hsl(var(--chart-2))' },
  { name: 'Moderate', value: 30, color: 'hsl(var(--chart-4))' },
  { name: 'High', value: 20, color: 'hsl(var(--chart-5))' },
  { name: 'Severe', value: 10, color: 'hsl(var(--destructive))' },
];

const falsePositiveData = [
    { name: '正検知', value: 92, color: 'hsl(var(--primary))' },
    { name: '誤検知', value: 8, color: 'hsl(var(--muted))' },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
          <BarChart />
          分析ダッシュボード
        </h1>
        <p className="text-muted-foreground">
          過去の警報データを分析し、運用改善のためのインサイトを得ます。
        </p>
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
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {categoryData.map((entry) => (
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
                <BarChart className='size-5 text-muted-foreground' />
                月別警報トレンド
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="hsl(var(--primary))" name="警報数" />
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
            <p className="text-4xl font-bold">12分30秒</p>
            <p className="text-sm text-muted-foreground">過去30日間の平均</p>
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
                <Pie data={falsePositiveData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={(props) => `${props.name} ${props.value}%`}>
                    {falsePositiveData.map((entry) => (
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
