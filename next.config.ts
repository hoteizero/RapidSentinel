
import type {NextConfig} from 'next';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '4.5mb',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
              to: path.join(config.context, 'public/static/cesium/Workers'),
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/ThirdParty'),
              to: path.join(config.context, 'public/static/cesium/ThirdParty'),
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Assets'),
              to: path.join(config.context, 'public/static/cesium/Assets'),
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'),
              to: path.join(config.context, 'public/static/cesium/Widgets'),
            },
          ],
        })
      );
    }
    config.resolve.exportsFields = [];
    return config;
  },
};

export default nextConfig;
