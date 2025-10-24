
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const settingsSchema = z.object({
  trendAnalysisWeight: z.number().min(0).max(100),
  sensorFusionWeight: z.number().min(0).max(100),
  anomalyDetectionWeight: z.number().min(0).max(100),
  predictionDeviationWeight: z.number().min(0).max(100),
  moderateThreshold: z.number().min(0).max(100),
  highThreshold: z.number().min(0).max(100),
  severeThreshold: z.number().min(0).max(100),
  wazeIntegration: z.boolean(),
  wazeApiKey: z.string().optional(),
  sip4dIntegration: z.boolean(),
  sip4dEndpoint: z.string().url().optional(),
  ioNetPrompt: z.string().optional(),
  ioNetDataSource: z.string().optional(),
  agentJobName: z.string().optional(),
  agentJobSchedule: z.string().optional(),
  agentTaskDefinition: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { toast } = useToast();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      trendAnalysisWeight: 40,
      sensorFusionWeight: 25,
      anomalyDetectionWeight: 20,
      predictionDeviationWeight: 15,
      moderateThreshold: 50,
      highThreshold: 75,
      severeThreshold: 90,
      wazeIntegration: true,
      wazeApiKey: 'wz_live_xxxxxxxxxxxxxxxx',
      sip4dIntegration: true,
      sip4dEndpoint: 'https://api.sip4d.example.go.jp/v1',
      ioNetPrompt: 'Run R script sensor_fusion_lof.R on 1 A100 GPU for 10 minutes',
      ioNetDataSource: 's3://sakai-poc/sensor_data.csv',
      agentJobName: 'sakai-false-positive-analysis',
      agentJobSchedule: '0 2 * * *', // Every day at 2 AM
      agentTaskDefinition: 'Use the last 7 days of mis-detection data to re-optimize model weights.',
    },
  });

  function onSubmit(data: SettingsFormValues) {
    console.log(data);
    toast({
      title: 'Settings Saved',
      description: 'Your new settings have been successfully applied.',
    });
  }

  function handleIntelligenceJob() {
    toast({
        title: "Intelligence Job Queued",
        description: `Job ID: job_intel_${Math.random().toString(36).substring(2, 10)} - Your job is being scheduled.`,
        });
  }

  function handleAgentJob() {
    toast({
        title: "Automated Job Scheduled",
        description: `Agent job '${form.getValues('agentJobName')}' has been scheduled.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Engine Component Weights</CardTitle>
            <CardDescription>
              各AI分析コンポーネントが最終的なリスクスコアに与える影響の重みを調整します。センサーエラーや通信遅延を検知すると、信頼性の低いコンポーネントの重みは自動的に引き下げられます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="trendAnalysisWeight"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>1. 異常予兆検知 (トレンド分析)</FormLabel>
                    <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                  </div>
                  <FormDescription>水位上昇傾向や風速変動など、時系列データの変化率から数時間後の危険を予測します。</FormDescription>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sensorFusionWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>2. センサーフュージョン (複合パターン解析)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
                  <FormDescription>雨量、風速、河川水位などの複数センサー情報を組み合わせ、単独では見逃される複合的なリスクパターンを検出します。</FormDescription>
                  <FormControl>
                     <Slider
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="anomalyDetectionWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>3. 異常検知 (LOF, Mahalanobis)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
                  <FormDescription>過去の正常データから大きく外れた異常値を統計的に検出し、突発的な変化を捉えます。</FormDescription>
                  <FormControl>
                     <Slider
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="predictionDeviationWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>4. 予測モデルとの乖離 (ARIMA)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
                     <FormDescription>AIによる将来予測と、実際のセンサー値の差を監視し、予測不能な急激な状況悪化を検知します。</FormDescription>
                  <FormControl>
                     <Slider
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Risk Thresholds</CardTitle>
            <CardDescription>
              Define the risk score thresholds for triggering different alert levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <FormField
              control={form.control}
              name="moderateThreshold"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Moderate Risk</FormLabel>
                    <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highThreshold"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>High Risk</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}</span>
                    </div>
                  <FormControl>
                     <Slider
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="severeThreshold"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>Severe Risk</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}</span>
                    </div>
                  <FormControl>
                     <Slider
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>Manage connections to Waze and SIP4D.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                    control={form.control}
                    name="wazeIntegration"
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                             <div className="space-y-0.5">
                                <FormLabel>Waze for Cities (CCP) Integration</FormLabel>
                                <FormDescription>
                                    Incorporate real-time traffic incidents from Waze.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="sip4dIntegration"
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                             <div className="space-y-0.5">
                                <FormLabel>SIP4D Integration</FormLabel>
                                <FormDescription>
                                    Share data with the national disaster information platform.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>PoC &amp; Development (IO.net Intelligence API)</CardTitle>
                <CardDescription>
                    Rapidly prototype and test models using natural language. This is for non-core, non-judgemental use cases.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="ioNetPrompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Natural Language Job Prompt</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder='e.g. "Run Python script analyze.py on 2 A100 GPUs..."' />
                            </FormControl>
                             <FormDescription>
                                Describe the one-off analysis job you want to run.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="ioNetDataSource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Source</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g., s3://bucket-name/data.csv" />
                            </FormControl>
                             <FormDescription>
                                Provide the path to the data source for the job.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="button" onClick={handleIntelligenceJob}>Run Intelligence Job</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Automated Background Jobs (IO.net Agent API)</CardTitle>
                <CardDescription>
                    Schedule recurring jobs for model retraining and system optimization. This creates a continuous improvement loop without manual intervention.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="agentJobName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='e.g., "nightly-model-retraining"' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="agentJobSchedule"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Schedule (Cron Format)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g., 0 2 * * *" />
                            </FormControl>
                             <FormDescription>
                               Define when the job should run. The example is for "every day at 2:00 AM".
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="agentTaskDefinition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Definition</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder='Describe the recurring task...' />
                            </FormControl>
                             <FormDescription>
                                High-level description of the task for the agent to execute.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="button" onClick={handleAgentJob}>Schedule Automated Job</Button>
            </CardContent>
        </Card>


        <div className="flex justify-end">
            <Button type="submit">Save All Settings</Button>
        </div>
      </form>
    </Form>
  );
}

    

    