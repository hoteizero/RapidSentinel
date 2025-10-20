
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bot, CheckCircle2, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';
import { mockRiskAssessments } from '@/lib/data';

export default function XAIPage() {
  const selectedRiskAssessment = mockRiskAssessments[3]; // Highest risk for demonstration

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
          <Bot />
          AI判断根拠 (XAI)
        </h1>
        <p className="text-muted-foreground">
          AIによるリスク評価の詳細な根拠と分析レイヤーを確認します。
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            分析対象: {selectedRiskAssessment.location} (ID: {selectedRiskAssessment.id})
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                 <Card className='col-span-1 md:col-span-1'>
                    <CardHeader>
                        <CardTitle className='text-lg'>地点情報</CardTitle>
                    </CardHeader>
                    <CardContent className='text-sm space-y-2'>
                        <p><span className='font-semibold'>ID:</span> {selectedRiskAssessment.id.replace('alert', 'ICOT')}</p>
                        <p><span className='font-semibold'>名称:</span> マンホール（海岸通3丁目）</p>
                        <p><span className='font-semibold'>設備情報:</span> 下水道幹線・口径1200mm・設置年：2018</p>
                        <p className='text-xs text-muted-foreground pt-2'>{selectedRiskAssessment.location}</p>
                    </CardContent>
                </Card>
                 <Card className='col-span-1 md:col-span-2'>
                    <CardHeader>
                        <CardTitle className='text-lg flex items-center gap-2'><ShieldCheck className='size-5'/> 総合評価</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className='font-bold text-2xl mb-3'>浸水リスク: <span className='text-red-500'>{selectedRiskAssessment.riskScore}%</span> (信頼度: <span className='text-blue-400'>{selectedRiskAssessment.trustScore ? `${(selectedRiskAssessment.trustScore * 100).toFixed(0)}%` : 'N/A'})</span></p>
                        <p className='text-muted-foreground'>
                            複数の分析レイヤーと物理的検証を統合した結果、対象地点におけるリスクは「{selectedRiskAssessment.riskCategory}」と判断されました。
                            以下の詳細な根拠を確認してください。
                        </p>
                    </CardContent>
                </Card>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'><Bot className='size-5'/> AI分析レイヤー</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3 text-sm'>
                        <div className='flex items-start gap-3 p-3 bg-muted/30 rounded-md border border-red-500/50'>
                            <CheckCircle2 className='size-5 mt-0.5 shrink-0 text-red-400'/>
                            <div>
                                <h4 className='font-semibold'>L1: 単変量閾値超過</h4>
                                <p className='text-muted-foreground'>河川水位が警報レベル (4.5m) を超過しています (現在4.8m)。これは即時対応が必要な最も明確な兆候です。</p>
                            </div>
                        </div>
                         <div className='flex items-start gap-3 p-3 bg-muted/30 rounded-md border border-red-500/50'>
                            <CheckCircle2 className='size-5 mt-0.5 shrink-0 text-red-400'/>
                             <div>
                                <h4 className='font-semibold'>L2: 相関異常 (マハラノビス法)</h4>
                                <p className='text-muted-foreground'>現在の降雨量に対し、過去の正常データと比較して水位上昇が異常に速いパターンを検出しました。これは単純な水位だけでは見逃す可能性のある複合的なリスクを示唆しています。</p>
                            </div>
                        </div>
                         <div className='flex items-start gap-3 p-3 bg-muted/30 rounded-md border-amber-500/50'>
                            <AlertCircle className='size-5 mt-0.5 shrink-0 text-amber-500'/>
                            <div>
                                <h4 className='font-semibold'>L3: 予測モデルとの乖離</h4>
                                <p className='text-muted-foreground'>AIによる30分後の水位予測 (4.6m) を、現在の水位が既に超過しています。これは状況が予測よりも速く悪化していることを示します。</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3 p-3 bg-muted/30 rounded-md border-green-500/50 font-bold text-green-400 border-t border-border/50 pt-2 mt-2'>
                            <Cpu className='size-5 mt-0.5 shrink-0'/>
                            <div>
                                <h4 className='font-semibold text-foreground'>物理的検証 (ICOT)</h4>
                                <p className='text-green-500'>{selectedRiskAssessment.icotStatus?.color_state === 'RED' ? 'マーカー水没（赤変）をカメラで物理的に確認済みです。' : '状態正常'} (信頼度: {selectedRiskAssessment.icotStatus ? `${(selectedRiskAssessment.icotStatus.pattern_integrity * 100).toFixed(0)}%` : 'N/A'})</p>
                                <p className='text-muted-foreground font-normal'>統計的・予測的分析の結果を、物理的な証拠が裏付けており、このアラートの信頼性は非常に高いと評価できます。</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
