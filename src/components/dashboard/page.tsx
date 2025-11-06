// app/dashboard/page.tsx
import CesiumViewer from '@/components/CesiumViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cesium Dashboard',
};

export default function DashboardPage() {
  return (
    <main style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <CesiumViewer />
    </main>
  );
}