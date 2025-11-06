'use client';

import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

// Cesium CSS
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Cesium Ion Token
if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
    Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
} else {
    console.warn("Cesium Ion token is not set. Some features may not work.");
}


const CesiumMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) {
        return;
    }

    let viewer: Cesium.Viewer;

    const initializeViewer = async () => {
        try {
            if (!containerRef.current) return;
            
            const terrainProvider = await Cesium.createWorldTerrainAsync({
                requestWaterMask: true,
                requestVertexNormals: true
            });

            viewer = new Cesium.Viewer(containerRef.current, {
                terrainProvider: terrainProvider,
                imageryProvider: false, // Start with no base layer
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                selectionIndicator: true,
                timeline: false,
                navigationHelpButton: false,
                requestRenderMode: true,
                scene3DOnly: true,
            });
            
            viewerRef.current = viewer;

            // Add base imagery layer
            viewer.imageryLayers.addImageryProvider(
                new Cesium.UrlTemplateImageryProvider({
                    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
                    credit: new Cesium.Credit('地理院タイル'),
                })
            );

            // Add 3D Tileset
            try {
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    'https://assets.cms.plateau.reearth.io/assets/11/b058a9-6b58-4879-99ce-4272e15330a3/13100_tokyo23-ku_2023/13101_chiyoda-ku/low_resolution/tileset.json', 
                    { skipLevelOfDetail: true }
                );
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.error('Failed to load 3D tileset:', error);
            }

            // Set initial camera view
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 5000), // Tokyo Station
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-45.0),
                },
            });
            
            // InfoBox handling
            const infoBox = viewer.infoBox;
            if (infoBox?.viewModel) {
                infoBox.viewModel.maxHeight = 300;
            }

            viewer.screenSpaceEventHandler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const pickedObject = viewer.scene.pick(movement.position);
                if (Cesium.defined(pickedObject) && pickedObject instanceof Cesium.Cesium3DTileFeature) {
                    const feature = pickedObject as Cesium.Cesium3DTileFeature;
                    let description = '<h4>建物情報</h4><table class="cesium-infoBox-defaultTable"><tbody>';
                    feature.getPropertyIds().forEach(name => {
                        const value = feature.getProperty(name);
                         description += `<tr><th>${name}</th><td>${value}</td></tr>`;
                    });
                    description += '</tbody></table>';
                    
                    if (viewer.infoBox) {
                        (viewer.infoBox.viewModel as any).description = description;
                    }

                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


        } catch (error) {
            console.error('Cesium Viewer initialization failed:', error);
        }
    };

    initializeViewer();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default CesiumMap;