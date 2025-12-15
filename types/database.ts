export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: UserRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          full_name?: string | null
          updated_at?: string
        }
      }
      workers: {
        Row: {
          id: string
          dni: string
          full_name: string
          photo_url: string | null
          phone: string | null
          email: string | null
          status: WorkerStatus
          position: string | null
          company_id: string | null
          // Información Personal Extendida
          pais: string | null
          sexo: string | null
          estado_civil: string | null
          fecha_nacimiento: string | null
          correo_personal: string | null
          domicilio: string | null
          telefono_fijo: string | null
          // Información Profesional Extendida
          carrera_profesional: string | null
          fecha_inicio: string | null
          fecha_cese: string | null
          sitio: string | null
          area: string | null
          local: string | null
          condiciones_trabajo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dni: string
          full_name: string
          photo_url?: string | null
          phone?: string | null
          email?: string | null
          status?: WorkerStatus
          position?: string | null
          company_id?: string | null
          // Información Personal Extendida
          pais?: string | null
          sexo?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          correo_personal?: string | null
          domicilio?: string | null
          telefono_fijo?: string | null
          // Información Profesional Extendida
          carrera_profesional?: string | null
          fecha_inicio?: string | null
          fecha_cese?: string | null
          sitio?: string | null
          area?: string | null
          local?: string | null
          condiciones_trabajo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dni?: string
          full_name?: string
          photo_url?: string | null
          phone?: string | null
          email?: string | null
          status?: WorkerStatus
          position?: string | null
          company_id?: string | null
          // Información Personal Extendida
          pais?: string | null
          sexo?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          correo_personal?: string | null
          domicilio?: string | null
          telefono_fijo?: string | null
          // Información Profesional Extendida
          carrera_profesional?: string | null
          fecha_inicio?: string | null
          fecha_cese?: string | null
          sitio?: string | null
          area?: string | null
          local?: string | null
          condiciones_trabajo?: string | null
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          cost_center: string | null
          work_mode: WorkMode
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cost_center?: string | null
          work_mode?: WorkMode
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cost_center?: string | null
          work_mode?: WorkMode
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          company_id: string
          status: ServiceStatus
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_id: string
          status?: ServiceStatus
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_id?: string
          status?: ServiceStatus
          manager_id?: string | null
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_hours?: number | null
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          worker_id: string
          course_id: string
          issue_date: string
          expiry_date: string
          document_url: string | null
          status: CertificationStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          course_id: string
          issue_date: string
          expiry_date: string
          document_url?: string | null
          status?: CertificationStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          course_id?: string
          issue_date?: string
          expiry_date?: string
          document_url?: string | null
          status?: CertificationStatus
          updated_at?: string
        }
      }
      homologations: {
        Row: {
          id: string
          company_id: string
          course_id: string
          is_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          course_id: string
          is_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          course_id?: string
          is_required?: boolean
          updated_at?: string
        }
      }
      worker_services: {
        Row: {
          id: string
          worker_id: string
          service_id: string
          start_date: string
          end_date: string | null
          status: AssignmentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          service_id: string
          start_date: string
          end_date?: string | null
          status?: AssignmentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          service_id?: string
          start_date?: string
          end_date?: string | null
          status?: AssignmentStatus
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          worker_id: string
          evaluator_id: string
          evaluation_type: EvaluationType
          score: number | null
          date: string
          comments: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          evaluator_id: string
          evaluation_type: EvaluationType
          score?: number | null
          date: string
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          evaluator_id?: string
          evaluation_type?: EvaluationType
          score?: number | null
          date?: string
          comments?: string | null
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          type: DocumentType
          url: string
          related_to: string
          related_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: DocumentType
          url: string
          related_to: string
          related_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: DocumentType
          url?: string
          related_to?: string
          related_id?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          changes: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          changes?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          table_name?: string
          record_id?: string
          changes?: Json | null
          timestamp?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          message?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      UserRole: 'admin' | 'rrhh' | 'medico' | 'supervisor' | 'usuario'
      WorkerStatus: 'habilitado' | 'inhabilitado'
      WorkMode: 'presencial' | 'remoto' | 'hibrido'
      ServiceStatus: 'activo' | 'inactivo'
      CertificationStatus: 'vigente' | 'vencido' | 'por_vencer'
      AssignmentStatus: 'activo' | 'finalizado'
      EvaluationType: 'admin' | 'medico' | 'rrhh'
      DocumentType: 'certificado' | 'contrato' | 'orden_servicio' | 'otro'
      NotificationType: 'certificacion_vencida' | 'nueva_evaluacion' | 'otro'
    }
  }
}

// Type helpers
export type UserRole = Database['public']['Enums']['UserRole']
export type WorkerStatus = Database['public']['Enums']['WorkerStatus']
export type WorkMode = Database['public']['Enums']['WorkMode']
export type ServiceStatus = Database['public']['Enums']['ServiceStatus']
export type CertificationStatus = Database['public']['Enums']['CertificationStatus']
export type AssignmentStatus = Database['public']['Enums']['AssignmentStatus']
export type EvaluationType = Database['public']['Enums']['EvaluationType']
export type DocumentType = Database['public']['Enums']['DocumentType']
export type NotificationType = Database['public']['Enums']['NotificationType']
