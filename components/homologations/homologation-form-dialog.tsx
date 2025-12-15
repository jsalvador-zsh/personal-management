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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { homologationSchema, type HomologationFormData } from "@/lib/validations/homologation"
import { createClient } from "@/lib/supabase/client"
import type { Homologation, Company, Course } from "@/types"
import { toast } from "sonner"

interface HomologationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: HomologationFormData) => void
  homologation?: Homologation | null
  isLoading?: boolean
}

export function HomologationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  homologation,
  isLoading = false,
}: HomologationFormDialogProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<HomologationFormData>({
    resolver: zodResolver(homologationSchema),
    defaultValues: {
      company_id: homologation?.company_id || "",
      course_id: homologation?.course_id || "",
      is_required: homologation?.is_required ?? true,
    },
  })

  const company_id = watch("company_id")
  const course_id = watch("course_id")
  const is_required = watch("is_required")

  useEffect(() => {
    if (open) {
      fetchData()
      if (homologation) {
        reset({
          company_id: homologation.company_id,
          course_id: homologation.course_id,
          is_required: homologation.is_required,
        })
      } else {
        reset({
          company_id: "",
          course_id: "",
          is_required: true,
        })
      }
    }
  }, [open, homologation, reset])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [companiesResult, coursesResult] = await Promise.all([
        supabase.from("companies").select("*").order("name"),
        supabase.from("courses").select("*").order("name"),
      ])

      if (companiesResult.error) throw companiesResult.error
      if (coursesResult.error) throw coursesResult.error

      setCompanies(companiesResult.data || [])
      setCourses(coursesResult.data || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar empresas y cursos")
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {homologation ? "Editar Homologación" : "Nueva Homologación"}
          </DialogTitle>
          <DialogDescription>
            {homologation
              ? "Actualiza la relación entre empresa y curso"
              : "Define qué cursos son requeridos para cada empresa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company_id">
                Empresa <span className="text-error">*</span>
              </Label>
              <Select
                value={company_id || "none"}
                onValueChange={(value) =>
                  setValue("company_id", value === "none" ? "" : value, {
                    shouldValidate: true,
                  })
                }
                disabled={loadingData || isLoading}
              >
                <SelectTrigger id="company_id">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecciona una empresa</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && (
                <p className="text-xs text-error">{errors.company_id.message}</p>
              )}
            </div>

            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course_id">
                Curso <span className="text-error">*</span>
              </Label>
              <Select
                value={course_id || "none"}
                onValueChange={(value) =>
                  setValue("course_id", value === "none" ? "" : value, {
                    shouldValidate: true,
                  })
                }
                disabled={loadingData || isLoading}
              >
                <SelectTrigger id="course_id">
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecciona un curso</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id && (
                <p className="text-xs text-error">{errors.course_id.message}</p>
              )}
            </div>

            {/* Is Required */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_required"
                  checked={is_required}
                  onCheckedChange={(checked) => setValue("is_required", !!checked)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="is_required"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Este curso es obligatorio para esta empresa
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Los cursos obligatorios deben ser completados por todos los trabajadores de la
                empresa
              </p>
              {errors.is_required && (
                <p className="text-xs text-error">{errors.is_required.message}</p>
              )}
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
              {isLoading ? "Guardando..." : homologation ? "Actualizar" : "Crear Homologación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
