"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, ClipboardCheck, Loader2, Users, TrendingUp, Award, BarChart3, Building2 } from "lucide-react"
import { EvaluationTable } from "@/components/evaluations/evaluation-table"
import { EvaluationFormDialog } from "@/components/evaluations/evaluation-form-dialog"
import { EvaluationDetailDialog, type EvaluationWithDetails } from "@/components/evaluations/evaluation-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Evaluation, Company } from "@/types"
import type { EvaluationFormData } from "@/lib/validations/evaluation"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

interface EvaluationStats {
  totalEvaluations: number
  totalWorkers: number
  habilitadosCount: number
  inhabilitadosCount: number
  averageScore: number
  adminCount: number
  medicoCount: number
  rrhhCount: number
  evaluationsThisMonth: number
}

const COLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  brand: "#00a99d",
  secondary: "#6b7280",
}

export default function EvaluacionesPage() {
  const [evaluations, setEvaluations] = useState<EvaluationWithDetails[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationWithDetails[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [stats, setStats] = useState<EvaluationStats>({
    totalEvaluations: 0,
    totalWorkers: 0,
    habilitadosCount: 0,
    inhabilitadosCount: 0,
    averageScore: 0,
    adminCount: 0,
    medicoCount: 0,
    rrhhCount: 0,
    evaluationsThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationWithDetails | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchCompanies()
    fetchData()
    fetchStats()
  }, [])

  useEffect(() => {
    filterEvaluations()
  }, [selectedCompany, evaluations])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name")

      if (error) throw error
      setCompanies(data || [])
    } catch (error: any) {
      console.error("Error fetching companies:", error)
    }
  }

  const filterEvaluations = () => {
    if (selectedCompany === "all") {
      setFilteredEvaluations(evaluations)
    } else {
      const filtered = evaluations.filter(
        (evaluation) => evaluation.worker?.company_id === selectedCompany
      )
      setFilteredEvaluations(filtered)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("evaluations")
        .select(`
          *,
          worker:workers(*),
          evaluator:users(*)
        `)
        .order("date", { ascending: false })

      if (error) throw error
      setEvaluations(data || [])
    } catch (error: any) {
      console.error("Error fetching evaluations:", error)
      toast.error("Error al cargar las evaluaciones")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [
        evaluationsData,
        workersData,
        habilitadosData,
        inhabilitadosData,
        adminEvals,
        medicoEvals,
        rrhhEvals,
        thisMonthEvals,
      ] = await Promise.all([
        (supabase.from("evaluations") as any).select("score", { count: "exact" }),
        supabase.from("workers").select("*", { count: "exact", head: true }),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("status", "habilitado"),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("status", "inhabilitado"),
        supabase.from("evaluations").select("*", { count: "exact", head: true }).eq("evaluation_type", "admin"),
        supabase.from("evaluations").select("*", { count: "exact", head: true }).eq("evaluation_type", "medico"),
        supabase.from("evaluations").select("*", { count: "exact", head: true }).eq("evaluation_type", "rrhh"),
        supabase.from("evaluations").select("*", { count: "exact", head: true }).gte("date", firstDayOfMonth),
      ])

      // Calcular promedio de puntuaciones
      const scores = evaluationsData.data?.filter((e: any) => e.score !== null).map((e: any) => e.score) || []
      const avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0

      setStats({
        totalEvaluations: evaluationsData.count || 0,
        totalWorkers: workersData.count || 0,
        habilitadosCount: habilitadosData.count || 0,
        inhabilitadosCount: inhabilitadosData.count || 0,
        averageScore: Math.round(avgScore * 10) / 10,
        adminCount: adminEvals.count || 0,
        medicoCount: medicoEvals.count || 0,
        rrhhCount: rrhhEvals.count || 0,
        evaluationsThisMonth: thisMonthEvals.count || 0,
      })
    } catch (error: any) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleCreate = async (data: EvaluationFormData) => {
    setActionLoading(true)
    try {
      const evaluationData = {
        worker_id: data.worker_id,
        evaluator_id: data.evaluator_id,
        evaluation_type: data.evaluation_type,
        score: data.score || null,
        date: data.date,
        comments: data.comments || null,
      }

      const { error } = await (supabase.from("evaluations") as any).insert(evaluationData).select()
      if (error) throw error

      toast.success("Evaluación creada exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating evaluation:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear evaluaciones")
      } else {
        toast.error(`Error: ${error.message || "Error al crear la evaluación"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: EvaluationFormData) => {
    if (!selectedEvaluation) return

    setActionLoading(true)
    try {
      const evaluationData = {
        worker_id: data.worker_id,
        evaluator_id: data.evaluator_id,
        evaluation_type: data.evaluation_type,
        score: data.score || null,
        date: data.date,
        comments: data.comments || null,
      }

      const { error } = await (supabase
        .from("evaluations") as any)
        .update(evaluationData)
        .eq("id", selectedEvaluation.id)

      if (error) throw error

      toast.success("Evaluación actualizada exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedEvaluation(null)
    } catch (error: any) {
      console.error("Error updating evaluation:", error)
      toast.error(`Error: ${error.message || "Error al actualizar la evaluación"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvaluation) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("evaluations")
        .delete()
        .eq("id", selectedEvaluation.id)

      if (error) throw error

      toast.success("Evaluación eliminada exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedEvaluation(null)
    } catch (error: any) {
      console.error("Error deleting evaluation:", error)
      toast.error("Error al eliminar la evaluación")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (evaluation: Evaluation) => {
    const evalWithDetails = evaluations.find((e) => e.id === evaluation.id)
    setSelectedEvaluation(evalWithDetails || null)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation as EvaluationWithDetails)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation as EvaluationWithDetails)
    setDeleteDialogOpen(true)
  }

  // Data for charts
  const workerStatusData = [
    { name: "Habilitados", value: stats.habilitadosCount, color: COLORS.success },
    { name: "Inhabilitados", value: stats.inhabilitadosCount, color: COLORS.error },
  ]

  const evaluationTypeData = [
    { name: "Administrativa", value: stats.adminCount, color: COLORS.secondary },
    { name: "Médica", value: stats.medicoCount, color: COLORS.info },
    { name: "RRHH", value: stats.rrhhCount, color: COLORS.warning },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando evaluaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Evaluación del Personal</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de evaluaciones y seguimiento de trabajadores
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Company Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="company-filter" className="text-sm font-medium">
                Filtrar por Empresa
              </Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company-filter" className="mt-2">
                  <SelectValue placeholder="Seleccione una empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las empresas</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{filteredEvaluations.length} evaluaciones</p>
              <p className="text-xs">
                {selectedCompany === "all" ? "Total del sistema" : "De la empresa seleccionada"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Evaluations */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Evaluaciones
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.evaluationsThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        {/* Total Workers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trabajadores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkers}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs">
                {stats.habilitadosCount} habilitados
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Percentage Habilitados */}
        <Card className="hover:shadow-lg transition-shadow border-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Habilitación
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.totalWorkers > 0
                ? `${Math.round((stats.habilitadosCount / stats.totalWorkers) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.habilitadosCount} de {stats.totalWorkers} trabajadores
            </p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Puntuación Promedio
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground mt-2">
              De 100 puntos posibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Worker Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución del Personal</CardTitle>
            <CardDescription>Estado de habilitación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evaluation Types Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones por Tipo</CardTitle>
            <CardDescription>Distribución por área evaluadora</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evaluationTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Cantidad" fill={COLORS.brand}>
                  {evaluationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Lista de Evaluaciones ({filteredEvaluations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EvaluationTable
            data={filteredEvaluations}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EvaluationFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      <EvaluationFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        evaluation={selectedEvaluation}
        isLoading={actionLoading}
      />

      <EvaluationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        evaluation={selectedEvaluation}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
