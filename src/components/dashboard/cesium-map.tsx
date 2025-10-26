
'use client';
import { useEffect, useRef } from 'react';
import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  UrlTemplateImageryProvider,
  Viewer,
  createWorldTerrainAsync,
  Cesium3DTileset,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  EllipsoidTerrainProvider,
} from 'cesium';

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (cesiumContainer.current && !viewerRef.current) {
        Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';

        const setupViewer = async () => {
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
                    infoBox: true, // Enable InfoBox for attribute display
                    sceneModePicker: false,
                    selectionIndicator: false,
                    timeline: false,
                    navigationHelpButton: false,
                });

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

                const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction((movement: any) => {
                    const pickedObject = viewer.scene.pick(movement.position);
                    if (defined(pickedObject) && defined(pickedObject.getPropertyNames)) {
                        const propertyNames = pickedObject.getPropertyNames();
                        let description = '<table class="cesium-infoBox-defaultTable"><tbody>';
                        for (let i = 0; i < propertyNames.length; i++) {
                            const name = propertyNames[i];
                            description += `<tr><th>${name}</th><td>${pickedObject.getProperty(name)}</td></tr>`;
                        }
                        description += '</tbody></table>';
                        
                        if (viewer.infoBox) {
                           viewer.infoBox.viewModel.title = pickedObject.getProperty('gml_id') || 'Building Attributes';
                           viewer.infoBox.viewModel.description = description;
                        }
                    }
                }, ScreenSpaceEventType.LEFT_CLICK);

                viewerRef.current = viewer;

            } catch (error) {
                console.error(`Error setting up Cesium viewer: ${error}`);
            }
        };
        
        setupViewer();
    }

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={cesiumContainer} className='h-full w-full rounded-lg overflow-hidden shadow-md' />;
}

export default CesiumMap;
