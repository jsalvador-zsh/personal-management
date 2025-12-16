-- Migración: Agregar campos de homologación a workers
-- Descripción: Agrega campos para gestionar homologaciones con tipos y campos condicionales

-- Crear enum para tipos de homologación
CREATE TYPE homologation_type AS ENUM (
  'medica',           -- Homologación médica
  'ocupacional',      -- Homologación ocupacional
  'seguridad',        -- Homologación de seguridad
  'tecnica',          -- Homologación técnica
  'especial'          -- Homologación especial (color #875A7B)
);

-- Agregar columnas de homologación a workers
ALTER TABLE workers
ADD COLUMN is_homologated BOOLEAN DEFAULT false,
ADD COLUMN homologation_type homologation_type NULL,
ADD COLUMN homologation_date DATE NULL,
ADD COLUMN homologation_expiry DATE NULL,
ADD COLUMN homologation_entity VARCHAR(255) NULL,
ADD COLUMN homologation_certificate_number VARCHAR(100) NULL,
ADD COLUMN homologation_document_url TEXT NULL,

-- Campos específicos para homologación médica
ADD COLUMN medical_restrictions TEXT NULL,
ADD COLUMN medical_observations TEXT NULL,
ADD COLUMN blood_type VARCHAR(10) NULL,

-- Campos específicos para homologación ocupacional
ADD COLUMN occupational_level VARCHAR(50) NULL,
ADD COLUMN occupational_specialization VARCHAR(100) NULL,

-- Campos específicos para homologación de seguridad
ADD COLUMN safety_training_hours INTEGER NULL,
ADD COLUMN safety_certifications TEXT[] NULL,

-- Campos específicos para homologación técnica
ADD COLUMN technical_skills TEXT[] NULL,
ADD COLUMN technical_equipment_authorized TEXT[] NULL,

-- Campos específicos para homologación especial
ADD COLUMN special_authorization_number VARCHAR(100) NULL,
ADD COLUMN special_authorization_scope TEXT NULL,
ADD COLUMN special_restrictions TEXT NULL,

-- Estado de la homologación
ADD COLUMN homologation_status VARCHAR(20) DEFAULT 'pendiente' CHECK (homologation_status IN ('pendiente', 'vigente', 'vencida', 'suspendida')),
ADD COLUMN homologation_notes TEXT NULL;

-- Crear índices para mejorar el rendimiento de búsquedas
CREATE INDEX idx_workers_homologation_type ON workers(homologation_type) WHERE homologation_type IS NOT NULL;
CREATE INDEX idx_workers_homologation_status ON workers(homologation_status);
CREATE INDEX idx_workers_homologation_expiry ON workers(homologation_expiry) WHERE homologation_expiry IS NOT NULL;
CREATE INDEX idx_workers_is_homologated ON workers(is_homologated);

-- Agregar comentarios a las columnas
COMMENT ON COLUMN workers.is_homologated IS 'Indica si el trabajador tiene homologación activa';
COMMENT ON COLUMN workers.homologation_type IS 'Tipo de homologación: medica, ocupacional, seguridad, tecnica, especial';
COMMENT ON COLUMN workers.homologation_date IS 'Fecha de emisión de la homologación';
COMMENT ON COLUMN workers.homologation_expiry IS 'Fecha de vencimiento de la homologación';
COMMENT ON COLUMN workers.homologation_status IS 'Estado actual de la homologación';

-- Trigger para actualizar automáticamente is_homologated
CREATE OR REPLACE FUNCTION update_worker_homologation_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si tiene fecha de vencimiento y está vencida, marcar como no homologado
  IF NEW.homologation_expiry IS NOT NULL AND NEW.homologation_expiry < CURRENT_DATE THEN
    NEW.is_homologated := false;
    NEW.homologation_status := 'vencida';
  -- Si tiene todos los campos necesarios y no está vencida, marcar como homologado
  ELSIF NEW.homologation_type IS NOT NULL
    AND NEW.homologation_date IS NOT NULL
    AND (NEW.homologation_expiry IS NULL OR NEW.homologation_expiry >= CURRENT_DATE) THEN
    NEW.is_homologated := true;
    IF NEW.homologation_status = 'pendiente' OR NEW.homologation_status = 'vencida' THEN
      NEW.homologation_status := 'vigente';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_worker_homologation_status
  BEFORE INSERT OR UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_homologation_status();

-- Vista para consultar trabajadores homologados por empresa
CREATE OR REPLACE VIEW homologated_workers_by_company AS
SELECT
  w.id,
  w.dni,
  w.full_name,
  w.company_id,
  c.name as company_name,
  w.homologation_type,
  w.homologation_status,
  w.homologation_date,
  w.homologation_expiry,
  w.homologation_entity,
  CASE
    WHEN w.homologation_expiry IS NOT NULL THEN
      w.homologation_expiry - CURRENT_DATE
    ELSE NULL
  END as days_until_expiry
FROM workers w
LEFT JOIN companies c ON w.company_id = c.id
WHERE w.is_homologated = true
ORDER BY w.homologation_expiry ASC NULLS LAST;

COMMENT ON VIEW homologated_workers_by_company IS 'Vista de trabajadores homologados con información de empresa y días hasta vencimiento';
