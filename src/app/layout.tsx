import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'RapidSense',
  description: '高速分散AI 災害アラートシステム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
         <style>{`
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}</style>
      </head>
      <body className={cn('font-body antialiased min-h-screen')}>
        {children}
        <Toaster />
        <script
            dangerouslySetInnerHTML={{
              __html: `
                window.difyChatbotConfig = {
                  token: '9cnnEESIrd9mOQb8',
                  inputs: {},
                  systemVariables: {},
                  userVariables: {},
                }
              `,
            }}
          />
        <script
          src="https://udify.app/embed.min.js"
          id="9cnnEESIrd9mOQb8"
          defer>
        </script>
      </body>
    </html>
  );
}
