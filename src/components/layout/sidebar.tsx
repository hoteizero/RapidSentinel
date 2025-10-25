
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Siren,
  RadioTower,
  Settings,
  Shield,
  LifeBuoy,
  Book,
  BrainCircuit,
  Server,
  BookText,
  FlaskConical,
  BarChart,
  Airplay,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード', testId: 'nav-dashboard' },
  { href: '/xai', icon: BrainCircuit, label: 'AI判断根拠', testId: 'nav-xai' },
  { href: '/analysis', icon: BarChart, label: '分析', testId: 'nav-analysis' },
  { href: '/simulation', icon: FlaskConical, label: 'シミュレーション', testId: 'nav-simulation' },
  { href: '/alerts', icon: Siren, label: '警報', testId: 'nav-alerts' },
  { href: '/sensors', icon: RadioTower, label: 'センサー', testId: 'nav-sensors' },
  { href: '/drones', icon: Airplay, label: 'ドローン・フリート', testId: 'nav-drones' },
  { href: '/status', icon: Server, label: 'システム状態', testId: 'nav-status' },
  { href: '/reports', icon: BookText, label: 'レポート', testId: 'nav-reports' },
  { href: '/settings', icon: Settings, label: '設定', testId: 'nav-settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5" prefetch={false} data-testid="nav-logo">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline tracking-tight group-data-[collapsible=icon]:hidden">
            RapidSense
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                  data-testid={item.testId}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: 'ドキュメンテーション' }} data-testid="nav-docs">
                    <Book/>
                    <span>ドキュメンテーション</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: 'サポート' }} data-testid="nav-support">
                    <LifeBuoy/>
                    <span>サポート</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
