-- Migración: Agregar capacidades de servicio para trabajadores
-- Descripción: Permite definir qué servicios puede brindar cada trabajador

-- Crear tabla para capacidades de servicio de trabajadores
CREATE TABLE IF NOT EXISTS worker_service_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(20) DEFAULT 'basico' CHECK (proficiency_level IN ('basico', 'intermedio', 'avanzado', 'experto')),
  years_experience INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, service_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_worker_service_capabilities_worker_id ON worker_service_capabilities(worker_id);
CREATE INDEX idx_worker_service_capabilities_service_id ON worker_service_capabilities(service_id);
CREATE INDEX idx_worker_service_capabilities_proficiency ON worker_service_capabilities(proficiency_level);

-- Agregar comentarios
COMMENT ON TABLE worker_service_capabilities IS 'Define qué servicios puede brindar cada trabajador (capacidades/especialidades)';
COMMENT ON COLUMN worker_service_capabilities.worker_id IS 'ID del trabajador';
COMMENT ON COLUMN worker_service_capabilities.service_id IS 'ID del servicio que el trabajador puede brindar';
COMMENT ON COLUMN worker_service_capabilities.proficiency_level IS 'Nivel de competencia del trabajador en este servicio';
COMMENT ON COLUMN worker_service_capabilities.years_experience IS 'Años de experiencia en este servicio';

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_worker_service_capabilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_worker_service_capabilities_updated_at
  BEFORE UPDATE ON worker_service_capabilities
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_service_capabilities_updated_at();

-- Vista para consultar trabajadores por servicio
CREATE OR REPLACE VIEW workers_by_service_capability AS
SELECT
  wsc.id,
  wsc.service_id,
  s.name as service_name,
  wsc.worker_id,
  w.dni,
  w.full_name,
  w.position,
  w.company_id,
  c.name as company_name,
  w.is_homologated,
  w.homologation_type,
  w.homologation_status,
  w.homologation_expiry,
  wsc.proficiency_level,
  wsc.years_experience,
  wsc.notes
FROM worker_service_capabilities wsc
INNER JOIN workers w ON wsc.worker_id = w.id
INNER JOIN services s ON wsc.service_id = s.id
LEFT JOIN companies c ON w.company_id = c.id
WHERE w.status = 'habilitado'
ORDER BY wsc.proficiency_level DESC, wsc.years_experience DESC;

COMMENT ON VIEW workers_by_service_capability IS 'Vista de trabajadores con sus capacidades de servicio y nivel de competencia';
