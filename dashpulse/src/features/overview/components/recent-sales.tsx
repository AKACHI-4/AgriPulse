import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

// Mock sensor alerts (Replace with real API data)
const sensorAlerts = [
  {
    id: 1,
    message: 'Soil moisture level is low',
    sensor: 'Field Sensor 01',
    timeAgo: '10 mins ago',
  },
];

export function RecentSales() {
  return (
    <Card className="min-h-[435px]">
      <CardHeader>
        <CardTitle>Sensor Alerts</CardTitle>
        <CardDescription>Live updates from your IoT sensors.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {sensorAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center">
              <Avatar className="h-9 w-9 text-white">
                <AvatarFallback className='bg-red-600'>⚠</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-sm text-muted-foreground">{alert.sensor}</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">{alert.timeAgo}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
