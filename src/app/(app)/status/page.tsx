
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSensors } from '@/lib/data';
import { ArrowRight, Bot, Cpu, RadioTower, Server, Wifi, Satellite, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function StatusPage() {
    const onlineSensors = mockSensors.filter(s => s.status === 'online').length;
    const totalSensors = mockSensors.length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <Server />
                    システム状態
                </h1>
                <p className="text-muted-foreground">
                    システム全体の健全性と稼働状況を監視します。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <RadioTower className='size-5 text-muted-foreground' />
                            センサーネットワーク
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className='flex items-baseline justify-center gap-2'>
                            <span className='text-4xl font-bold'>{onlineSensors}</span>
                            <span className='text-xl text-muted-foreground'>/ {totalSensors} 台</span>
                        </div>
                         <div className='text-center text-sm font-medium text-green-500'>
                            稼働率 {((onlineSensors / totalSensors) * 100).toFixed(1)}%
                        </div>
                         <Link href="/sensors" className="flex items-center justify-end text-sm text-primary hover:underline">
                            センサー一覧へ <ArrowRight className="ml-1 size-4" />
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className='size-5 text-muted-foreground' />
                            AI推論エンジン
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className='text-center text-4xl font-bold'>v2.3.1</div>
                         <div className='text-center text-sm text-muted-foreground'>
                            モデル更新日: 2025/10/01
                        </div>
                         <Link href="/xai" className="flex items-center justify-end text-sm text-primary hover:underline">
                            判断根拠の例 <ArrowRight className="ml-1 size-4" />
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                           <Cpu className='size-5 text-muted-foreground' />
                            ドローン・フリート
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className='flex items-baseline justify-center gap-2'>
                            <span className='text-4xl font-bold'>2</span>
                            <span className='text-xl text-muted-foreground'>機 待機中</span>
                        </div>
                         <div className='text-center text-sm text-muted-foreground'>
                            飛行中: 0機
                        </div>
                         <p className="flex items-center justify-end text-sm text-muted-foreground">
                            詳細 (準備中)
                        </p>
                    </CardContent>
                </Card>

                 <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <LinkIcon className='size-5 text-muted-foreground' />
                           外部システム連携
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <div>
                                <p className='font-semibold text-sm'>気象庁API</p>
                                <p className='text-xs text-muted-foreground'>正常</p>
                            </div>
                        </div>
                         <div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <div>
                                <p className='font-semibold text-sm'>J-ALERT</p>
                                <p className='text-xs text-muted-foreground'>正常</p>
                            </div>
                        </div>
                         <div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                             <div>
                                <p className='font-semibold text-sm'>防災行政無線</p>
                                <p className='text-xs text-muted-foreground'>待機中</p>
                            </div>
                        </div>
                         <div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div>
                                <p className='font-semibold text-sm'>ICOTクラウド</p>
                                <p className='text-xs text-muted-foreground'>応答遅延</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
