'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RiskAssessment } from '@/lib/types';
import { getRiskCategoryColor } from '@/lib/data';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type RiskOverviewCardProps = {
  riskAssessment: RiskAssessment;
};

export function RiskOverviewCard({ riskAssessment }: RiskOverviewCardProps) {
  const riskScore = riskAssessment.riskScore;
  const riskCategory = riskAssessment.riskCategory;
  const color = getRiskCategoryColor(riskCategory);

  const data = [
    { name: 'Score', value: riskScore },
    { name: 'Remaining', value: 100 - riskScore },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Risk Overview</CardTitle>
        <CardDescription>Highest active risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="relative h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-headline" style={{ color }}>
              {riskScore}
            </span>
            <span className="text-sm font-semibold" style={{ color }}>
              {riskCategory}
            </span>
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold">{riskAssessment.location}</p>
        <p className="text-sm text-muted-foreground px-4">
          {riskAssessment.explanation}
        </p>
      </CardContent>
    </Card>
  );
}
