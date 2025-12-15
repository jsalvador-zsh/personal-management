import { Database } from './database'

// Table types
export type Worker = Database['public']['Tables']['workers']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type Homologation = Database['public']['Tables']['homologations']['Row']
export type WorkerService = Database['public']['Tables']['worker_services']['Row']
export type Evaluation = Database['public']['Tables']['evaluations']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type AppUser = User // Alias for consistency

// Insert types
export type WorkerInsert = Database['public']['Tables']['workers']['Insert']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert']
export type EvaluationInsert = Database['public']['Tables']['evaluations']['Insert']

// Update types
export type WorkerUpdate = Database['public']['Tables']['workers']['Update']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']
export type CertificationUpdate = Database['public']['Tables']['certifications']['Update']

// Extended types with relations
export type WorkerWithCompany = Worker & {
  company?: Company | null
}

export type CertificationWithDetails = Certification & {
  worker?: Worker
  course?: Course
}

export type ServiceWithCompany = Service & {
  company?: Company
  manager?: User | null
}

export type WorkerServiceWithDetails = WorkerService & {
  worker?: Worker
  service?: Service
}

export type EvaluationWithDetails = Evaluation & {
  worker?: Worker
  evaluator?: User
}

// KPI types
export interface WorkerStatusKPI {
  habilitados: number
  inhabilitados: number
  total: number
  porcentaje_habilitados: number
}

export interface CertificationKPI {
  vigentes: number
  vencidas: number
  por_vencer: number
  total: number
}

export interface ServiceKPI {
  activos: number
  inactivos: number
  total: number
  trabajadores_asignados: number
}

export interface DashboardStats {
  total_trabajadores: number
  total_empresas: number
  total_servicios: number
  total_cursos: number
  certificaciones_por_vencer: number
  evaluaciones_pendientes: number
}
