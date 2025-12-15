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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { companySchema, type CompanyFormData } from "@/lib/validations/company"
import type { Company } from "@/types"

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CompanyFormData) => Promise<void>
  company?: Company | null
  isLoading?: boolean
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  onSubmit,
  company,
  isLoading = false,
}: CompanyFormDialogProps) {
  const isEditing = !!company

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      cost_center: "",
      work_mode: "presencial",
    },
  })

  const work_mode = watch("work_mode")

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        description: company.description || "",
        cost_center: company.cost_center || "",
        work_mode: company.work_mode,
      })
    } else {
      reset({
        name: "",
        description: "",
        cost_center: "",
        work_mode: "presencial",
      })
    }
  }, [company, reset])

  const handleFormSubmit = async (data: CompanyFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Empresa" : "Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la empresa"
              : "Completa el formulario para registrar una nueva empresa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Nombre de la Empresa <span className="text-error">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Compañía Minera Antamina"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-error">{errors.name.message}</p>
              )}
            </div>

            {/* Cost Center */}
            <div className="space-y-2">
              <Label htmlFor="cost_center">Centro de Costo</Label>
              <Input
                id="cost_center"
                {...register("cost_center")}
                placeholder="CC-001"
                disabled={isLoading}
              />
              {errors.cost_center && (
                <p className="text-sm text-error">{errors.cost_center.message}</p>
              )}
            </div>

            {/* Work Mode */}
            <div className="space-y-2">
              <Label htmlFor="work_mode">
                Modalidad de Trabajo <span className="text-error">*</span>
              </Label>
              <Select
                value={work_mode}
                onValueChange={(value: "presencial" | "remoto" | "hibrido") =>
                  setValue("work_mode", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
              {errors.work_mode && (
                <p className="text-sm text-error">{errors.work_mode.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Unidad minera en Áncash, Perú"
                disabled={isLoading}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-error">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
