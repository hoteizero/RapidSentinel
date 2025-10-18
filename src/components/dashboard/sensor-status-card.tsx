'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorEvent } from '@/lib/types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

type SensorStatusCardProps = {
  sensors: SensorEvent[];
};

const COLORS = {
  online: 'hsl(var(--chart-2))',
  offline: 'hsl(var(--chart-4))',
  error: 'hsl(var(--destructive))',
};

export function SensorStatusCard({ sensors }: SensorStatusCardProps) {
  const statusCounts = sensors.reduce(
    (acc, sensor) => {
      acc[sensor.status]++;
      return acc;
    },
    { online: 0, offline: 0, error: 0 }
  );

  const data = [
    { name: 'Online', value: statusCounts.online, color: COLORS.online },
    { name: 'Offline', value: statusCounts.offline, color: COLORS.offline },
    { name: 'Error', value: statusCounts.error, color: COLORS.error },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Status</CardTitle>
        <CardDescription>Live status of all connected sensors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                 formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
