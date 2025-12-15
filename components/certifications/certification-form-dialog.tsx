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
import { certificationSchema, type CertificationFormData } from "@/lib/validations/certification"
import { createClient } from "@/lib/supabase/client"
import type { Certification, Worker, Course } from "@/types"
import { toast } from "sonner"

interface CertificationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CertificationFormData) => void
  certification?: Certification | null
  isLoading?: boolean
}

export function CertificationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  certification,
  isLoading = false,
}: CertificationFormDialogProps) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      worker_id: certification?.worker_id || "",
      course_id: certification?.course_id || "",
      issue_date: certification?.issue_date || "",
      expiry_date: certification?.expiry_date || "",
      document_url: certification?.document_url || "",
    },
  })

  const worker_id = watch("worker_id")
  const course_id = watch("course_id")

  useEffect(() => {
    if (open) {
      fetchData()
      if (certification) {
        reset({
          worker_id: certification.worker_id,
          course_id: certification.course_id,
          issue_date: certification.issue_date,
          expiry_date: certification.expiry_date,
          document_url: certification.document_url || "",
        })
      } else {
        reset({
          worker_id: "",
          course_id: "",
          issue_date: "",
          expiry_date: "",
          document_url: "",
        })
      }
    }
  }, [open, certification, reset])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [workersResult, coursesResult] = await Promise.all([
        supabase.from("workers").select("*").order("full_name"),
        supabase.from("courses").select("*").order("name"),
      ])

      if (workersResult.error) throw workersResult.error
      if (coursesResult.error) throw coursesResult.error

      setWorkers(workersResult.data || [])
      setCourses(coursesResult.data || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar trabajadores y cursos")
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {certification ? "Editar Certificación" : "Nueva Certificación"}
          </DialogTitle>
          <DialogDescription>
            {certification
              ? "Actualiza los datos de la certificación"
              : "Completa los datos para registrar una nueva certificación"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Worker Select */}
            <div className="space-y-2">
              <Label htmlFor="worker_id">
                Trabajador <span className="text-error">*</span>
              </Label>
              <Select
                value={worker_id || "none"}
                onValueChange={(value) =>
                  setValue("worker_id", value === "none" ? "" : value, {
                    shouldValidate: true,
                  })
                }
                disabled={loadingData}
              >
                <SelectTrigger id="worker_id">
                  <SelectValue placeholder="Selecciona un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecciona un trabajador</SelectItem>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.full_name} - {worker.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.worker_id && (
                <p className="text-xs text-error">{errors.worker_id.message}</p>
              )}
            </div>

            {/* Course Select */}
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
                disabled={loadingData}
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

            {/* Issue Date */}
            <div className="space-y-2">
              <Label htmlFor="issue_date">
                Fecha de Emisión <span className="text-error">*</span>
              </Label>
              <Input
                id="issue_date"
                type="date"
                {...register("issue_date")}
                disabled={isLoading}
              />
              {errors.issue_date && (
                <p className="text-xs text-error">{errors.issue_date.message}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry_date">
                Fecha de Vencimiento <span className="text-error">*</span>
              </Label>
              <Input
                id="expiry_date"
                type="date"
                {...register("expiry_date")}
                disabled={isLoading}
              />
              {errors.expiry_date && (
                <p className="text-xs text-error">{errors.expiry_date.message}</p>
              )}
            </div>

            {/* Document URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="document_url">URL del Documento (opcional)</Label>
              <Input
                id="document_url"
                type="url"
                placeholder="https://ejemplo.com/certificado.pdf"
                {...register("document_url")}
                disabled={isLoading}
              />
              {errors.document_url && (
                <p className="text-xs text-error">{errors.document_url.message}</p>
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
              {isLoading
                ? "Guardando..."
                : certification
                  ? "Actualizar"
                  : "Crear Certificación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
