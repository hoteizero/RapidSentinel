import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRiskCategoryColor } from '@/lib/data';
import type { RiskAssessment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowRight, Siren } from 'lucide-react';
import Link from 'next/link';

type RecentAlertsCardProps = {
  alerts: RiskAssessment[];
  onSelectAlert: (alert: RiskAssessment) => void;
};

export function RecentAlertsCard({ alerts, onSelectAlert }: RecentAlertsCardProps) {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">警報履歴</CardTitle>
          <CardDescription>直近24時間の警報</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">全て表示 <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent className='flex-grow pt-2'>
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="space-y-2">
            {sortedAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => onSelectAlert(alert)}
                data-testid={`recent-alert-item-${alert.id}`}
              >
                <div className="p-2 mt-1 rounded-full" style={{backgroundColor: getRiskCategoryColor(alert.riskCategory)}}>
                  <Siren className="size-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{alert.location}</p>
                  <p className="text-xs text-muted-foreground">{alert.riskCategory}リスク (スコア: {alert.riskScore})</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(alert.time), { addSuffix: true, locale: ja })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
