'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, Settings, User, Radio, Wifi, Satellite } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function Header() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time ? format(time, 'yyyy年M月d日 HH:mm:ss', { locale: ja }) : '--年--月--日 --:--:--';

  return (
    <header className="sticky top-0 z-10 flex h-[8vh] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shrink-0">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex-1 flex items-center gap-4">
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">通常</span>
        </div>
        <h2 className="text-lg font-semibold hidden md:block">災害監視ダッシュボード｜市区町村サンプル｜{formattedTime}</h2>
      </div>

      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
         <div className='flex items-center gap-2'><Radio className='size-4 text-green-500'/> LoRa: 98%</div>
         <div className='flex items-center gap-2'><Wifi className='size-4 text-green-500'/> 5G: OK</div>
         <div className='flex items-center gap-2'><Satellite className='size-4 text-gray-500'/> 衛星: 待機</div>
      </div>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">防災担当者</p>
              <p className="text-xs leading-none text-muted-foreground">
                manager@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2" />
            プロフィール
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2" />
            設定
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2" />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
