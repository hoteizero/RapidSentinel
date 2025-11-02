'use client'

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SensorEvent } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { SensorDetailsSheet } from './sensor-details-sheet';

type SensorsTableProps = {
  sensors: SensorEvent[];
};

export function SensorsTable({ sensors }: SensorsTableProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorEvent | null>(null);

  const getStatusColor = (status: SensorEvent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Last Value</TableHead>
                <TableHead>Last Reading</TableHead>
                <TableHead>Location (Lat, Lon)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow 
                  key={sensor.sensorId} 
                  data-testid={`sensor-row-${sensor.sensorId}`}
                  onClick={() => setSelectedSensor(sensor)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className={cn("h-2.5 w-2.5 rounded-full", getStatusColor(sensor.status))}></span>
                       <span className="capitalize">{sensor.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{sensor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sensor.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{sensor.value} {sensor.unit}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(sensor.timestamp), { addSuffix: true })}
                  </TableCell>
                   <TableCell className="font-mono">{sensor.lat.toFixed(4)}, {sensor.lon.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <SensorDetailsSheet
        sensor={selectedSensor}
        open={!!selectedSensor}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedSensor(null);
          }
        }}
      />
    </>
  );
}
