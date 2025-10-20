export type SensorType = "Rain" | "Wind" | "River Level" | "Seismic" | "Camera" | "Acoustic";

export interface ICOTStatus {
    recognized: boolean;
    color_state: "RED" | "GREEN" | "TRANSPARENT" | "BLACK";
    pattern_integrity: number;
    last_seen_by: string;
}

export interface SensorEvent {
  sensorId: string;
  type: SensorType;
  timestamp: string; // ISO 8601 format
  value: number;
  unit: string;
  lat: number;
  lon: number;
  accuracy: number;
  status: 'online' | 'offline' | 'error';
  name: string;
}

export type RiskCategory = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface RiskAssessment {
  id: string;
  location: string;
  time: string; // ISO 8601 format
  riskScore: number; // 0-100
  riskCategory: RiskCategory;
  contributingSensors: string[]; // array of sensorIds
  explanation: string;
  summary?: string;
  icotStatus?: ICOTStatus;
  trustScore?: number;
}

export type IncidentType = 'Flood' | 'Road Closure' | 'Traffic Jam' | 'Landslide';

export interface Incident {
  id: string;
  type: IncidentType;
  provider: 'Waze' | 'SIP4D' | 'Manual';
  severity: 'low' | 'medium' | 'high';
  startTime: string; // ISO 8601 format
  endTime?: string;
  description: string;
  lat: number;
  lon: number;
}
