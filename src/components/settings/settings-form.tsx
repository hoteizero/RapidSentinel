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

const settingsSchema = z.object({
  sensorFusionWeight: z.number().min(0).max(100),
  lofWeight: z.number().min(0).max(100),
  mahalanobisWeight: z.number().min(0).max(100),
  arimaWeight: z.number().min(0).max(100),
  moderateThreshold: z.number().min(0).max(100),
  highThreshold: z.number().min(0).max(100),
  severeThreshold: z.number().min(0).max(100),
  wazeIntegration: z.boolean(),
  wazeApiKey: z.string().optional(),
  sip4dIntegration: z.boolean(),
  sip4dEndpoint: z.string().url().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { toast } = useToast();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      sensorFusionWeight: 40,
      lofWeight: 20,
      mahalanobisWeight: 25,
      arimaWeight: 15,
      moderateThreshold: 50,
      highThreshold: 75,
      severeThreshold: 90,
      wazeIntegration: true,
      wazeApiKey: 'wz_live_xxxxxxxxxxxxxxxx',
      sip4dIntegration: true,
      sip4dEndpoint: 'https://api.sip4d.example.go.jp/v1',
    },
  });

  function onSubmit(data: SettingsFormValues) {
    console.log(data);
    toast({
      title: 'Settings Saved',
      description: 'Your new settings have been successfully applied.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Engine Component Weights</CardTitle>
            <CardDescription>
              Adjust the weight of each AI component in the final risk score calculation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="sensorFusionWeight"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>1. Sensor Fusion (Noise/Fault Detection)</FormLabel>
                    <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                  </div>
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
              name="lofWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>2. Local Outlier Factor (LOF)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
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
              name="mahalanobisWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>3. Mahalanobis Distance (Correlation)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
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
              name="arimaWeight"
              render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>4. ARIMA Residuals (Prediction Deviation)</FormLabel>
                        <span className="text-sm font-mono p-1 px-2 rounded-md bg-muted">{field.value}%</span>
                    </div>
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
        <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </Form>
  );
}
