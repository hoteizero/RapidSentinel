

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
  id: string; // disaster_id
  location: string; // Describes the area, e.g., "Shibuya River Area"
  time: string; // ISO 8601 format (timestamp)
  riskScore: number; // 0-100, maps to severity
  riskCategory: RiskCategory; // e.g., 'High', maps to severity
  contributingSensors: string[]; // array of sensorIds
  explanation: string;
  summary?: string;
  icotStatus?: ICOTStatus;
  trustScore?: number;
}

export type IncidentType = 'Flood' | 'Road Closure' | 'Traffic Jam' | 'Landslide' | 'Earthquake';

export interface Incident {
  id: string; // disaster_id
  type: IncidentType;
  provider: 'Waze' | 'SIP4D' | 'Manual' | 'JMA'; // source
  severity: 'low' | 'medium' | 'high'; // maps to severity
  startTime: string; // ISO 8601 format (timestamp)
  endTime?: string;
  description: string;
  lat: number; // Part of location
  lon: number; // Part of location
}

export interface MapData {
    id: string;
    lat: number;
    lon: number;
    riskScore: number;
    riskCategory: RiskCategory;
    reason: string;
    contributingSensor: string;
    trustScore: number;
}
