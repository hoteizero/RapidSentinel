'use client';

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { SensorEvent, Incident, RiskAssessment } from '@/lib/types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, Camera, RadioTower, Siren, TrafficCone, Waves, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

type DisasterMapProps = {
  sensors: SensorEvent[];
  incidents: Incident[];
  alerts: RiskAssessment[];
  onSelectItem: (item: SensorEvent | Incident | RiskAssessment) => void;
};

function getSensorIcon(type: SensorEvent['type']) {
    switch(type) {
        case 'Rain': return <Waves className="size-4 text-white" />;
        case 'Wind': return <Wind className="size-4 text-white" />;
        case 'River Level': return <Waves className="size-4 text-white" />;
        case 'Seismic': return <Siren className="size-4 text-white" />;
        case 'Camera': return <Camera className="size-4 text-white" />;
        default: return <RadioTower className="size-4 text-white" />;
    }
}

function getIncidentIcon(type: Incident['type']) {
    switch(type) {
        case 'Flood': return <AlertTriangle className="size-5 text-destructive" />;
        case 'Road Closure': return <TrafficCone className="size-5 text-orange-500" />;
        case 'Landslide': return <AlertTriangle className="size-5 text-yellow-600" />;
        default: return <Siren className="size-5 text-muted-foreground" />;
    }
}

export function DisasterMap({ sensors, incidents, alerts, onSelectItem }: DisasterMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState<SensorEvent | Incident | RiskAssessment | null>(null);

  const handleMarkerClick = (item: SensorEvent | Incident | RiskAssessment) => {
    setSelected(item);
    onSelectItem(item);
  };

  if (!apiKey) {
    return (
      <Card className="h-full flex flex-col items-center justify-center bg-muted/50 p-6 text-center">
        <CardHeader>
            <div className="mx-auto bg-card p-3 rounded-full">
                <AlertTriangle className="size-12 text-destructive" />
            </div>
          <CardTitle>地図の表示には設定が必要です</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            インタラクティブマップを表示するには、Google Maps APIキーを提供してください。
          </p>
          <p className="text-sm text-muted-foreground/80">
            `.env.local.example` ファイルを `.env.local` にリネームし、`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 変数にキーを追加してください。
          </p>
          <Button asChild className="mt-4">
            <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer">APIキーを取得</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const center = { lat: 35.68, lon: 139.69 };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: center.lat, lng: center.lon }}
        defaultZoom={12}
        mapId="RAPIDSENSE_MAP_ID"
        fullscreenControl={false}
        mapTypeControl={false}
        streetViewControl={false}
        className="h-full w-full"
      >
        {sensors.map((sensor) => (
          <AdvancedMarker key={sensor.sensorId} position={{ lat: sensor.lat, lng: sensor.lon }} onClick={() => handleMarkerClick(sensor)}>
             <Pin background={'#1E88E5'} glyph={getSensorIcon(sensor.type)} borderColor={'#1E88E5'} />
          </AdvancedMarker>
        ))}
        {incidents.map((incident) => (
             <AdvancedMarker key={incident.id} position={{ lat: incident.lat, lng: incident.lon }} onClick={() => handleMarkerClick(incident)}>
                {getIncidentIcon(incident.type)}
             </AdvancedMarker>
        ))}

        {selected && (
          <InfoWindow position={{ lat: selected.lat, lng: 'lon' in selected ? selected.lon : selected.lng }} onCloseClick={() => setSelected(null)}>
            <div className="p-2 w-64">
                {'sensorId' in selected ? (
                    <>
                        <h4 className="font-bold text-md">{selected.name}</h4>
                        <p className="text-sm text-muted-foreground">{selected.type}</p>
                        <p className="text-lg font-mono mt-2">{selected.value} {selected.unit}</p>
                        <p className={cn("text-xs font-semibold", selected.status === 'online' ? 'text-green-500' : 'text-red-500')}>{selected.status.toUpperCase()}</p>
                    </>
                ) : 'riskScore' in selected ? (
                     <>
                        <h4 className="font-bold text-md">{selected.location}</h4>
                        <p className="text-sm text-muted-foreground">{selected.riskCategory} Risk</p>
                        <p className="text-lg font-mono mt-2">{selected.riskScore}</p>
                    </>
                ) : (
                    <>
                        <h4 className="font-bold text-md">{selected.type}</h4>
                        <p className="text-sm text-muted-foreground">{selected.provider}</p>
                        <p className="text-sm mt-2">{selected.description}</p>
                    </>
                )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
