
'use client';
import { useEffect, useRef } from 'react';
import {
  Cartesian3,
  createWorldTerrainAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  UrlTemplateImageryProvider,
  Viewer,
  Cesium3DTileset,
} from 'cesium';

export function CesiumMap() {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (cesiumContainer.current && !viewerRef.current) {
        Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';

        const viewer = new Viewer(cesiumContainer.current, {
            terrainProvider: new Terrain(Terrain.CesiumWorldTerrain),
            imageryProvider: new UrlTemplateImageryProvider({
                url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
                credit: "地理院地図",
            }),
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
        });

        // Fly to a custom position
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(139.767, 35.681, 15000),
            orientation: {
                heading: CesiumMath.toRadians(0.0),
                pitch: CesiumMath.toRadians(-90.0),
            }
        });

        // Add Plateau 3D Tiles
        const addTileset = async () => {
            try {
                const tileset = await Cesium3DTileset.fromUrl(
                    "https://plateau.geospatial.jp/main/data/3d-tiles/Tokyo_23ku/tileset.json"
                );
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.error(`Error loading tileset: ${error}`);
            }
        }

        addTileset();


        viewerRef.current = viewer;
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={cesiumContainer} className='h-full w-full rounded-lg overflow-hidden shadow-md' />;
}

export default CesiumMap;
