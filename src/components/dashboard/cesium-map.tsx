'use client';

import { useEffect, useRef } from 'react';
import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  UrlTemplateImageryProvider,
  Viewer,
  Cesium3DTileset,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  EllipsoidTerrainProvider,
  type ScreenSpaceEvent,
} from 'cesium';

// クライアントサイドでのみ実行
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/static/cesium/';
}

export function CesiumMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null);

  useEffect(() => {
    if (viewerRef.current || !containerRef.current) return;

    const initViewer = async () => {
      try {
        // 1. Ion トークン
        Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN ?? '';

        // 2. Viewer 作成（imageryProvider → baseLayer に変更）
        const viewer = new Viewer(containerRef.current!, {
          terrainProvider: new EllipsoidTerrainProvider(),
          // ← ここが正しい書き方
          baseLayer: new UrlTemplateImageryProvider({
            url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
            credit: '地理院地図',
          }),

          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: true,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
        });

        viewerRef.current = viewer;

        // 3. カメラ初期位置
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(139.767, 35.681, 15000),
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-90),
          },
        });

        // 4. 最新 PLATEAU 3D Tileset（2023/2024 版）
        let tileset: Cesium3DTileset | null = null;
        try {
          tileset = await Cesium3DTileset.fromUrl(
            // 2023 年版 low_resolution（2022 は削除済み）
            'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13101_chiyoda-ku/low_resolution/tileset.json',
            {
              skipLevelOfDetail: true,
              baseScreenSpaceError: 1024,
              maximumScreenSpaceError: 32,
            }
          );

          if (!viewer.isDestroyed()) {
            viewer.scene.primitives.add(tileset);
            console.info('PLATEAU 3D Tileset 読み込み成功');
          }
        } catch (e) {
          console.warn('PLATEAU Tileset 読み込み失敗（URL が無効かも）:', e);
          // 失敗しても Viewer は表示し続ける
        }

        // 5. クリックハンドラー（型付き + update 削除）
        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerRef.current = handler;

        handler.setInputAction((movement: ScreenSpaceEvent) => {
          // Tileset が無い場合は何もしない
          if (!tileset) return;

          const picked = viewer.scene.pick(movement.position);
          const infoBox = viewer.infoBox?.viewModel;

          if (defined(picked) && picked.id?.properties) {
            const props = picked.id.properties;
            const names = props.propertyNames;

            let html = '<table class="cesium-infoBox-defaultTable"><tbody>';
            for (const name of names) {
              const value = props.getValue(name);
              html += `<tr><th>${name}</th><td>${value ?? '—'}</td></tr>`;
            }
            html += '</tbody></table>';

            if (infoBox) {
              infoBox.title = props.getValue('gml_id') ?? 'Building';
              infoBox.description = html;
            }
          } else if (infoBox) {
            infoBox.title = '';
            infoBox.description = '';
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      } catch (err) {
        console.error('Cesium Viewer 初期化失敗:', err);
      }
    };

    initViewer();

    // クリーンアップ
    return () => {
      handlerRef.current?.destroy();
      handlerRef.current = null;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-lg overflow-hidden shadow-md"
      style={{ minHeight: '400px' }}
    />
  );
}

export default CesiumMap;
