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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basico">Información Básica</TabsTrigger>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="profesional">Información Profesional</TabsTrigger>
              <TabsTrigger value="homologacion">Homologación</TabsTrigger>
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

            {/* TAB 4: Homologación */}
            <TabsContent value="homologacion" className="space-y-6">
              <div className="space-y-6">
                {/* Estado y Tipo de Homologación */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="is_homologated">¿Está Homologado?</Label>
                    <Select
                      value={watch("is_homologated") ? "true" : "false"}
                      onValueChange={(value) => setValue("is_homologated", value === "true")}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Sí</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homologation_type">Tipo de Homologación</Label>
                    <Select
                      value={watch("homologation_type") || "none"}
                      onValueChange={(value) => setValue("homologation_type", value === "none" ? null : value as any)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin tipo</SelectItem>
                        <SelectItem value="medica">Médica</SelectItem>
                        <SelectItem value="ocupacional">Ocupacional</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="tecnica">Técnica</SelectItem>
                        <SelectItem value="especial">Especial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homologation_status">Estado</Label>
                    <Select
                      value={watch("homologation_status") || "pendiente"}
                      onValueChange={(value) => setValue("homologation_status", value as any)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="vigente">Vigente</SelectItem>
                        <SelectItem value="vencida">Vencida</SelectItem>
                        <SelectItem value="suspendida">Suspendida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fechas y Entidad */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="homologation_date">Fecha de Emisión</Label>
                    <Input
                      id="homologation_date"
                      type="date"
                      {...register("homologation_date")}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homologation_expiry">Fecha de Vencimiento</Label>
                    <Input
                      id="homologation_expiry"
                      type="date"
                      {...register("homologation_expiry")}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homologation_entity">Entidad Emisora</Label>
                    <Input
                      id="homologation_entity"
                      {...register("homologation_entity")}
                      placeholder="MINSA, SUNAFIL, etc."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Certificado y Documento */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="homologation_certificate_number">Número de Certificado</Label>
                    <Input
                      id="homologation_certificate_number"
                      {...register("homologation_certificate_number")}
                      placeholder="CERT-2024-12345"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homologation_document_url">URL del Documento</Label>
                    <Input
                      id="homologation_document_url"
                      {...register("homologation_document_url")}
                      placeholder="https://ejemplo.com/certificado.pdf"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Campos Condicionales según Tipo */}
                {watch("homologation_type") === "medica" && (
                  <div className="space-y-4 p-4 bg-info-light/10 border border-info-light rounded-lg">
                    <h4 className="font-semibold text-info flex items-center gap-2">
                      <span>🏥</span> Campos Específicos: Homologación Médica
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="blood_type">Tipo de Sangre</Label>
                        <Input
                          id="blood_type"
                          {...register("blood_type")}
                          placeholder="O+, A+, B+, AB+..."
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medical_restrictions">Restricciones Médicas</Label>
                        <Textarea
                          id="medical_restrictions"
                          {...register("medical_restrictions")}
                          placeholder="Ninguna / No puede trabajar en altura..."
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="medical_observations">Observaciones Médicas</Label>
                        <Textarea
                          id="medical_observations"
                          {...register("medical_observations")}
                          placeholder="Observaciones adicionales..."
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {watch("homologation_type") === "ocupacional" && (
                  <div className="space-y-4 p-4 bg-warning-light/10 border border-warning-light rounded-lg">
                    <h4 className="font-semibold text-warning flex items-center gap-2">
                      <span>👷</span> Campos Específicos: Homologación Ocupacional
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="occupational_level">Nivel Ocupacional</Label>
                        <Input
                          id="occupational_level"
                          {...register("occupational_level")}
                          placeholder="Operario, Técnico, Supervisor..."
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupational_specialization">Especialización</Label>
                        <Input
                          id="occupational_specialization"
                          {...register("occupational_specialization")}
                          placeholder="Electricidad, Mecánica..."
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {watch("homologation_type") === "seguridad" && (
                  <div className="space-y-4 p-4 bg-error-light/10 border border-error-light rounded-lg">
                    <h4 className="font-semibold text-error flex items-center gap-2">
                      <span>🛡️</span> Campos Específicos: Homologación de Seguridad
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="safety_training_hours">Horas de Entrenamiento</Label>
                        <Input
                          id="safety_training_hours"
                          type="number"
                          {...register("safety_training_hours", { valueAsNumber: true })}
                          placeholder="40"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="safety_certifications">Certificaciones de Seguridad</Label>
                        <Textarea
                          id="safety_certifications"
                          {...register("safety_certifications")}
                          placeholder="Ingrese certificaciones separadas por comas"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Ej: Trabajo en Altura, Espacios Confinados
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {watch("homologation_type") === "tecnica" && (
                  <div className="space-y-4 p-4 bg-success-light/10 border border-success-light rounded-lg">
                    <h4 className="font-semibold text-success flex items-center gap-2">
                      <span>🔧</span> Campos Específicos: Homologación Técnica
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="technical_skills">Habilidades Técnicas</Label>
                        <Textarea
                          id="technical_skills"
                          {...register("technical_skills")}
                          placeholder="Ingrese habilidades separadas por comas"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Ej: Soldadura TIG, Torneado CNC
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="technical_equipment_authorized">Equipos Autorizados</Label>
                        <Textarea
                          id="technical_equipment_authorized"
                          {...register("technical_equipment_authorized")}
                          placeholder="Ingrese equipos separados por comas"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Ej: Excavadora CAT 320, Grúa Liebherr LTM 1100
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {watch("homologation_type") === "especial" && (
                  <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: "#875A7B20", borderColor: "#875A7B" }}>
                    <h4 className="font-semibold flex items-center gap-2" style={{ color: "#875A7B" }}>
                      <span>⭐</span> Campos Específicos: Homologación Especial
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="special_authorization_number">Número de Autorización</Label>
                        <Input
                          id="special_authorization_number"
                          {...register("special_authorization_number")}
                          placeholder="AUTH-SPEC-2024-001"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="special_authorization_scope">Alcance de Autorización</Label>
                        <Textarea
                          id="special_authorization_scope"
                          {...register("special_authorization_scope")}
                          placeholder="Describir el alcance de la autorización especial..."
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="special_restrictions">Restricciones Especiales</Label>
                        <Textarea
                          id="special_restrictions"
                          {...register("special_restrictions")}
                          placeholder="Restricciones aplicables..."
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notas generales */}
                <div className="space-y-2">
                  <Label htmlFor="homologation_notes">Notas Adicionales</Label>
                  <Textarea
                    id="homologation_notes"
                    {...register("homologation_notes")}
                    placeholder="Notas u observaciones adicionales sobre la homologación..."
                    disabled={isLoading}
                    rows={3}
                  />
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
