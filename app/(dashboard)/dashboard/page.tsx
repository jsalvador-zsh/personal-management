"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import {
  Users,
  Building2,
  Award,
  AlertCircle,
  Briefcase,
  ClipboardCheck,
  FileText,
  Filter,
} from "lucide-react"
import type { Company, Service } from "@/types"
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
  CartesianGrid,
} from "recharts"

interface DashboardStats {
  totalWorkers: number
  activeWorkers: number
  inactiveWorkers: number
  totalCompanies: number
  totalServices: number
  activeServices: number
  totalCertifications: number
  expiringCertifications: number
  expiredCertifications: number
  activeCertifications: number
  totalEvaluations: number
  totalDocuments: number
  totalCourses: number
}

interface EvaluationWithDetails {
  id: string
  date: string
  evaluation_type: string
  score: number | null
  comments: string | null
  worker: {
    id: string
    full_name: string
    dni: string
    position: string | null
    company_id: string | null
  } | null
  evaluator: {
    full_name: string | null
  } | null
  worker_services?: Array<{
    service: Service | null
  }> | null
}

const COLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  brand: "#6ee7b7",
  secondary: "#6b7280",
}

export default function DashboardPage() {
  const { profile } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkers: 0,
    activeWorkers: 0,
    inactiveWorkers: 0,
    totalCompanies: 0,
    totalServices: 0,
    activeServices: 0,
    totalCertifications: 0,
    expiringCertifications: 0,
    expiredCertifications: 0,
    activeCertifications: 0,
    totalEvaluations: 0,
    totalDocuments: 0,
    totalCourses: 0,
  })
  const [loading, setLoading] = useState(true)

  // Estados para la sección de evaluaciones
  const [evaluations, setEvaluations] = useState<EvaluationWithDetails[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationWithDetails[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [loadingEvaluations, setLoadingEvaluations] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchEvaluations()
    fetchCompanies()
    fetchServices()
  }, [])

  useEffect(() => {
    filterEvaluations()
  }, [selectedCompany, selectedService, evaluations])

  const fetchDashboardStats = async () => {
    const supabase = createClient()

    try {
      const [
        workersTotal,
        workersActive,
        workersInactive,
        companiesTotal,
        servicesTotal,
        servicesActive,
        certificationsTotal,
        certificationsActive,
        certificationsExpiring,
        certificationsExpired,
        evaluationsTotal,
        documentsTotal,
        coursesTotal,
      ] = await Promise.all([
        supabase.from("workers").select("*", { count: "exact", head: true }),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("status", "habilitado"),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("status", "inhabilitado"),
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("status", "activo"),
        supabase.from("certifications").select("*", { count: "exact", head: true }),
        supabase.from("certifications").select("*", { count: "exact", head: true }).eq("status", "vigente"),
        supabase.from("certifications").select("*", { count: "exact", head: true }).eq("status", "por_vencer"),
        supabase.from("certifications").select("*", { count: "exact", head: true }).eq("status", "vencido"),
        supabase.from("evaluations").select("*", { count: "exact", head: true }),
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
      ])

      setStats({
        totalWorkers: workersTotal.count || 0,
        activeWorkers: workersActive.count || 0,
        inactiveWorkers: workersInactive.count || 0,
        totalCompanies: companiesTotal.count || 0,
        totalServices: servicesTotal.count || 0,
        activeServices: servicesActive.count || 0,
        totalCertifications: certificationsTotal.count || 0,
        expiringCertifications: certificationsExpiring.count || 0,
        expiredCertifications: certificationsExpired.count || 0,
        activeCertifications: certificationsActive.count || 0,
        totalEvaluations: evaluationsTotal.count || 0,
        totalDocuments: documentsTotal.count || 0,
        totalCourses: coursesTotal.count || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEvaluations = async () => {
    const supabase = createClient()
    setLoadingEvaluations(true)

    try {
      const { data, error } = await supabase
        .from("evaluations")
        .select(`
          *,
          worker:workers(
            id,
            full_name,
            dni,
            position,
            company_id
          ),
          evaluator:users!evaluations_evaluator_id_fkey(
            full_name
          )
        `)
        .order("date", { ascending: false })
        .limit(100)

      if (error) throw error

      // Para cada evaluación, obtener los servicios del trabajador
      const evaluationsWithServices = await Promise.all(
        ((data || []) as any).map(async (evaluation: any) => {
          if (!evaluation.worker) return evaluation

          const { data: workerServices } = await supabase
            .from("worker_services")
            .select(`
              service:services(*)
            `)
            .eq("worker_id", evaluation.worker.id)
            .eq("status", "activo")

          return {
            ...evaluation,
            worker_services: workerServices || [],
          }
        })
      )

      setEvaluations(evaluationsWithServices as EvaluationWithDetails[])
    } catch (error) {
      console.error("Error fetching evaluations:", error)
    } finally {
      setLoadingEvaluations(false)
    }
  }

  const fetchCompanies = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name")

      if (error) throw error

      setCompanies(data || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const fetchServices = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", "activo")
        .order("name")

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const filterEvaluations = () => {
    let filtered = evaluations

    // Filtrar por empresa
    if (selectedCompany !== "all") {
      filtered = filtered.filter(
        (evaluation) => evaluation.worker?.company_id === selectedCompany
      )
    }

    // Filtrar por servicio
    if (selectedService !== "all") {
      filtered = filtered.filter((evaluation) => {
        return evaluation.worker_services?.some(
          (ws) => ws.service?.id === selectedService
        )
      })
    }

    setFilteredEvaluations(filtered)
  }

  const workerStatusData = [
    { name: "Habilitados", value: stats.activeWorkers, color: COLORS.success },
    { name: "Inhabilitados", value: stats.inactiveWorkers, color: COLORS.error },
  ]

  const certificationStatusData = [
    { name: "Vigentes", value: stats.activeCertifications, color: COLORS.success },
    { name: "Por Vencer", value: stats.expiringCertifications, color: COLORS.warning },
    { name: "Vencidas", value: stats.expiredCertifications, color: COLORS.error },
  ]

  const moduleOverviewData = [
    { name: "Trabajadores", count: stats.totalWorkers },
    { name: "Empresas", count: stats.totalCompanies },
    { name: "Servicios", count: stats.totalServices },
    { name: "Cursos", count: stats.totalCourses },
    { name: "Certificaciones", count: stats.totalCertifications },
    { name: "Evaluaciones", count: stats.totalEvaluations },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard de Métricas
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualiza las estadísticas y KPIs del sistema en tiempo real
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                {stats.activeWorkers} habilitados
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.inactiveWorkers} inhabilitados
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalWorkers > 0
                ? `${Math.round((stats.activeWorkers / stats.totalWorkers) * 100)}% habilitados`
                : "Sin datos"}
            </p>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Unidades mineras registradas
            </p>
          </CardContent>
        </Card>

        {/* Total Services */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Servicios
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs">
                {stats.activeServices} activos
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalServices > 0
                ? `${Math.round((stats.activeServices / stats.totalServices) * 100)}% activos`
                : "Sin servicios"}
            </p>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="hover:shadow-lg transition-shadow border-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.expiringCertifications + stats.expiredCertifications}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="warning" className="text-xs">
                {stats.expiringCertifications} por vencer
              </Badge>
              <Badge variant="error" className="text-xs">
                {stats.expiredCertifications} vencidas
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Certificaciones que requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificaciones</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertifications}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.activeCertifications} vigentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Evaluaciones registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Archivos almacenados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Worker Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Trabajadores</CardTitle>
            <CardDescription>Por estado de habilitación</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalWorkers > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certification Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Certificaciones</CardTitle>
            <CardDescription>Vigencia y alertas</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalCertifications > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={certificationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {certificationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Overview Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vista General del Sistema</CardTitle>
          <CardDescription>Resumen de registros por módulo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleOverviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.brand} name="Cantidad de Registros" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evaluaciones por Empresa y Servicio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Evaluaciones por Empresa y Servicio
          </CardTitle>
          <CardDescription>
            Filtra y visualiza evaluaciones de trabajadores según empresa y servicio asignado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="flex items-end gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-filter">Filtrar por Empresa</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger id="company-filter">
                    <SelectValue placeholder="Todas las empresas" />
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
              <div className="space-y-2">
                <Label htmlFor="service-filter">Filtrar por Servicio</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service-filter">
                    <SelectValue placeholder="Todos los servicios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los servicios</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{filteredEvaluations.length} evaluaciones</p>
            </div>
          </div>

          {/* Tabla de Evaluaciones */}
          {loadingEvaluations ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Cargando evaluaciones...</p>
            </div>
          ) : filteredEvaluations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de Evaluación</TableHead>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Puesto/Cargo</TableHead>
                    <TableHead>Servicio(s)</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Puntaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        {new Date(evaluation.date).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {evaluation.worker?.full_name || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {evaluation.worker?.dni || "N/A"}
                      </TableCell>
                      <TableCell>
                        {evaluation.worker?.position || (
                          <span className="text-muted-foreground italic">Sin cargo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {evaluation.worker_services && evaluation.worker_services.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {evaluation.worker_services.map((ws, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ws.service?.name || "N/A"}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">
                            Sin servicio asignado
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {evaluation.evaluation_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {evaluation.score !== null ? (
                          <Badge
                            variant={
                              evaluation.score >= 80
                                ? "success"
                                : evaluation.score >= 60
                                ? "warning"
                                : "error"
                            }
                          >
                            {evaluation.score}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">
                No hay evaluaciones que coincidan con los filtros
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Intenta ajustar los filtros o registra nuevas evaluaciones
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
