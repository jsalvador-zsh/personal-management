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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { evaluationSchema, type EvaluationFormData } from "@/lib/validations/evaluation"
import { createClient } from "@/lib/supabase/client"
import type { Evaluation, Worker, User } from "@/types"
import { toast } from "sonner"

interface EvaluationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EvaluationFormData) => void
  evaluation?: Evaluation | null
  isLoading?: boolean
}

export function EvaluationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  evaluation,
  isLoading = false,
}: EvaluationFormDialogProps) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [evaluators, setEvaluators] = useState<User[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      worker_id: evaluation?.worker_id || "",
      evaluator_id: evaluation?.evaluator_id || "",
      evaluation_type: evaluation?.evaluation_type || "admin",
      score: evaluation?.score || null,
      date: evaluation?.date || "",
      comments: evaluation?.comments || "",
    },
  })

  const worker_id = watch("worker_id")
  const evaluator_id = watch("evaluator_id")
  const evaluation_type = watch("evaluation_type")

  useEffect(() => {
    if (open) {
      fetchData()
      if (evaluation) {
        reset({
          worker_id: evaluation.worker_id,
          evaluator_id: evaluation.evaluator_id,
          evaluation_type: evaluation.evaluation_type,
          score: evaluation.score,
          date: evaluation.date,
          comments: evaluation.comments || "",
        })
      } else {
        reset({
          worker_id: "",
          evaluator_id: "",
          evaluation_type: "admin",
          score: null,
          date: "",
          comments: "",
        })
      }
    }
  }, [open, evaluation, reset])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      const [workersResult, evaluatorsResult] = await Promise.all([
        supabase.from("workers").select("*").order("full_name"),
        supabase.from("users").select("*").order("email"),
      ])

      if (workersResult.error) throw workersResult.error
      if (evaluatorsResult.error) throw evaluatorsResult.error

      setWorkers(workersResult.data || [])
      setEvaluators(evaluatorsResult.data || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar trabajadores y evaluadores")
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{evaluation ? "Editar Evaluación" : "Nueva Evaluación"}</DialogTitle>
          <DialogDescription>
            {evaluation
              ? "Actualiza los datos de la evaluación"
              : "Completa los datos para registrar una nueva evaluación"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Worker */}
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
                disabled={loadingData || isLoading}
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

            {/* Evaluator */}
            <div className="space-y-2">
              <Label htmlFor="evaluator_id">
                Evaluador <span className="text-error">*</span>
              </Label>
              <Select
                value={evaluator_id || "none"}
                onValueChange={(value) =>
                  setValue("evaluator_id", value === "none" ? "" : value, {
                    shouldValidate: true,
                  })
                }
                disabled={loadingData || isLoading}
              >
                <SelectTrigger id="evaluator_id">
                  <SelectValue placeholder="Selecciona un evaluador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecciona un evaluador</SelectItem>
                  {evaluators.map((evaluator) => (
                    <SelectItem key={evaluator.id} value={evaluator.id}>
                      {evaluator.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.evaluator_id && (
                <p className="text-xs text-error">{errors.evaluator_id.message}</p>
              )}
            </div>

            {/* Evaluation Type */}
            <div className="space-y-2">
              <Label htmlFor="evaluation_type">
                Tipo de Evaluación <span className="text-error">*</span>
              </Label>
              <Select
                value={evaluation_type}
                onValueChange={(value) =>
                  setValue("evaluation_type", value as "admin" | "medico" | "rrhh")
                }
                disabled={isLoading}
              >
                <SelectTrigger id="evaluation_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrativa</SelectItem>
                  <SelectItem value="medico">Médica</SelectItem>
                  <SelectItem value="rrhh">RRHH</SelectItem>
                </SelectContent>
              </Select>
              {errors.evaluation_type && (
                <p className="text-xs text-error">{errors.evaluation_type.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">
                Fecha <span className="text-error">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                disabled={isLoading}
              />
              {errors.date && <p className="text-xs text-error">{errors.date.message}</p>}
            </div>

            {/* Score */}
            <div className="space-y-2">
              <Label htmlFor="score">Puntuación (0-100, opcional)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                placeholder="Ej: 85"
                {...register("score", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.score && <p className="text-xs text-error">{errors.score.message}</p>}
            </div>

            {/* Comments */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comments">Comentarios (opcional)</Label>
              <Textarea
                id="comments"
                placeholder="Observaciones sobre la evaluación..."
                rows={3}
                {...register("comments")}
                disabled={isLoading}
              />
              {errors.comments && (
                <p className="text-xs text-error">{errors.comments.message}</p>
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
              {isLoading ? "Guardando..." : evaluation ? "Actualizar" : "Crear Evaluación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
