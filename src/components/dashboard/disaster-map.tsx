'use client';

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { SensorEvent, Incident, RiskAssessment } from '@/lib/types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, Camera, RadioTower, Siren, TrafficCone, Waves, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRiskCategoryColor } from '@/lib/data';

type DisasterMapProps = {
  sensors: SensorEvent[];
  incidents: Incident[];
  alerts: RiskAssessment[];
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

export function DisasterMap({ sensors, incidents, alerts }: DisasterMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState<SensorEvent | Incident | RiskAssessment | null>(null);

  if (!apiKey) {
    return (
      <Card className="h-full flex flex-col items-center justify-center bg-muted/50 p-6 text-center">
        <CardHeader>
            <div className="mx-auto bg-card p-3 rounded-full">
                <AlertTriangle className="size-12 text-destructive" />
            </div>
          <CardTitle>Map Configuration Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            To display the interactive map, please provide a Google Maps API key.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Rename the `env.local.example` file to `.env.local` and add your key to the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` variable.
          </p>
          <Button asChild className="mt-4">
            <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer">Get API Key</a>
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
          <AdvancedMarker key={sensor.sensorId} position={{ lat: sensor.lat, lng: sensor.lon }} onClick={() => setSelected(sensor)}>
             <Pin background={'#1E88E5'} glyph={getSensorIcon(sensor.type)} borderColor={'#1E88E5'} />
          </AdvancedMarker>
        ))}
        {incidents.map((incident) => (
             <AdvancedMarker key={incident.id} position={{ lat: incident.lat, lng: incident.lon }} onClick={() => setSelected(incident)}>
                {getIncidentIcon(incident.type)}
             </AdvancedMarker>
        ))}

        {selected && (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lon }} onCloseClick={() => setSelected(null)}>
            <div className="p-2 w-64">
                {'sensorId' in selected ? (
                    <>
                        <h4 className="font-bold text-md">{selected.name}</h4>
                        <p className="text-sm text-muted-foreground">{selected.type}</p>
                        <p className="text-lg font-mono mt-2">{selected.value} {selected.unit}</p>
                        <p className={cn("text-xs font-semibold", selected.status === 'online' ? 'text-green-500' : 'text-red-500')}>{selected.status.toUpperCase()}</p>
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
