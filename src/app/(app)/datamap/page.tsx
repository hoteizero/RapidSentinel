
'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMapData } from '@/lib/data';
import { useState } from 'react';
import { Waypoints } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DataMapPage() {
  const [selectedItem, setSelectedItem] = useState(mockMapData[0]);
  const [center, setCenter] = useState({ lat: selectedItem.lat, lng: selectedItem.lon });
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID';

  const handleItemClick = (item: typeof mockMapData[0]) => {
    setSelectedItem(item);
    setCenter({ lat: item.lat, lng: item.lon });
  };

  return (
    <div className="flex flex-col h-full -m-4 md:-m-6 lg:-m-8">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-2/3 border-r">
            <Map
              mapId={mapId}
              center={center}
              zoom={15}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              className="h-full w-full"
            >
              {mockMapData.map((item) => (
                <AdvancedMarker 
                  key={item.id} 
                  position={{ lat: item.lat, lng: item.lon }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={cn("h-4 w-4 rounded-full border-2", 
                    selectedItem.id === item.id ? 'bg-blue-500 border-white' : 'bg-red-500 border-white',
                    'animate-pulse'
                  )}></div>
                </AdvancedMarker>
              ))}
            </Map>
          </div>
          <aside className="w-1/3 flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Waypoints />
                    センサーデータ一覧
                </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-grow">
              <CardContent className="space-y-2">
                {mockMapData.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      'cursor-pointer hover:bg-muted/50',
                      selectedItem.id === item.id && 'border-primary bg-muted/30'
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <CardHeader className='pb-2'>
                      <CardTitle className="text-sm font-semibold">
                        {item.lat.toFixed(4)},{item.lon.toFixed(4)} - {item.riskCategory}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <p><span className="font-medium">スコア:</span> {item.riskScore}</p>
                      <p><span className="font-medium">理由:</span> {item.reason}</p>
                      <p><span className="font-medium">貢献センサー:</span> {item.contributingSensor}</p>
                      <p><span className="font-medium">信頼度:</span> {item.trustScore}</p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </ScrollArea>
          </aside>
        </div>
      </APIProvider>
    </div>
  );
}
