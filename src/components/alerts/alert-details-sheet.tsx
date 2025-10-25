'use client';
import { useState, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRiskCategoryColor, mockSensors } from '@/lib/data';
import type { RiskAssessment } from '@/lib/types';
import { format } from 'date-fns';
import { Bot, Lightbulb, MessageSquareQuote, Loader2, Send, Volume2, Pause } from 'lucide-react';
import { summarizeAlertReasoning } from '@/ai/flows/summarize-alert-reasoning';
import { generateRiskAssessmentExplanation } from '@/ai/flows/generate-risk-assessment-explanation';
import { personalizeAlertMessage } from '@/ai/flows/personalize-alert-message';
import { generateSpeech } from '@/ai/flows/generate-speech';
import { useToast } from '@/hooks/use-toast';


type AlertDetailsSheetProps = {
  alert: RiskAssessment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type LoadingState = {
    summary: boolean;
    explanation: boolean;
    personalization: boolean;
    speech: boolean;
}

export function AlertDetailsSheet({ alert, open, onOpenChange }: AlertDetailsSheetProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState<LoadingState>({ summary: false, explanation: false, personalization: false, speech: false });
    const [summary, setSummary] = useState('');
    const [explanation, setExplanation] = useState('');
    const [personalizedMessage, setPersonalizedMessage] = useState('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const [role, setRole] = useState('citizen');
    const [location, setLocation] = useState('123 Main St, Anytown');

    const handleGenerateSummary = async () => {
        if (!alert) return;
        setLoading(prev => ({...prev, summary: true}));
        const contributingSensorData = mockSensors.filter(s => alert.contributingSensors.includes(s.sensorId));
        const sensorDataString = contributingSensorData.map(s => `${s.name} (${s.type}): ${s.value} ${s.unit}`).join(', ');

        try {
            const result = await summarizeAlertReasoning({
                riskCategory: alert.riskCategory,
                riskScore: alert.riskScore,
                location: alert.location,
                time: alert.time,
                sensorData: sensorDataString,
                explanation: alert.explanation,
            });
            setSummary(result.summary);
        } catch (e) {
            console.error(e);
            setSummary("Failed to generate summary.");
        } finally {
            setLoading(prev => ({...prev, summary: false}));
        }
    };

    const handleGenerateExplanation = async () => {
         if (!alert) return;
        setLoading(prev => ({...prev, explanation: true}));
        const contributingSensorData = mockSensors.filter(s => alert.contributingSensors.includes(s.sensorId));
        const sensorDataString = contributingSensorData.map(s => `${s.name} (${s.type}): ${s.value} ${s.unit}`).join(', ');

        try {
            const result = await generateRiskAssessmentExplanation({
                riskCategory: alert.riskCategory,
                riskScore: alert.riskScore,
                contributingSensors: contributingSensorData.map(s => s.name).join(', '),
                sensorData: sensorDataString,
            });
            setExplanation(result.explanation);
        } catch (e) {
            console.error(e);
            setExplanation("Failed to generate explanation.");
        } finally {
            setLoading(prev => ({...prev, explanation: false}));
        }
    };

    const handlePersonalizeMessage = async () => {
        if (!alert) return;
        setLoading(prev => ({...prev, personalization: true}));
        
        try {
             const result = await personalizeAlertMessage({
                alertMessage: `A ${alert.riskCategory} risk alert (score: ${alert.riskScore}) has been issued for ${alert.location}.`,
                location: location,
                role: role,
                nearbyShelters: "Central Community Center (2 miles away), North High School (3.5 miles away)",
                evacuationRoutes: "Main Street is the primary evacuation route. Avoid River Road due to potential flooding.",
            });
            setPersonalizedMessage(result.personalizedMessage);
        } catch (e) {
            console.error(e);
            setPersonalizedMessage("Failed to generate personalized message.");
        } finally {
            setLoading(prev => ({...prev, personalization: false}));
        }
    }

    const handleGenerateSpeech = async () => {
        if (!personalizedMessage) {
            toast({
                variant: 'destructive',
                title: 'No Message to Read',
                description: 'Please generate a personalized message first.',
            });
            return;
        }
        setLoading(prev => ({ ...prev, speech: true }));
        setAudioUrl(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);

        try {
            const audioDataUri = await generateSpeech(personalizedMessage);
            setAudioUrl(audioDataUri);
            const audio = new Audio(audioDataUri);
            audioRef.current = audio;
            audio.play();
            setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
        } catch (error) {
            console.error('Error generating speech:', error);
            toast({
                variant: 'destructive',
                title: 'Speech Generation Failed',
                description: 'Could not convert the message to speech.',
            });
        } finally {
            setLoading(prev => ({ ...prev, speech: false }));
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };


    const handleNotifyPublic = () => {
        if (!personalizedMessage) {
            toast({
                variant: 'destructive',
                title: 'メッセージがありません',
                description: '先にパーソナライズされたメッセージを生成してください。',
            });
            return;
        }
        toast({
            title: '住民向けアプリに通知を送信しました',
            description: `"${personalizedMessage.substring(0, 50)}..."`,
        });
    };

  if (!alert) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0" data-testid={`alert-details-sheet-${alert.id}`}>
        <div className='flex flex-col h-full'>
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline text-2xl">{alert.location}</SheetTitle>
          <SheetDescription>
            {format(new Date(alert.time), 'PPP p')}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6">
            <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='text-4xl font-bold font-mono' style={{color: getRiskCategoryColor(alert.riskCategory)}}>{alert.riskScore}</div>
                    <div>
                        <div className="text-sm text-muted-foreground">Risk Score</div>
                        <Badge className="text-white" style={{ backgroundColor: getRiskCategoryColor(alert.riskCategory) }}>
                            {alert.riskCategory}
                        </Badge>
                    </div>
                </div>
                <div>
                     <h4 className="text-sm font-semibold mb-2">Contributing Sensors</h4>
                     <div className='flex flex-wrap gap-1'>
                        {alert.contributingSensors.map(id => (
                            <Badge key={id} variant="secondary">{mockSensors.find(s => s.sensorId === id)?.name || id}</Badge>
                        ))}
                     </div>
                </div>
            </div>
            
            <p className='text-sm'>{alert.explanation}</p>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Bot /> AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* Summarize Reasoning */}
                    <div className='space-y-2'>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="summary">Alert Reasoning Summary</Label>
                            <Button size="sm" onClick={handleGenerateSummary} disabled={loading.summary} data-testid="gen-summary-button">
                                {loading.summary ? <Loader2 className="animate-spin" /> : <MessageSquareQuote />}
                                Generate Summary
                            </Button>
                        </div>
                        <Textarea id="summary" value={summary} readOnly placeholder='Click "Generate Summary" to get an AI-powered summary...' />
                    </div>

                    {/* Explain Assessment */}
                     <div className='space-y-2'>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="explanation">Risk Assessment Explanation</Label>
                            <Button size="sm" onClick={handleGenerateExplanation} disabled={loading.explanation} data-testid="gen-explanation-button">
                                {loading.explanation ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                                Explain Assessment
                            </Button>
                        </div>
                        <Textarea id="explanation" value={explanation} readOnly placeholder='Click "Explain Assessment" for a detailed breakdown...' />
                    </div>

                     {/* Personalize Message */}
                    <div className='space-y-4 pt-4 border-t'>
                         <Label>Personalize Alert Message</Label>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-xs">User Role</Label>
                                <Select onValueChange={setRole} defaultValue={role}>
                                    <SelectTrigger id="role" data-testid="personalize-role-select"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="citizen">Citizen</SelectItem>
                                        <SelectItem value="fire_fighter">Fire Fighter</SelectItem>
                                        <SelectItem value="police_officer">Police Officer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-xs">User Location</Label>
                                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} data-testid="personalize-location-input" />
                            </div>
                         </div>
                        <Button className="w-full" onClick={handlePersonalizeMessage} disabled={loading.personalization} data-testid="gen-personalization-button">
                            {loading.personalization ? <Loader2 className="animate-spin" /> : null}
                            Generate Personalized Message
                        </Button>
                        <Textarea value={personalizedMessage} readOnly placeholder='Generated personalized message will appear here...' />
                        
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleGenerateSpeech}
                                disabled={loading.speech || !personalizedMessage}
                            >
                                {loading.speech ? <Loader2 className="animate-spin" /> : <Volume2 />}
                                メッセージ読み上げ
                            </Button>
                            {audioUrl && (
                                <Button variant="ghost" size="icon" onClick={togglePlayPause}>
                                    {isPlaying ? <Pause /> : <Volume2 />}
                                </Button>
                            )}
                        </div>

                        <Button variant="outline" className="w-full" onClick={handleNotifyPublic}>
                            <Send className="mr-2" />
                            住民向けアプリに通知
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
        <SheetFooter className="p-6 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
