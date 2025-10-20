'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RiskAssessment } from '@/lib/types';
import { AlertTriangle, Check, CircleX, Airplay, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type ActionFooterProps = {
  latestAlert: RiskAssessment | null;
};

export function ActionFooter({ latestAlert }: ActionFooterProps) {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `Action: ${action}`,
      description: `"${latestAlert?.explanation}"`,
    });
  };

  return (
    <footer data-testid="action-footer" className="h-[10vh] bg-background border-t flex items-center justify-between px-6 shrink-0">
      <div className='flex items-center gap-3 text-sm'>
        <AlertTriangle className="size-6 text-yellow-500 animate-pulse" />
        <div>
          <p className="font-bold">最新アラート</p>
          <p className='text-muted-foreground'>
            {latestAlert ? `「${latestAlert.explanation.substring(0,40)}... (信頼度${latestAlert.riskScore}%)」` : 'アラートはありません'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAction('確認')} data-testid="action-confirm">
          <Check />
          確認
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" data-testid="action-false-positive">
              <CircleX />
              誤検知
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>誤検知として報告しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作はAIの学習データに影響を与えます。実行する前に、これが誤検知であることを十分に確認してください。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction('誤検知')}>はい、報告します</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="destructive" className='long-press-button' data-testid="action-issue-alert">
                <AlertTriangle />
                警報発令
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>警報を発令しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                これは最終確認です。エリアメール、防災無線、LINEへ通知が送信されます。この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction('警報発令')}>はい、発令します</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button onClick={() => handleAction('ドローン要請')} data-testid="action-request-drone">
          <Airplay />
          ドローン要請
        </Button>
        <Button variant="secondary" onClick={() => handleAction('詳細')} data-testid="action-details">
          <ExternalLink />
          詳細
        </Button>
      </div>
    </footer>
  );
}
