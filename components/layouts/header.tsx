"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { AppUser } from "@/types"

interface HeaderProps {
  user: AppUser
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const supabase = createClient()
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false)

        if (error) throw error
        setUnreadCount(count || 0)
      } catch (error) {
        console.error("Error fetching unread notifications:", error)
      }
    }

    fetchUnreadNotifications()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUnreadNotifications, 30000)

    return () => clearInterval(interval)
  }, [user.id])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'brand'
      case 'rrhh':
        return 'success'
      case 'medico':
        return 'info'
      case 'supervisor':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'rrhh':
        return 'RRHH'
      case 'medico':
        return 'Médico'
      case 'supervisor':
        return 'Supervisor'
      default:
        return 'Usuario'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 items-center justify-between">
        {/* Breadcrumb or title - can be enhanced later */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Panel de Control</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push('/notificaciones')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3">
                <Avatar className="h-8 w-8 bg-brand/10">
                  <div className="flex h-full w-full items-center justify-center text-brand">
                    <User className="h-4 w-4" />
                  </div>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium">
                    {user.full_name || user.email}
                  </span>
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="mt-0.5 h-4 px-1 text-xs"
                  >
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.full_name || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-error focus:text-error"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
