// components/CesiumViewer.tsx
'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as Cesium from 'cesium';

// Cesium CSS（Vite/Next ではビルド時にコピー必要）
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Ion トークン（必須。https://cesium.com/ion/ で無料取得）
Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || 'your-default-token-here';

const CesiumViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      viewerRef.current = new Cesium.Viewer(containerRef.current, {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        requestRenderMode: true, // 必須：無駄なレンダリングを防ぐ
        // scene3DOnly: true, // 2D/Columbus モード無効化（安定性↑）
      });

      // 初期カメラ位置（undefined 防止）
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 15000),
      });

      // クレジット非表示（任意）
      const creditContainer = viewerRef.current.cesiumWidget.creditContainer as HTMLElement;
      if (creditContainer) creditContainer.style.display = 'none';

    } catch (err) {
      console.error('Cesium Viewer 初期化失敗:', err);
    }

    // クリーンアップ
    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

// SSR 無効化
export default dynamic(() => Promise.resolve(CesiumViewer), { ssr: false });