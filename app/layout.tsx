import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orange Snap',
  description: '简洁实用的截图美化工具，让截图变得更美✨'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
