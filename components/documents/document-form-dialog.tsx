"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { documentSchema, type DocumentFormData } from "@/lib/validations/document"
import { createClient } from "@/lib/supabase/client"
import type { Document, Worker, Service, Company } from "@/types"
import { toast } from "sonner"

interface DocumentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: DocumentFormData) => void
  document?: Document | null
  isLoading?: boolean
  currentUserId: string
}

export function DocumentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  document,
  isLoading = false,
  currentUserId,
}: DocumentFormDialogProps) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document?.name || "",
      type: document?.type || "otro",
      url: document?.url || "",
      related_to: document?.related_to || "worker",
      related_id: document?.related_id || "",
      created_by: document?.created_by || currentUserId,
    },
  })

  const type = watch("type")
  const related_to = watch("related_to")
  const related_id = watch("related_id")

  useEffect(() => {
    if (open) {
      fetchData()
      if (document) {
        reset({
          name: document.name,
          type: document.type,
          url: document.url,
          related_to: document.related_to,
          related_id: document.related_id,
          created_by: document.created_by,
        })
      } else {
        reset({
          name: "",
          type: "otro",
          url: "",
          related_to: "worker",
          related_id: "",
          created_by: currentUserId,
        })
      }
    }
  }, [open, document, reset, currentUserId])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [workersResult, servicesResult, companiesResult] = await Promise.all([
        supabase.from("workers").select("*").order("full_name"),
        supabase.from("services").select("*").order("name"),
        supabase.from("companies").select("*").order("name"),
      ])

      if (workersResult.error) throw workersResult.error
      if (servicesResult.error) throw servicesResult.error
      if (companiesResult.error) throw companiesResult.error

      setWorkers(workersResult.data || [])
      setServices(servicesResult.data || [])
      setCompanies(companiesResult.data || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar datos")
    } finally {
      setLoadingData(false)
    }
  }

  const getRelatedOptions = () => {
    switch (related_to) {
      case "worker":
        return workers.map((w) => ({ value: w.id, label: `${w.full_name} - ${w.dni}` }))
      case "service":
        return services.map((s) => ({ value: s.id, label: s.name }))
      case "company":
        return companies.map((c) => ({ value: c.id, label: c.name }))
      default:
        return []
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document ? "Editar Documento" : "Nuevo Documento"}</DialogTitle>
          <DialogDescription>
            {document
              ? "Actualiza los datos del documento"
              : "Completa los datos para registrar un nuevo documento"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Nombre del Documento <span className="text-error">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Contrato de Trabajo - Juan Pérez"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Tipo de Documento <span className="text-error">*</span>
              </Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue("type", value as "certificado" | "contrato" | "orden_servicio" | "otro")
                }
                disabled={isLoading}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificado">Certificado</SelectItem>
                  <SelectItem value="contrato">Contrato</SelectItem>
                  <SelectItem value="orden_servicio">Orden de Servicio</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-error">{errors.type.message}</p>}
            </div>

            {/* Related To */}
            <div className="space-y-2">
              <Label htmlFor="related_to">
                Relacionado con <span className="text-error">*</span>
              </Label>
              <Select
                value={related_to}
                onValueChange={(value) => {
                  setValue("related_to", value)
                  setValue("related_id", "")
                }}
                disabled={isLoading}
              >
                <SelectTrigger id="related_to">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Trabajador</SelectItem>
                  <SelectItem value="service">Servicio</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.related_to && (
                <p className="text-xs text-error">{errors.related_to.message}</p>
              )}
            </div>

            {/* Related ID */}
            {related_to !== "other" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="related_id">
                  Seleccionar {related_to === "worker" ? "Trabajador" : related_to === "service" ? "Servicio" : "Empresa"}{" "}
                  <span className="text-error">*</span>
                </Label>
                <Select
                  value={related_id || "none"}
                  onValueChange={(value) =>
                    setValue("related_id", value === "none" ? "" : value, {
                      shouldValidate: true,
                    })
                  }
                  disabled={loadingData || isLoading}
                >
                  <SelectTrigger id="related_id">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecciona una opción</SelectItem>
                    {getRelatedOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.related_id && (
                  <p className="text-xs text-error">{errors.related_id.message}</p>
                )}
              </div>
            )}

            {/* URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url">
                URL del Documento <span className="text-error">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://ejemplo.com/documento.pdf"
                {...register("url")}
                disabled={isLoading}
              />
              {errors.url && <p className="text-xs text-error">{errors.url.message}</p>}
              <p className="text-xs text-muted-foreground">
                Enlace público del documento (Google Drive, Dropbox, etc.)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || loadingData}>
              {isLoading ? "Guardando..." : document ? "Actualizar" : "Crear Documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
