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
    location: '渋谷川エリア',
    time: subMinutes(now, 5).toISOString(),
    riskScore: 85,
    riskCategory: 'High',
    contributingSensors: ['sensor_003', 'sensor_004', 'sensor_008'],
    explanation: '激しい降雨（25mm/h）と高い河川水位（4.8mおよび5.9m）が組み合わさり、渋谷川周辺での局所的な洪水の可能性が高いことを示しています。河川水位の上昇速度が危機的です。',
    icotStatus: { recognized: true, color_state: 'RED', pattern_integrity: 0.98, last_seen_by: 'drone-03' },
    trustScore: 0.92,
  },
  {
    id: 'alert_002',
    location: '海岸エリアC',
    time: subHours(now, 1).toISOString(),
    riskScore: 62,
    riskCategory: 'Moderate',
    contributingSensors: ['sensor_002'],
    explanation: '持続的な強風（15.2 m/s）が仮設構造物に中程度のリスクをもたらし、停電を引き起こす可能性があります。他の重要なセンサー測定値はありません。',
    icotStatus: { recognized: true, color_state: 'TRANSPARENT', pattern_integrity: 1.0, last_seen_by: 'camera-12' },
    trustScore: 0.75,
  },
  {
    id: 'alert_003',
    location: '中心市街地',
    time: subDays(now, 1).toISOString(),
    riskScore: 30,
    riskCategory: 'Low',
    contributingSensors: ['sensor_005'],
    explanation: '軽微な地震活動が検出されましたが、構造的損傷の閾値を大幅に下回っています。他のすべてのセンサーは正常な状態を報告しています。',
    icotStatus: { recognized: true, color_state: 'TRANSPARENT', pattern_integrity: 1.0, last_seen_by: 'manual-check' },
    trustScore: 0.95,
  },
    {
    id: 'alert_004',
    location: 'D地区',
    time: subDays(now, 2).toISOString(),
    riskScore: 95,
    riskCategory: 'Severe',
    contributingSensors: ['sensor_003', 'sensor_004', 'sensor_008'],
    explanation: '鉄砲水のリスクが極めて高い状態です。記録的な降雨量と河川水位が過去最高を超えています。即時の対応が必要です。',
    icotStatus: { recognized: true, color_state: 'RED', pattern_integrity: 0.99, last_seen_by: 'drone-01' },
    trustScore: 0.98,
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
