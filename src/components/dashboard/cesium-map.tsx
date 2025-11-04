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
  // 以下のインポートは元のコードから削除されていますが、必要に応じて残してください。
  // Cesium3DTileset,
  // ScreenSpaceEventHandler,
  // ScreenSpaceEventType,
  // defined,
} from 'cesium';

// Set the base URL for Cesium assets
// この設定はNext.jsのクライアントサイドでのみ実行されるように、typeof window !== 'undefined' のチェックを維持します。
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/static/cesium/';
}

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    // 既にViewerが作成されていれば何もしない
    if (viewerRef.current) {
      return;
    }
    
    // 💡 修正点 1: Ion.defaultAccessToken は Viewer インスタンス化前に設定する必要があります
    // 警告を避けるため、Viewer作成前にトークンを設定します。
    Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';

    if (cesiumContainer.current && !viewerRef.current) {
      
      const setupViewer = async () => {
        // 既にViewerが作成されているか、コンテナがない場合は処理を中断
        if (!cesiumContainer.current || viewerRef.current) return;
        
        try {
          const viewer = new Viewer(cesiumContainer.current!, {
            terrainProvider: new EllipsoidTerrainProvider(),
            imageryProvider: new UrlTemplateImageryProvider({
              url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
              credit: "地理院地図",
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

          // 💡 修正点 2: 参照を保存
          viewerRef.current = viewer;

          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(139.767, 35.681, 15000),
            orientation: {
              heading: CesiumMath.toRadians(0.0),
              pitch: CesiumMath.toRadians(-90.0),
            }
          });

          const tileset = await Cesium3DTileset.fromUrl(
            "https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo23-ku_2022/13101_chiyoda-ku/low_resolution/tileset.json",
            {
              skipLevelOfDetail: true,
              baseScreenSpaceError: 1024,
              maximumScreenSpaceError: 32,
            }
          );
          viewer.scene.primitives.add(tileset);
          
          // 💡 修正点 3: Viewerが既に破棄されている可能性のチェック
          if (viewer.isDestroyed()) return;

          const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
          handler.setInputAction((movement: any) => {
            const pickedObject = viewer.scene.pick(movement.position);
            
            // 💡 修正点 4: pickedObjectの型チェックを強化
            if (defined(pickedObject) && pickedObject.getPropertyNames) { 
                const propertyNames = pickedObject.getPropertyNames();
                let description = '<table class="cesium-infoBox-defaultTable"><tbody>';
                for (let i = 0; i < propertyNames.length; i++) {
                    const name = propertyNames[i];
                    description += `<tr><th>${name}</th><td>${pickedObject.getProperty(name)}</td></tr>`;
                }
                description += '</tbody></table>';
                
                if (viewer.infoBox) {
                    // gml_id が存在しない場合に備えてフォールバックを追加
                    viewer.infoBox.viewModel.title = pickedObject.getProperty('gml_id') || 'Building Attributes';
                    viewer.infoBox.viewModel.description = description;
                }
            } else if (viewer.infoBox) {
                // オブジェクトがピックされなかった場合はInfoBoxをクリア
                viewer.infoBox.viewModel.titleText = '';
                viewer.infoBox.viewModel.description = '';
            }
          }, ScreenSpaceEventType.LEFT_CLICK);
          
          // クリーンアップ関数でハンドラーを破棄できるように参照を保存することも検討できます
          // handlerRef.current = handler;

        } catch (error) {
          console.error(`Error setting up Cesium viewer: ${error}`);
        }
      };
      
      setupViewer();
    }

    return () => {
      // クリーンアップ：Viewerが破棄されていないことを確認して破棄
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        // 必要に応じてScreenSpaceEventHandlerもここで破棄
        // if (handlerRef.current && !handlerRef.current.isDestroyed()) { handlerRef.current.destroy(); }
      }
    };
  }, []); // 依存配列は空で、コンポーネントマウント時に一度だけ実行

  return <div ref={cesiumContainer} className='h-full w-full rounded-lg overflow-hidden shadow-md' />;
}

export default CesiumMap;