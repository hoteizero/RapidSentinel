
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
      title: '設定を保存しました',
      description: '新しい設定が正常に適用されました。',
    });
  }

  function handleIntelligenceJob() {
    toast({
        title: "インテリジェンスジョブをキューに追加しました",
        description: `Job ID: job_intel_${Math.random().toString(36).substring(2, 10)} - ジョブはスケジュールされています。`,
        });
  }

  function handleAgentJob() {
    toast({
        title: "自動ジョブをスケジュールしました",
        description: `エージェントジョブ '${form.getValues('agentJobName')}' がスケジュールされました。`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>AIエンジンコンポーネントの重み</CardTitle>
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
            <CardTitle>AIリスク閾値</CardTitle>
            <CardDescription>
              各アラートレベルを発動させるリスクスコアの閾値を定義します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <FormField
              control={form.control}
              name="moderateThreshold"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>中リスク</FormLabel>
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
                        <FormLabel>高リスク</FormLabel>
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
                        <FormLabel>深刻リスク</FormLabel>
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
                <CardTitle>外部システム連携</CardTitle>
                <CardDescription>WazeおよびSIP4D（防災情報共有システム）との接続を管理します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                    control={form.control}
                    name="wazeIntegration"
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                             <div className="space-y-0.5">
                                <FormLabel>Waze for Cities (CCP) 連携</FormLabel>
                                <FormDescription>
                                    Wazeからリアルタイムの交通障害情報を取り込みます。
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
                                <FormLabel>SIP4D連携</FormLabel>
                                <FormDescription>
                                    国の災害情報共有プラットフォームとデータを共有します。
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
                <CardTitle>PoC・開発 (IO.net Intelligence API)</CardTitle>
                <CardDescription>
                    自然言語を使用して、モデルの迅速なプロトタイピングとテストを実行します。これは、中核的でない、判断を伴わないユースケース向けです。
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="ioNetPrompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>自然言語ジョブプロンプト</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder='例: "Run Python script analyze.py on 2 A100 GPUs..."' />
                            </FormControl>
                             <FormDescription>
                                実行したい単発の分析ジョブを記述してください。
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
                            <FormLabel>データソース</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="例: s3://bucket-name/data.csv" />
                            </FormControl>
                             <FormDescription>
                                ジョブに使用するデータソースへのパスを指定してください。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="button" onClick={handleIntelligenceJob}>インテリジェンスジョブを実行</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>自動バックグラウンドジョブ (IO.net Agent API)</CardTitle>
                <CardDescription>
                    モデルの再学習やシステム最適化のための定期的なジョブをスケジュールします。これにより、手動介入なしの継続的な改善ループが実現します。
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="agentJobName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ジョブ名</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='例: "nightly-model-retraining"' />
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
                            <FormLabel>スケジュール (Cron形式)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="例: 0 2 * * *" />
                            </FormControl>
                             <FormDescription>
                               ジョブの実行タイミングを定義します。例は「毎日午前2時」です。
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
                            <FormLabel>タスク定義</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder='定期的なタスクを記述してください...' />
                            </FormControl>
                             <FormDescription>
                                エージェントが実行するタスクの概要を記述します。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="button" onClick={handleAgentJob}>自動ジョブをスケジュール</Button>
            </CardContent>
        </Card>


        <div className="flex justify-end">
            <Button type="submit">すべての設定を保存</Button>
        </div>
      </form>
    </Form>
  );
}

    

    

    