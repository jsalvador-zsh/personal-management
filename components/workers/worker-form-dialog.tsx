"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { workerSchema, type WorkerFormData } from "@/lib/validations/worker"
import type { Worker, Company } from "@/types"

interface WorkerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: WorkerFormData) => Promise<void>
  worker?: Worker | null
  companies: Company[]
  isLoading?: boolean
}

export function WorkerFormDialog({
  open,
  onOpenChange,
  onSubmit,
  worker,
  companies,
  isLoading = false,
}: WorkerFormDialogProps) {
  const isEditing = !!worker

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      dni: "",
      full_name: "",
      phone: "",
      email: "",
      position: "",
      company_id: null,
      status: "habilitado",
      photo_url: "",
      // Información Personal
      pais: "",
      sexo: null,
      estado_civil: null,
      fecha_nacimiento: "",
      correo_personal: "",
      domicilio: "",
      telefono_fijo: "",
      // Información Profesional
      carrera_profesional: "",
      fecha_inicio: "",
      fecha_cese: "",
      sitio: "",
      area: "",
      local: "",
      condiciones_trabajo: "",
    },
  })

  const status = watch("status")
  const company_id = watch("company_id")
  const sexo = watch("sexo")
  const estado_civil = watch("estado_civil")

  useEffect(() => {
    if (worker) {
      reset({
        dni: worker.dni,
        full_name: worker.full_name,
        phone: worker.phone || "",
        email: worker.email || "",
        position: worker.position || "",
        company_id: worker.company_id || null,
        status: worker.status,
        photo_url: worker.photo_url || "",
        // Información Personal
        pais: worker.pais || "",
        sexo: worker.sexo as any || null,
        estado_civil: worker.estado_civil as any || null,
        fecha_nacimiento: worker.fecha_nacimiento || "",
        correo_personal: worker.correo_personal || "",
        domicilio: worker.domicilio || "",
        telefono_fijo: worker.telefono_fijo || "",
        // Información Profesional
        carrera_profesional: worker.carrera_profesional || "",
        fecha_inicio: worker.fecha_inicio || "",
        fecha_cese: worker.fecha_cese || "",
        sitio: worker.sitio || "",
        area: worker.area || "",
        local: worker.local || "",
        condiciones_trabajo: worker.condiciones_trabajo || "",
      })
    } else {
      reset({
        dni: "",
        full_name: "",
        phone: "",
        email: "",
        position: "",
        company_id: null,
        status: "habilitado",
        photo_url: "",
        pais: "",
        sexo: null,
        estado_civil: null,
        fecha_nacimiento: "",
        correo_personal: "",
        domicilio: "",
        telefono_fijo: "",
        carrera_profesional: "",
        fecha_inicio: "",
        fecha_cese: "",
        sitio: "",
        area: "",
        local: "",
        condiciones_trabajo: "",
      })
    }
  }, [worker, reset])

  const handleFormSubmit = async (data: WorkerFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Trabajador" : "Nuevo Trabajador"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del trabajador"
              : "Completa el formulario para registrar un nuevo trabajador"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Información Básica</TabsTrigger>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="profesional">Información Profesional</TabsTrigger>
            </TabsList>

            {/* TAB 1: Información Básica */}
            <TabsContent value="basico" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* DNI */}
                <div className="space-y-2">
                  <Label htmlFor="dni">
                    DNI <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="dni"
                    {...register("dni")}
                    placeholder="12345678"
                    disabled={isLoading}
                  />
                  {errors.dni && (
                    <p className="text-sm text-error">{errors.dni.message}</p>
                  )}
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    Nombre Completo <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    {...register("full_name")}
                    placeholder="Juan Pérez García"
                    disabled={isLoading}
                  />
                  {errors.full_name && (
                    <p className="text-sm text-error">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+51 999 999 999"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-error">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="trabajador@empresa.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-error">{errors.email.message}</p>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    {...register("position")}
                    placeholder="Operador de Equipo Pesado"
                    disabled={isLoading}
                  />
                  {errors.position && (
                    <p className="text-sm text-error">{errors.position.message}</p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company_id">Empresa</Label>
                  <Select
                    value={company_id || "none"}
                    onValueChange={(value) => setValue("company_id", value === "none" ? null : value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.company_id && (
                    <p className="text-sm text-error">{errors.company_id.message}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Estado <span className="text-error">*</span>
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value: "habilitado" | "inhabilitado") =>
                      setValue("status", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="habilitado">Habilitado</SelectItem>
                      <SelectItem value="inhabilitado">Inhabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-error">{errors.status.message}</p>
                  )}
                </div>

                {/* Photo URL */}
                <div className="space-y-2">
                  <Label htmlFor="photo_url">URL de Foto (opcional)</Label>
                  <Input
                    id="photo_url"
                    {...register("photo_url")}
                    placeholder="https://ejemplo.com/foto.jpg"
                    disabled={isLoading}
                  />
                  {errors.photo_url && (
                    <p className="text-sm text-error">{errors.photo_url.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Información Personal */}
            <TabsContent value="personal" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* País */}
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    {...register("pais")}
                    placeholder="Perú"
                    disabled={isLoading}
                  />
                  {errors.pais && (
                    <p className="text-sm text-error">{errors.pais.message}</p>
                  )}
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={sexo || "none"}
                    onValueChange={(value) => setValue("sexo", value === "none" ? null : value as any)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin especificar</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sexo && (
                    <p className="text-sm text-error">{errors.sexo.message}</p>
                  )}
                </div>

                {/* Estado Civil */}
                <div className="space-y-2">
                  <Label htmlFor="estado_civil">Estado Civil</Label>
                  <Select
                    value={estado_civil || "none"}
                    onValueChange={(value) => setValue("estado_civil", value === "none" ? null : value as any)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin especificar</SelectItem>
                      <SelectItem value="Soltero">Soltero</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viudo">Viudo</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estado_civil && (
                    <p className="text-sm text-error">{errors.estado_civil.message}</p>
                  )}
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    {...register("fecha_nacimiento")}
                    disabled={isLoading}
                  />
                  {errors.fecha_nacimiento && (
                    <p className="text-sm text-error">{errors.fecha_nacimiento.message}</p>
                  )}
                </div>

                {/* Correo Personal */}
                <div className="space-y-2">
                  <Label htmlFor="correo_personal">Email Personal</Label>
                  <Input
                    id="correo_personal"
                    type="email"
                    {...register("correo_personal")}
                    placeholder="personal@ejemplo.com"
                    disabled={isLoading}
                  />
                  {errors.correo_personal && (
                    <p className="text-sm text-error">{errors.correo_personal.message}</p>
                  )}
                </div>

                {/* Teléfono Fijo */}
                <div className="space-y-2">
                  <Label htmlFor="telefono_fijo">Teléfono Fijo</Label>
                  <Input
                    id="telefono_fijo"
                    {...register("telefono_fijo")}
                    placeholder="01 1234567"
                    disabled={isLoading}
                  />
                  {errors.telefono_fijo && (
                    <p className="text-sm text-error">{errors.telefono_fijo.message}</p>
                  )}
                </div>

                {/* Domicilio */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="domicilio">Domicilio</Label>
                  <Textarea
                    id="domicilio"
                    {...register("domicilio")}
                    placeholder="Av. Principal 123, Distrito, Ciudad"
                    disabled={isLoading}
                    rows={2}
                  />
                  {errors.domicilio && (
                    <p className="text-sm text-error">{errors.domicilio.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Información Profesional */}
            <TabsContent value="profesional" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Carrera Profesional */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="carrera_profesional">Carrera Profesional</Label>
                  <Input
                    id="carrera_profesional"
                    {...register("carrera_profesional")}
                    placeholder="Ingeniería de Minas"
                    disabled={isLoading}
                  />
                  {errors.carrera_profesional && (
                    <p className="text-sm text-error">{errors.carrera_profesional.message}</p>
                  )}
                </div>

                {/* Fecha de Inicio */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    {...register("fecha_inicio")}
                    disabled={isLoading}
                  />
                  {errors.fecha_inicio && (
                    <p className="text-sm text-error">{errors.fecha_inicio.message}</p>
                  )}
                </div>

                {/* Fecha de Cese */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_cese">Fecha de Cese</Label>
                  <Input
                    id="fecha_cese"
                    type="date"
                    {...register("fecha_cese")}
                    disabled={isLoading}
                  />
                  {errors.fecha_cese && (
                    <p className="text-sm text-error">{errors.fecha_cese.message}</p>
                  )}
                </div>

                {/* Sitio */}
                <div className="space-y-2">
                  <Label htmlFor="sitio">Sitio</Label>
                  <Input
                    id="sitio"
                    {...register("sitio")}
                    placeholder="Mina Toquepala"
                    disabled={isLoading}
                  />
                  {errors.sitio && (
                    <p className="text-sm text-error">{errors.sitio.message}</p>
                  )}
                </div>

                {/* Área */}
                <div className="space-y-2">
                  <Label htmlFor="area">Área</Label>
                  <Input
                    id="area"
                    {...register("area")}
                    placeholder="Operaciones"
                    disabled={isLoading}
                  />
                  {errors.area && (
                    <p className="text-sm text-error">{errors.area.message}</p>
                  )}
                </div>

                {/* Local */}
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    {...register("local")}
                    placeholder="Sede Principal"
                    disabled={isLoading}
                  />
                  {errors.local && (
                    <p className="text-sm text-error">{errors.local.message}</p>
                  )}
                </div>

                {/* Condiciones de Trabajo */}
                <div className="space-y-2">
                  <Label htmlFor="condiciones_trabajo">Condiciones de Trabajo</Label>
                  <Input
                    id="condiciones_trabajo"
                    {...register("condiciones_trabajo")}
                    placeholder="Plazo Indefinido"
                    disabled={isLoading}
                  />
                  {errors.condiciones_trabajo && (
                    <p className="text-sm text-error">{errors.condiciones_trabajo.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Trabajador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
