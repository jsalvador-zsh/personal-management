// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  RRHH: 'rrhh',
  MEDICO: 'medico',
  SUPERVISOR: 'supervisor',
  USUARIO: 'usuario',
} as const

export const USER_ROLE_LABELS = {
  admin: 'Administrador',
  rrhh: 'Recursos Humanos',
  medico: 'Médico',
  supervisor: 'Supervisor',
  usuario: 'Usuario',
} as const

// Estados de trabajador
export const WORKER_STATUS = {
  HABILITADO: 'habilitado',
  INHABILITADO: 'inhabilitado',
} as const

export const WORKER_STATUS_LABELS = {
  habilitado: 'Habilitado',
  inhabilitado: 'Inhabilitado',
} as const

// Estados de certificación
export const CERTIFICATION_STATUS = {
  VIGENTE: 'vigente',
  VENCIDO: 'vencido',
  POR_VENCER: 'por_vencer',
} as const

export const CERTIFICATION_STATUS_LABELS = {
  vigente: 'Vigente',
  vencido: 'Vencido',
  por_vencer: 'Por Vencer',
} as const

// Modos de trabajo
export const WORK_MODE = {
  PRESENCIAL: 'presencial',
  REMOTO: 'remoto',
  HIBRIDO: 'hibrido',
} as const

export const WORK_MODE_LABELS = {
  presencial: 'Presencial',
  remoto: 'Remoto',
  hibrido: 'Híbrido',
} as const

// Estados de servicio
export const SERVICE_STATUS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const

export const SERVICE_STATUS_LABELS = {
  activo: 'Activo',
  inactivo: 'Inactivo',
} as const

// Tipos de evaluación
export const EVALUATION_TYPE = {
  ADMIN: 'admin',
  MEDICO: 'medico',
  RRHH: 'rrhh',
} as const

export const EVALUATION_TYPE_LABELS = {
  admin: 'Administrativa',
  medico: 'Médica',
  rrhh: 'Recursos Humanos',
} as const

// Tipos de documento
export const DOCUMENT_TYPE = {
  CERTIFICADO: 'certificado',
  CONTRATO: 'contrato',
  ORDEN_SERVICIO: 'orden_servicio',
  OTRO: 'otro',
} as const

export const DOCUMENT_TYPE_LABELS = {
  certificado: 'Certificado',
  contrato: 'Contrato',
  orden_servicio: 'Orden de Servicio',
  otro: 'Otro',
} as const

// Tipos de notificación
export const NOTIFICATION_TYPE = {
  CERTIFICACION_VENCIDA: 'certificacion_vencida',
  NUEVA_EVALUACION: 'nueva_evaluacion',
  OTRO: 'otro',
} as const

// Configuración de alertas
export const ALERT_DAYS = {
  CRITICAL: 7,   // 7 días - alerta roja
  WARNING: 15,   // 15 días - alerta amarilla
  INFO: 30,      // 30 días - alerta azul
} as const

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  WORKERS: '/dashboard/workers',
  COMPANIES: '/dashboard/companies',
  SERVICES: '/dashboard/services',
  COURSES: '/dashboard/courses',
  EVALUATIONS: '/dashboard/evaluations',
  REPORTS: '/dashboard/reports',
  DOCUMENTS: '/dashboard/documents',
  SETTINGS: '/dashboard/settings',
} as const

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

// Límites de archivos
export const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
} as const

// Mensajes del sistema
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Registro creado exitosamente',
    UPDATE: 'Registro actualizado exitosamente',
    DELETE: 'Registro eliminado exitosamente',
    IMPORT: 'Datos importados exitosamente',
    EXPORT: 'Datos exportados exitosamente',
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error. Por favor, intenta nuevamente',
    NETWORK: 'Error de conexión. Verifica tu internet',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    NOT_FOUND: 'No se encontró el registro',
    VALIDATION: 'Por favor, verifica los datos ingresados',
  },
} as const
