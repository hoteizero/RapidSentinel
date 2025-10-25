
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Airplay, Bot, Battery, Radio, Image as ImageIcon, Loader2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { analyzeDamageImage } from '@/ai/flows/analyze-damage-image';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const mockDrones = [
    { id: 'drone-01', status: 'Standby', battery: 95, signal: 'Strong', location: 'Fire Station A', image: '/images/drone-view-1.jpg' },
    { id: 'drone-02', status: 'Standby', battery: 100, signal: 'Strong', location: 'City Hall Roof', image: '/images/drone-view-2.jpg' },
    { id: 'drone-03', status: 'Flying', battery: 65, signal: 'Medium', location: 'Shibuya River Area', image: '/images/drone-view-3.jpg' },
    { id: 'drone-04', status: 'Charging', battery: 25, signal: 'N/A', location: 'Public Works Dept', image: null },
];

type AnalysisResult = {
    analysis: string;
    estimatedDamageLevel: 'Low' | 'Medium' | 'High' | 'Severe';
};

export default function DronesPage() {
    const { toast } = useToast();
    const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult | null>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const handleAnalyzeImage = async (droneId: string, imageUrl: string) => {
        setLoading(prev => ({ ...prev, [droneId]: true }));
        setAnalysisResults(prev => ({...prev, [droneId]: null})); // Clear previous result
        try {
            // Fetch the image and convert it to a data URI
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                const result = await analyzeDamageImage({ photoDataUri: base64data });
                setAnalysisResults(prev => ({ ...prev, [droneId]: result }));
                toast({
                    title: `Analysis Complete for ${droneId}`,
                    description: `Estimated Damage: ${result.estimatedDamageLevel}`,
                });
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the image. Please try again.',
            });
        } finally {
            setLoading(prev => ({ ...prev, [droneId]: false }));
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <Airplay />
                    ドローン・フリート管理
                </h1>
                <p className="text-muted-foreground">
                    ドローンの状態を監視し、現場の映像をAIで分析します。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDrones.map((drone) => (
                    <Card key={drone.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">{drone.id}</CardTitle>
                                <Badge variant={drone.status === 'Flying' ? 'destructive' : drone.status === 'Standby' ? 'default' : 'secondary'}>
                                    {drone.status}
                                </Badge>
                            </div>
                            <CardDescription>{drone.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="flex justify-around text-sm">
                                <div className="flex items-center gap-1">
                                    <Battery className="size-4 text-muted-foreground" />
                                    <span>{drone.battery}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Radio className="size-4 text-muted-foreground" />
                                    <span>{drone.signal}</span>
                                </div>
                            </div>
                            {drone.image ? (
                                <div className='space-y-2'>
                                    <div className="aspect-video rounded-md overflow-hidden border relative">
                                        <Image src={drone.image} alt={`View from ${drone.id}`} fill style={{objectFit: "cover"}} />
                                    </div>
                                    
                                    {analysisResults[drone.id] && (
                                        <Card className='bg-muted/50'>
                                            <CardHeader className='pb-2'>
                                                <CardTitle className='text-sm flex items-center gap-2'><FileText className='size-4' /> AI分析結果</CardTitle>
                                            </CardHeader>
                                            <CardContent className='text-xs space-y-1'>
                                                <p><span className='font-semibold'>被害レベル:</span> {analysisResults[drone.id]?.estimatedDamageLevel}</p>
                                                <p className='text-muted-foreground'>{analysisResults[drone.id]?.analysis}</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                                    <ImageIcon className="size-12 text-muted-foreground" />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                disabled={!drone.image || loading[drone.id]}
                                onClick={() => handleAnalyzeImage(drone.id, drone.image!)}
                            >
                                {loading[drone.id] ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Bot className="mr-2" />
                                )}
                                AIによる被害状況分析
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
