"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Loader2 } from "lucide-react"
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, loading, profile } = useUser()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={profile.role} />
      <div className="pl-64">
        <Header user={profile} />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
