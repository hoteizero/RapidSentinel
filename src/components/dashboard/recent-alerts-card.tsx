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
};

export function RecentAlertsCard({ alerts }: RecentAlertsCardProps) {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>警報履歴</CardTitle>
          <CardDescription>アクティブな警報の履歴</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">全て表示 <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent className='flex-grow'>
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {sortedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4">
                <div className="p-2 rounded-full" style={{backgroundColor: getRiskCategoryColor(alert.riskCategory)}}>
                  <Siren className="size-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{alert.location}</p>
                  <p className="text-sm text-muted-foreground">{alert.riskCategory}リスク ({alert.riskScore})</p>
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
