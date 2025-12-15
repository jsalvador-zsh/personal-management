"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, BellOff, Check, AlertCircle, Info } from "lucide-react"
import type { Notification } from "@/types"

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAsUnread: (id: string) => void
  loading?: boolean
}

const typeIcons = {
  certificacion_vencida: AlertCircle,
  nueva_evaluacion: Info,
  otro: Bell,
}

const typeLabels = {
  certificacion_vencida: "Certificación Vencida",
  nueva_evaluacion: "Nueva Evaluación",
  otro: "Otra",
}

const typeColors = {
  certificacion_vencida: "error",
  nueva_evaluacion: "info",
  otro: "secondary",
} as const

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  loading = false,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="rounded-full bg-muted p-6">
            <BellOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No hay notificaciones</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Cuando tengas nuevas notificaciones aparecerán aquí
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const TypeIcon = typeIcons[notification.type]
        const typeLabel = typeLabels[notification.type]
        const typeColor = typeColors[notification.type]

        return (
          <Card
            key={notification.id}
            className={`p-4 transition-colors ${
              !notification.read ? "bg-brand/5 border-brand/20" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  !notification.read ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
                }`}
              >
                <TypeIcon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={typeColor}>{typeLabel}</Badge>
                  {!notification.read && (
                    <Badge className="text-xs">
                      Nueva
                    </Badge>
                  )}
                </div>

                <p className="text-sm leading-relaxed">{notification.message}</p>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString("es-PE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-3 w-3" />
                      Marcar como leída
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => onMarkAsUnread(notification.id)}
                    >
                      <Bell className="h-3 w-3" />
                      Marcar como no leída
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
