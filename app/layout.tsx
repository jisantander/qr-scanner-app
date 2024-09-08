import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import StylesWrapper from './StylesWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Escáner de Código QR',
  description: 'Una aplicación profesional para escanear códigos QR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <StylesWrapper />
        {children}
      </body>
    </html>
  )
}