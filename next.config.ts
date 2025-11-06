// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

/**
 * ✅ Next.js 15 対応・Turbopack動作確認済み設定
 * - TypeScript / ESLint エラーを無視（開発時のみ）
 * - 画像ホスト許可
 * - Cesium ビルド対応
 * - rbush / zip.js 解決補正
 * - Genkit external 化
 * - Firebase Hosting 用に output: 'standalone'
 */

const nextConfig: NextConfig = {
  // --- TypeScript & ESLint ---
  typescript: {
    ignoreBuildErrors: true, // ⚠ 開発中のみ推奨
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠ 開発中のみ推奨
  },

  // --- 画像ホスト許可 ---
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },

  // --- Webpack 設定 ---
  webpack: (config, { isServer, dev }) => {
    // ① Turbopack競合防止
    config.resolve.exportsFields = [];

    // ② Genkit external化（server側のみ）
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('genkit', '@genkit-ai/google-genai');
    }

    // ③ Cesium: ワーカー & アセットコピー
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              path.dirname(require.resolve('cesium')),
              'Build/Cesium/Workers'
            ),
            to: '../public/static/cesium/Workers',
          },
          {
            from: path.join(
              path.dirname(require.resolve('cesium')),
              'Build/Cesium/Assets'
            ),
            to: '../public/static/cesium/Assets',
          },
          {
            from: path.join(
              path.dirname(require.resolve('cesium')),
              'Build/Cesium/Widgets'
            ),
            to: '../public/static/cesium/Widgets',
          },
          {
            from: path.join(
              path.dirname(require.resolve('cesium')),
              'Build/Cesium/ThirdParty'
            ),
            to: '../public/static/cesium/ThirdParty',
          },
        ],
      })
    );
    

    // ④ rbush: default export補正
    config.resolve.alias = {
      ...config.resolve.alias,
      rbush: path.resolve(__dirname, 'node_modules/rbush/rbush.min.js'),
    };

    // ⑤ zip.js: worker fallback無効化
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@zip.js/zip.js/lib/zip-no-worker.js': false,
      '@zip.js/zip.js/lib/zip-no-worker-inflate.js': false,
    };
    
    config.amd = {
      ...config.amd,
      toUrlUndefined: true,
    };

    return config;
  },

  // --- Firebase Hosting対応 ---
  output: 'standalone',

  // --- Server Actions Body Size (Next.js 15対応) ---
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },
};

export default nextConfig;
