
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileDown, FileText, Map, Table } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
    const { toast } = useToast();
    const [reportType, setReportType] = useState('daily');
    const [reportFormat, setReportFormat] = useState('pdf');
    const [exportData, setExportData] = useState('alerts');
    const [exportFormat, setExportFormat] = useState('csv');


    const handleGenerateReport = () => {
        toast({
            title: "レポート生成を開始しました",
            description: `${reportType} report in ${reportFormat.toUpperCase()} format is being generated.`,
        });
    };

    const handleExportMap = () => {
        toast({
            title: "リスクマップをエクスポート中",
            description: "The latest risk map is being exported as a PDF.",
        });
    };

    const handleExportData = () => {
        toast({
            title: "データエクスポートを開始しました",
            description: `Exporting ${exportData} data in ${exportFormat.toUpperCase()} format.`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <FileText />
                    レポート・分析支援
                </h1>
                <p className="text-muted-foreground">
                    各種レポートの生成、リスクマップの出力、データのダウンロードを行います。
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileDown className='size-5 text-muted-foreground' />
                            自動レポート生成
                        </CardTitle>
                        <CardDescription>日報・週報・月報をPDFまたはExcel形式で自動生成します。</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="grid w-full sm:w-auto grid-cols-2 gap-4">
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="種類" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">日報</SelectItem>
                                    <SelectItem value="weekly">週報</SelectItem>
                                    <SelectItem value="monthly">月報</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={reportFormat} onValueChange={setReportFormat}>
                                <SelectTrigger>
                                    <SelectValue placeholder="形式" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerateReport} className="w-full sm:w-auto flex-shrink-0">
                            生成
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                           <Map className='size-5 text-muted-foreground' />
                            リスクマップ出力
                        </CardTitle>
                        <CardDescription>最新のリスク状況を地図としてPDF化します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExportMap} className="w-full">
                            PDFでエクスポート
                        </Button>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Table className='size-5 text-muted-foreground' />
                           データエクスポート
                        </CardTitle>
                        <CardDescription>警報履歴やセンサーデータをCSV/JSON形式でダウンロードします。</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="grid w-full sm:w-auto grid-cols-2 gap-4">
                            <Select value={exportData} onValueChange={setExportData}>
                                <SelectTrigger>
                                    <SelectValue placeholder="データ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alerts">警報履歴</SelectItem>
                                    <SelectItem value="sensors">センサーデータ</SelectItem>
                                    <SelectItem value="incidents">インシデント</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                                <SelectTrigger>
                                    <SelectValue placeholder="形式" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleExportData} className="w-full sm:w-auto flex-shrink-0">
                            エクスポート
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
