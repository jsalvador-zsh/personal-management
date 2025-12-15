"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, UserCog, ShieldAlert, Loader2, Mail, Calendar } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

export default function UsuariosPage() {
  const { user: currentUser, loading: userLoading, isAdmin } = useCurrentUser()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && isAdmin) {
      fetchUsers()
    } else if (!userLoading) {
      setLoading(false)
    }
  }, [userLoading, isAdmin])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="p-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-error-light/10 flex items-center justify-center">
                <ShieldAlert className="h-8 w-8 text-error" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Acceso Denegado</h3>
                <p className="text-muted-foreground">
                  No tienes permisos para acceder a esta sección.
                  <br />
                  Solo los administradores pueden gestionar usuarios del sistema.
                </p>
              </div>
              <div className="pt-4">
                <Badge variant="error">
                  Tu rol: {currentUser?.role || "Sin rol asignado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin view - show users list
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Lista de Usuarios ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay usuarios registrados
            </p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-muted-foreground/10 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">
                        {user.full_name || "Sin nombre"}
                      </h4>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Registrado: {new Date(user.created_at).toLocaleDateString("es-PE")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
