'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorEvent } from '@/lib/types';
import { format } from 'date-fns';
import { BarChart, Clock, Compass, Thermometer, WifiOff, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type SensorDetailsSheetProps = {
  sensor: SensorEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mock historical data for demonstration
const generateHistoricalData = (sensor: SensorEvent) => {
    if (!sensor) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${11 - i}h ago`,
      value: parseFloat((sensor.value + (Math.random() - 0.5) * (sensor.value * 0.2)).toFixed(2)),
    })).reverse();
};

export function SensorDetailsSheet({ sensor, open, onOpenChange }: SensorDetailsSheetProps) {
  if (!sensor) return null;

  const historicalData = generateHistoricalData(sensor);
  
  const getStatusInfo = (status: SensorEvent['status']) => {
    switch (status) {
      case 'online': return { color: 'text-green-500', icon: <div className="h-3 w-3 rounded-full bg-green-500" />, label: 'Online' };
      case 'offline': return { color: 'text-gray-500', icon: <WifiOff className="size-5" />, label: 'Offline' };
      case 'error': return { color: 'text-red-500', icon: <XCircle className="size-5" />, label: 'Error' };
    }
  }

  const statusInfo = getStatusInfo(sensor.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0" data-testid={`sensor-details-sheet-${sensor.sensorId}`}>
        <div className='flex flex-col h-full'>
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline text-2xl flex items-center gap-3">
             <Badge variant="outline">{sensor.type}</Badge>
            {sensor.name}
          </SheetTitle>
          <SheetDescription>
            Sensor ID: {sensor.sensorId}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6">
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className={cn('text-lg flex items-center gap-2', statusInfo.color)}>{statusInfo.icon} {statusInfo.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>No issues reported.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-lg flex items-center gap-2'><Thermometer className='size-5 text-muted-foreground'/> Last Reading</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-3xl font-mono'>{sensor.value} <span className='text-lg'>{sensor.unit}</span></p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-lg flex items-center gap-2'><Clock className='size-5 text-muted-foreground'/> Last Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-semibold'>{formatDistanceToNow(new Date(sensor.timestamp), { addSuffix: true })}</p>
                        <p className='text-xs text-muted-foreground'>{format(new Date(sensor.timestamp), "yyyy-MM-dd HH:mm:ss")}</p>
                    </CardContent>
                </Card>
                 <Card className='col-span-2 md:col-span-3'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-lg flex items-center gap-2'><Compass className='size-5 text-muted-foreground'/> Location & Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-mono'>Lat: {sensor.lat.toFixed(6)}, Lon: {sensor.lon.toFixed(6)}</p>
                        <p className='text-muted-foreground'>Accuracy: within {sensor.accuracy} meters</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><BarChart/> Historical Data (Last 12 Hours)</CardTitle>
                </CardHeader>
                <CardContent className='h-64'>
                   <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis label={{ value: sensor.unit, angle: -90, position: 'insideLeft' }}/>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} name={sensor.name} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
        <SheetFooter className="p-6 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
