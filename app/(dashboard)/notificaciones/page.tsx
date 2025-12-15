"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellOff, Loader2, CheckCheck } from "lucide-react"
import { NotificationList } from "@/components/notifications/notification-list"
import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/types"
import { toast } from "sonner"

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const supabase = createClient()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Debes iniciar sesión para ver las notificaciones")
        return
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error: any) {
      console.error("Error fetching notifications:", error)
      toast.error("Error al cargar las notificaciones")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(true)
    try {
      const { error } = await (supabase
        .from("notifications") as any)
        .update({ read: true })
        .eq("id", id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      toast.success("Notificación marcada como leída")
    } catch (error: any) {
      console.error("Error marking notification as read:", error)
      toast.error("Error al actualizar la notificación")
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkAsUnread = async (id: string) => {
    setActionLoading(true)
    try {
      const { error } = await (supabase
        .from("notifications") as any)
        .update({ read: false })
        .eq("id", id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      )
      toast.success("Notificación marcada como no leída")
    } catch (error: any) {
      console.error("Error marking notification as unread:", error)
      toast.error("Error al actualizar la notificación")
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    setActionLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await (supabase
        .from("notifications") as any)
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success("Todas las notificaciones marcadas como leídas")
    } catch (error: any) {
      console.error("Error marking all as read:", error)
      toast.error("Error al actualizar las notificaciones")
    } finally {
      setActionLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground mt-1">
            Centro de alertas y notificaciones del sistema
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} disabled={actionLoading} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notificaciones totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
            <Bell className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Pendientes de revisar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leídas</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readNotifications.length}</div>
            <p className="text-xs text-muted-foreground">Ya revisadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            Todas
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {notifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            No Leídas
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-2">
            Leídas
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {readNotifications.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
          />
        </TabsContent>

        <TabsContent value="unread">
          <NotificationList
            notifications={unreadNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
          />
        </TabsContent>

        <TabsContent value="read">
          <NotificationList
            notifications={readNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
