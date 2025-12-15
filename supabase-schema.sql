-- =====================================================
-- SISTEMA DE GESTIÓN DE PERSONAL - SCHEMA DE BASE DE DATOS
-- Supabase PostgreSQL
-- =====================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS (Tipos de datos personalizados)
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'rrhh', 'medico', 'supervisor', 'usuario');
CREATE TYPE worker_status AS ENUM ('habilitado', 'inhabilitado');
CREATE TYPE work_mode AS ENUM ('presencial', 'remoto', 'hibrido');
CREATE TYPE service_status AS ENUM ('activo', 'inactivo');
CREATE TYPE certification_status AS ENUM ('vigente', 'vencido', 'por_vencer');
CREATE TYPE assignment_status AS ENUM ('activo', 'finalizado');
CREATE TYPE evaluation_type AS ENUM ('admin', 'medico', 'rrhh');
CREATE TYPE document_type AS ENUM ('certificado', 'contrato', 'orden_servicio', 'otro');
CREATE TYPE notification_type AS ENUM ('certificacion_vencida', 'nueva_evaluacion', 'otro');

-- =====================================================
-- TABLAS
-- =====================================================

-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'usuario' NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de empresas/unidades mineras
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost_center TEXT,
  work_mode work_mode DEFAULT 'presencial' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de trabajadores
CREATE TABLE public.workers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dni TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  status worker_status DEFAULT 'habilitado' NOT NULL,
  position TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de servicios
CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  status service_status DEFAULT 'activo' NOT NULL,
  manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de cursos/capacitaciones
CREATE TABLE public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de certificaciones
CREATE TABLE public.certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  document_url TEXT,
  status certification_status DEFAULT 'vigente' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de homologaciones (cursos requeridos por empresa)
CREATE TABLE public.homologations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  is_required BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(company_id, course_id)
);

-- Tabla de asignación trabajador-servicio
CREATE TABLE public.worker_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status assignment_status DEFAULT 'activo' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de evaluaciones
CREATE TABLE public.evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  evaluator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  evaluation_type evaluation_type NOT NULL,
  score NUMERIC(5,2),
  date DATE NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de documentos
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type document_type NOT NULL,
  url TEXT NOT NULL,
  related_to TEXT NOT NULL, -- 'worker', 'company', 'service', etc.
  related_id UUID NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de logs de auditoría
CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  changes JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla de notificaciones
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_workers_dni ON public.workers(dni);
CREATE INDEX idx_workers_company ON public.workers(company_id);
CREATE INDEX idx_workers_status ON public.workers(status);
CREATE INDEX idx_certifications_worker ON public.certifications(worker_id);
CREATE INDEX idx_certifications_expiry ON public.certifications(expiry_date);
CREATE INDEX idx_certifications_status ON public.certifications(status);
CREATE INDEX idx_services_company ON public.services(company_id);
CREATE INDEX idx_worker_services_worker ON public.worker_services(worker_id);
CREATE INDEX idx_worker_services_service ON public.worker_services(service_id);
CREATE INDEX idx_evaluations_worker ON public.evaluations(worker_id);
CREATE INDEX idx_documents_related ON public.documents(related_to, related_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON public.workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homologations_updated_at BEFORE UPDATE ON public.homologations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_services_updated_at BEFORE UPDATE ON public.worker_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado de certificaciones automáticamente
CREATE OR REPLACE FUNCTION update_certification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date < CURRENT_DATE THEN
    NEW.status = 'vencido';
  ELSIF NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
    NEW.status = 'por_vencer';
  ELSE
    NEW.status = 'vigente';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certification_status_trigger
  BEFORE INSERT OR UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION update_certification_status();

-- Función para crear usuario en public.users al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (NEW.id, NEW.email, 'usuario', NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homologations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Políticas para workers (ejemplo - ajustar según necesidades)
CREATE POLICY "Everyone can view workers" ON public.workers
  FOR SELECT USING (true);

CREATE POLICY "RRHH and Admin can insert workers" ON public.workers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH and Admin can update workers" ON public.workers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "Only Admin can delete workers" ON public.workers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- DATOS DE EJEMPLO (SEEDS)
-- =====================================================

-- Insertar una empresa de ejemplo
INSERT INTO public.companies (name, description, cost_center, work_mode)
VALUES
  ('Compañía Minera Antamina', 'Unidad minera en Áncash', 'CC-001', 'presencial'),
  ('Minera Las Bambas', 'Unidad minera en Apurímac', 'CC-002', 'presencial');

-- Insertar cursos de ejemplo
INSERT INTO public.courses (name, description, duration_hours)
VALUES
  ('Seguridad en Minería', 'Curso básico de seguridad en operaciones mineras', 40),
  ('Manejo de Equipos Pesados', 'Certificación para operadores de maquinaria pesada', 80),
  ('Primeros Auxilios', 'Curso de primeros auxilios básicos', 16),
  ('Trabajo en Altura', 'Certificación para trabajo en altura', 24);

-- Nota: Para crear usuarios, deben registrarse a través de Supabase Auth
-- Los trabajadores se crearán desde la aplicación
