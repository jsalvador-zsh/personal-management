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
import { createClient } from "@/lib/supabase/client"
import {
  Users,
  Building2,
  Award,
  AlertCircle,
  Briefcase,
  ClipboardCheck,
  FileText,
} from "lucide-react"
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

  useEffect(() => {
    fetchDashboardStats()
  }, [])

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
    </div>
  )
}
