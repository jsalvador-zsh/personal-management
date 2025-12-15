"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  User,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  Globe,
  Home,
  PhoneCall,
  GraduationCap,
  Clock,
  LogOut,
  Building,
  MapPinned,
  FileText,
} from "lucide-react"
import type { Worker, Company } from "@/types"

type WorkerWithCompany = Worker & {
  company?: Company | null
}

interface WorkerDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: WorkerWithCompany | null
}

export function WorkerDetailDialog({
  open,
  onOpenChange,
  worker,
}: WorkerDetailDialogProps) {
  if (!worker) return null

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const calculateWorkTime = (startDate: string | null) => {
    if (!startDate) return null
    const today = new Date()
    const start = new Date(startDate)
    const years = today.getFullYear() - start.getFullYear()
    const months = today.getMonth() - start.getMonth()
    const totalMonths = years * 12 + months

    if (totalMonths < 12) {
      return `${totalMonths} ${totalMonths === 1 ? 'mes' : 'meses'}`
    } else {
      const yrs = Math.floor(totalMonths / 12)
      const mths = totalMonths % 12
      return `${yrs} ${yrs === 1 ? 'año' : 'años'}${mths > 0 ? ` y ${mths} ${mths === 1 ? 'mes' : 'meses'}` : ''}`
    }
  }

  const age = calculateAge(worker.fecha_nacimiento)
  const workTime = calculateWorkTime(worker.fecha_inicio)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil del Trabajador</DialogTitle>
          <DialogDescription>
            Información completa del trabajador
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with photo */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {worker.photo_url ? (
                <img src={worker.photo_url} alt={worker.full_name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
                  <User className="h-10 w-10" />
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{worker.full_name}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                DNI: {worker.dni}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={worker.status === "habilitado" ? "success" : "secondary"}
                >
                  {worker.status === "habilitado" ? "Habilitado" : "Inhabilitado"}
                </Badge>
                {worker.position && (
                  <Badge variant="outline">{worker.position}</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs with detailed information */}
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Información Básica</TabsTrigger>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="profesional">Información Profesional</TabsTrigger>
            </TabsList>

            {/* TAB 1: Información Básica */}
            <TabsContent value="basico" className="space-y-4 mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Company */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Empresa
                  </div>
                  <p className="text-sm">
                    {worker.company?.name || (
                      <span className="italic text-muted-foreground">Sin asignar</span>
                    )}
                  </p>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    Cargo
                  </div>
                  <p className="text-sm">
                    {worker.position || (
                      <span className="italic text-muted-foreground">Sin cargo</span>
                    )}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Teléfono Móvil
                  </div>
                  <p className="text-sm">
                    {worker.phone || (
                      <span className="italic text-muted-foreground">No registrado</span>
                    )}
                  </p>
                </div>

                {/* Email Corporativo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email Corporativo
                  </div>
                  <p className="text-sm break-all">
                    {worker.email || (
                      <span className="italic text-muted-foreground">No registrado</span>
                    )}
                  </p>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Fecha de Registro
                  </div>
                  <p className="text-sm">
                    {new Date(worker.created_at).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Última Actualización
                  </div>
                  <p className="text-sm">
                    {new Date(worker.updated_at).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Información Personal */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* País */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    País
                  </div>
                  <p className="text-sm">
                    {worker.pais || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Sexo
                  </div>
                  <p className="text-sm">
                    {worker.sexo || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Estado Civil */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    Estado Civil
                  </div>
                  <p className="text-sm">
                    {worker.estado_civil || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Fecha de Nacimiento y Edad */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Fecha de Nacimiento
                  </div>
                  <p className="text-sm">
                    {worker.fecha_nacimiento ? (
                      <>
                        {new Date(worker.fecha_nacimiento).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {age && <span className="text-muted-foreground"> ({age} años)</span>}
                      </>
                    ) : (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Email Personal */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email Personal
                  </div>
                  <p className="text-sm break-all">
                    {worker.correo_personal || (
                      <span className="italic text-muted-foreground">No registrado</span>
                    )}
                  </p>
                </div>

                {/* Teléfono Fijo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <PhoneCall className="h-4 w-4" />
                    Teléfono Fijo
                  </div>
                  <p className="text-sm">
                    {worker.telefono_fijo || (
                      <span className="italic text-muted-foreground">No registrado</span>
                    )}
                  </p>
                </div>

                {/* Domicilio */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Home className="h-4 w-4" />
                    Domicilio
                  </div>
                  <p className="text-sm">
                    {worker.domicilio || (
                      <span className="italic text-muted-foreground">No registrado</span>
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Información Profesional */}
            <TabsContent value="profesional" className="space-y-4 mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Carrera Profesional */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Carrera Profesional
                  </div>
                  <p className="text-sm">
                    {worker.carrera_profesional || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Fecha de Inicio y Tiempo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Fecha de Inicio
                  </div>
                  <p className="text-sm">
                    {worker.fecha_inicio ? (
                      <>
                        {new Date(worker.fecha_inicio).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {workTime && (
                          <span className="block text-xs text-muted-foreground mt-1">
                            Tiempo laborando: {workTime}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Fecha de Cese */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Fecha de Cese
                  </div>
                  <p className="text-sm">
                    {worker.fecha_cese ? (
                      new Date(worker.fecha_cese).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <Badge variant="success" className="text-xs">Activo</Badge>
                    )}
                  </p>
                </div>

                {/* Sitio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Sitio
                  </div>
                  <p className="text-sm">
                    {worker.sitio || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Área */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building className="h-4 w-4" />
                    Área
                  </div>
                  <p className="text-sm">
                    {worker.area || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Local */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPinned className="h-4 w-4" />
                    Local
                  </div>
                  <p className="text-sm">
                    {worker.local || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>

                {/* Condiciones de Trabajo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Condiciones de Trabajo
                  </div>
                  <p className="text-sm">
                    {worker.condiciones_trabajo || (
                      <span className="italic text-muted-foreground">No especificado</span>
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
