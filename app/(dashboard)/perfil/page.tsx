"use client"

import { useState } from "react"
import { useUser } from "@/hooks/use-user"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Database } from "@/types/database"
import {
  User,
  Mail,
  Calendar,
  Shield,
  Key,
  Edit,
  Loader2,
} from "lucide-react"

export default function PerfilPage() {
  const { profile } = useUser()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleOpenEditDialog = () => {
    setFullName(profile?.full_name || "")
    setIsEditDialogOpen(true)
  }

  const handleUpdateProfile = async () => {
    if (!profile || !fullName.trim()) {
      toast.error("Por favor ingresa un nombre válido")
      return
    }

    setIsUpdating(true)
    const supabase = createClient()

    try {
      // Using type assertion to bypass Supabase type inference issue
      const { error } = await (supabase as any)
        .from("users")
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("Perfil actualizado correctamente")
      setIsEditDialogOpen(false)

      // Refresh the page to get updated data
      setTimeout(() => window.location.reload(), 500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
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
        return 'Recursos Humanos'
      case 'medico':
        return 'Médico'
      case 'supervisor':
        return 'Supervisor'
      default:
        return 'Usuario'
    }
  }

  if (!profile) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Cargando perfil...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Datos de tu cuenta en el sistema
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenEditDialog}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-brand/10 flex items-center justify-center">
              <User className="h-10 w-10 text-brand" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {profile.full_name || "Sin nombre"}
              </h3>
              <Badge variant={getRoleBadgeVariant(profile.role)} className="mt-1">
                {getRoleLabel(profile.role)}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Correo Electrónico</span>
              </div>
              <p className="font-medium">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Rol en el Sistema</span>
              </div>
              <p className="font-medium">{getRoleLabel(profile.role)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fecha de Registro</span>
              </div>
              <p className="font-medium">
                {new Date(profile.created_at).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>ID de Usuario</span>
              </div>
              <p className="font-mono text-xs break-all">{profile.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Administra la seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-muted-foreground/10 rounded-lg">
            <div>
              <h4 className="font-medium">Cambiar Contraseña</h4>
              <p className="text-sm text-muted-foreground">
                Actualiza tu contraseña regularmente para mantener tu cuenta segura
              </p>
            </div>
            <Button variant="outline">
              Cambiar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-muted-foreground/10 rounded-lg">
            <div>
              <h4 className="font-medium">Autenticación de Dos Factores</h4>
              <p className="text-sm text-muted-foreground">
                Añade una capa extra de seguridad a tu cuenta
              </p>
            </div>
            <Badge variant="secondary">Próximamente</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            El historial de actividad estará disponible próximamente
          </p>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información personal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ingresa tu nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El correo electrónico no puede ser modificado
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
