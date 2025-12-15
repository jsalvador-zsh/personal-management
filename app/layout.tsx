import type { Metadata } from "next"
import { circularStd } from "@/lib/fonts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Gestión de Personal",
  description: "Sistema de gestión de operaciones y asignación de personal para unidades mineras",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={circularStd.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
