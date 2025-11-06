// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Cesium のアセット（Workers, Assets, Widgets）を正しく静的ファイルとして扱う
    config.module.rules.push({
      test: /cesium[\/\\]Build[\/\\]Cesium[\/\\].*\.(js|css|json|png|jpg|svg|woff|woff2|eot|ttf|bin)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/cesium/[path][name].[hash][ext]',
      },
    });

    // 一般的なアセット（画像、フォント、WASMなど）
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|bin|wasm)$/,
      type: 'asset/resource',
    });

    // Cesium のエイリアス設定（型定義の重複やパス解決を安定化）
    config.resolve.alias = {
      ...config.resolve.alias,
      cesium: path.resolve(__dirname, 'node_modules/cesium/Source'),
    };

    // WebAssembly ファイル名のカスタマイズ（ハッシュ衝突回避）
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';

    return config;
  },

  // Cesium をトランスパイル対象に追加（ES6+ コードを Next.js が処理できるように）
  transpilePackages: ['cesium'],

  // 実験的機能：ESM 外部モジュールの緩和（Cesium の動的インポート対応）
  experimental: {
    esmExternals: 'loose',
  },

  // 開発時の Fast Refresh でのエラー抑制（オプション）
  // onDemandEntries: {
  //   maxInactiveAge: 1000 * 60 * 60,
  //   pagesBufferLength: 50,
  // },
};

module.exports = nextConfig;