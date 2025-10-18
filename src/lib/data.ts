import type { SensorEvent, RiskAssessment, Incident, RiskCategory } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';

const now = new Date();

export const mockSensors: SensorEvent[] = [
  { sensorId: 'sensor_001', name: 'RiverCam-A1', type: 'Camera', timestamp: subMinutes(now, 2).toISOString(), value: 1, unit: 'state', lat: 35.6895, lon: 139.6917, accuracy: 5, status: 'online' },
  { sensorId: 'sensor_002', name: 'Wind-A1', type: 'Wind', timestamp: subMinutes(now, 5).toISOString(), value: 15.2, unit: 'm/s', lat: 35.6898, lon: 139.6920, accuracy: 2, status: 'online' },
  { sensorId: 'sensor_003', name: 'Rain-A1', type: 'Rain', timestamp: subMinutes(now, 1).toISOString(), value: 25, unit: 'mm/h', lat: 35.6890, lon: 139.6911, accuracy: 10, status: 'online' },
  { sensorId: 'sensor_004', name: 'River-B1', type: 'River Level', timestamp: subMinutes(now, 10).toISOString(), value: 4.8, unit: 'm', lat: 35.6905, lon: 139.6930, accuracy: 1, status: 'online' },
  { sensorId: 'sensor_005', name: 'Seismic-C1', type: 'Seismic', timestamp: subHours(now, 1).toISOString(), value: 0.02, unit: 'g', lat: 35.6880, lon: 139.6900, accuracy: 50, status: 'online' },
  { sensorId: 'sensor_006', name: 'Rain-B2', type: 'Rain', timestamp: subMinutes(now, 30).toISOString(), value: 5, unit: 'mm/h', lat: 35.6921, lon: 139.6945, accuracy: 10, status: 'error' },
  { sensorId: 'sensor_007', name: 'Wind-C3', type: 'Wind', timestamp: subHours(now, 2).toISOString(), value: 8.1, unit: 'm/s', lat: 35.6850, lon: 139.6950, accuracy: 2, status: 'offline' },
  { sensorId: 'sensor_008', name: 'River-D1', type: 'River Level', timestamp: subMinutes(now, 15).toISOString(), value: 5.9, unit: 'm', lat: 35.6940, lon: 139.6890, accuracy: 1, status: 'online' },
];

export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'alert_001',
    location: 'Shibuya River Area',
    time: subMinutes(now, 5).toISOString(),
    riskScore: 85,
    riskCategory: 'High',
    contributingSensors: ['sensor_003', 'sensor_004', 'sensor_008'],
    explanation: 'Heavy rainfall (25mm/h) combined with high river levels (4.8m and 5.9m) indicate a high probability of localized flooding near Shibuya River. The rate of rise in river level is critical.',
  },
  {
    id: 'alert_002',
    location: 'Coastal Area C',
    time: subHours(now, 1).toISOString(),
    riskScore: 62,
    riskCategory: 'Moderate',
    contributingSensors: ['sensor_002'],
    explanation: 'Sustained high wind speeds (15.2 m/s) pose a moderate risk to temporary structures and may cause power outages. No other significant sensor readings.',
  },
  {
    id: 'alert_003',
    location: 'Downtown District',
    time: subDays(now, 1).toISOString(),
    riskScore: 30,
    riskCategory: 'Low',
    contributingSensors: ['sensor_005'],
    explanation: 'Minor seismic activity detected, but well below thresholds for structural damage. All other sensors report normal conditions.',
  },
    {
    id: 'alert_004',
    location: 'Area D',
    time: subDays(now, 2).toISOString(),
    riskScore: 95,
    riskCategory: 'Severe',
    contributingSensors: ['sensor_003', 'sensor_004', 'sensor_008'],
    explanation: 'Critical risk of flash flooding. Extreme rainfall and river levels surpassing historical highs. Immediate action required.',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'waze_001',
    type: 'Road Closure',
    provider: 'Waze',
    severity: 'high',
    startTime: subMinutes(now, 20).toISOString(),
    description: 'Road closed due to flooding near Shibuya Station.',
    lat: 35.6580,
    lon: 139.7016,
  },
  {
    id: 'sipd_001',
    type: 'Flood',
    provider: 'SIP4D',
    severity: 'medium',
    startTime: subMinutes(now, 45).toISOString(),
    description: 'Early reports of river overflow in Area B. Emergency services dispatched.',
    lat: 35.6905,
    lon: 139.6930,
  },
  {
    id: 'waze_002',
    type: 'Traffic Jam',
    provider: 'Waze',
    severity: 'low',
    startTime: subMinutes(now, 10).toISOString(),
    description: 'Heavy traffic on Route 246 due to weather conditions.',
    lat: 35.6648,
    lon: 139.6983,
  },
  {
    id: 'manual_001',
    type: 'Landslide',
    provider: 'Manual',
    severity: 'high',
    startTime: subHours(now, 2).toISOString(),
    description: 'Small landslide reported by resident on hillside road.',
    lat: 35.7023,
    lon: 139.6800
  }
];

export const getRiskCategoryColor = (category: RiskCategory) => {
  switch (category) {
    case 'Severe': return 'hsl(var(--destructive))';
    case 'High': return 'hsl(var(--chart-5))';
    case 'Moderate': return 'hsl(var(--chart-4))';
    case 'Low': return 'hsl(var(--chart-2))';
    default: return 'hsl(var(--muted-foreground))';
  }
};
