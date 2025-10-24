
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FlaskConical, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SimulationPage() {
    const { toast } = useToast();
    const [rainfall, setRainfall] = useState([20]);
    const [riverLevel, setRiverLevel] = useState([3.5]);
    const [seismic, setSeismic] = useState([0.01]);

    const [riskScore, setRiskScore] = useState<number | null>(null);
    const [riskCategory, setRiskCategory] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string | null>(null);

    const handleRunSimulation = () => {
        const score = (rainfall[0] * 1.5) + (riverLevel[0] * 10) + (seismic[0] * 100);
        let category = 'Low';
        let exp = 'Calculated risk is low based on input parameters.';
        if (score > 80) {
            category = 'Severe';
            exp = 'Severe risk detected due to critical combination of rainfall and river level.';
        } else if (score > 60) {
            category = 'High';
            exp = 'High risk detected. River level approaching dangerous thresholds.';
        } else if (score > 40) {
            category = 'Moderate';
            exp = 'Moderate risk. Increased rainfall is causing river levels to rise.';
        }

        setRiskScore(Math.min(Math.round(score), 100));
        setRiskCategory(category);
        setExplanation(exp);

        toast({
            title: "シミュレーション完了",
            description: `推定リスクスコア: ${Math.min(Math.round(score), 100)} (${category})`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <FlaskConical />
                    シミュレーションモード
                </h1>
                <p className="text-muted-foreground">
                    仮想的にセンサーデータを入力し、AIのリスク評価挙動を確認します。防災訓練や教育に活用できます。
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>入力パラメータ</CardTitle>
                        <CardDescription>各センサーの仮想データをスライダーで設定してください。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <Label htmlFor="rainfall-slider">雨量 (mm/h)</Label>
                                <span className='font-mono text-sm'>{rainfall[0]} mm/h</span>
                            </div>
                            <Slider id="rainfall-slider" value={rainfall} onValueChange={setRainfall} max={100} step={5} />
                        </div>
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <Label htmlFor="river-level-slider">河川水位 (m)</Label>
                                <span className='font-mono text-sm'>{riverLevel[0].toFixed(1)} m</span>
                            </div>
                            <Slider id="river-level-slider" value={riverLevel} onValueChange={setRiverLevel} max={10} step={0.1} />
                        </div>
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <Label htmlFor="seismic-slider">震度 (g)</Label>
                                <span className='font-mono text-sm'>{seismic[0].toFixed(2)} g</span>
                            </div>
                            <Slider id="seismic-slider" value={seismic} onValueChange={setSeismic} max={1} step={0.01} />
                        </div>
                        <Button onClick={handleRunSimulation} className="w-full">
                            シミュレーション実行
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot />AI評価結果</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
                        {riskScore !== null ? (
                            <>
                                <p className="text-6xl font-bold">{riskScore}</p>
                                <p className="text-xl font-semibold">{riskCategory}</p>
                                <p className="text-sm text-center text-muted-foreground">{explanation}</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-center">シミュレーションを実行してAIの評価結果を表示します。</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
