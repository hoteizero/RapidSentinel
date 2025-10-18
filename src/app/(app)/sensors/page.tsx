import { SensorsTable } from "@/components/sensors/sensors-table";
import { mockSensors } from "@/lib/data";

export default function SensorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Sensors</h1>
        <p className="text-muted-foreground">
          Monitor the status and data from all connected sensors in real-time.
        </p>
      </div>
      <SensorsTable sensors={mockSensors} />
    </div>
  );
}
