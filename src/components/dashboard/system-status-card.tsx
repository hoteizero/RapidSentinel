'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Server, Bot } from 'lucide-react';

export function SystemStatusCard() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-2'>
        <CardTitle className="text-lg">システム状態</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-2 text-sm'>
        <div className='flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg'>
            <Server className="size-5 mb-1 text-muted-foreground" />
            <span className='font-bold'>98/100</span>
            <span className='text-xs text-muted-foreground'>センサー</span>
        </div>
        <div className='flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg'>
            <Cpu className="size-5 mb-1 text-muted-foreground" />
            <span className='font-bold'>2機 待機</span>
            <span className='text-xs text-muted-foreground'>ドローン</span>
        </div>
        <div className='flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg'>
            <Bot className="size-5 mb-1 text-muted-foreground" />
            <span className='font-bold'>v2.3.1</span>
            <span className='text-xs text-muted-foreground'>AIモデル</span>
        </div>
      </CardContent>
    </Card>
  );
}
