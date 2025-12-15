-- ============================================================================
-- AGREGAR CAMPOS EXTENDIDOS A LA TABLA WORKERS
-- Basado en el análisis del Excel "BBDD individual"
-- ============================================================================

-- Información Personal
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS pais VARCHAR(100),
ADD COLUMN IF NOT EXISTS sexo VARCHAR(20),
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50),
ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
ADD COLUMN IF NOT EXISTS correo_personal VARCHAR(255),
ADD COLUMN IF NOT EXISTS domicilio TEXT,
ADD COLUMN IF NOT EXISTS telefono_fijo VARCHAR(20);

-- Información Profesional
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS carrera_profesional VARCHAR(255),
ADD COLUMN IF NOT EXISTS fecha_inicio DATE,
ADD COLUMN IF NOT EXISTS fecha_cese DATE,
ADD COLUMN IF NOT EXISTS sitio VARCHAR(100),
ADD COLUMN IF NOT EXISTS area VARCHAR(100),
ADD COLUMN IF NOT EXISTS local VARCHAR(100),
ADD COLUMN IF NOT EXISTS condiciones_trabajo VARCHAR(100);

-- Agregar comentarios para documentación
COMMENT ON COLUMN workers.pais IS 'País de origen del trabajador';
COMMENT ON COLUMN workers.sexo IS 'Género: Masculino, Femenino, Otro';
COMMENT ON COLUMN workers.estado_civil IS 'Estado civil: Soltero, Casado, Divorciado, Viudo';
COMMENT ON COLUMN workers.fecha_nacimiento IS 'Fecha de nacimiento del trabajador';
COMMENT ON COLUMN workers.correo_personal IS 'Email personal (adicional al corporativo)';
COMMENT ON COLUMN workers.domicilio IS 'Dirección de domicilio completa';
COMMENT ON COLUMN workers.telefono_fijo IS 'Número de teléfono fijo';
COMMENT ON COLUMN workers.carrera_profesional IS 'Formación académica o profesión';
COMMENT ON COLUMN workers.fecha_inicio IS 'Fecha de inicio en la empresa';
COMMENT ON COLUMN workers.fecha_cese IS 'Fecha de cese (NULL si está activo)';
COMMENT ON COLUMN workers.sitio IS 'Sitio o ubicación de trabajo';
COMMENT ON COLUMN workers.area IS 'Área de trabajo';
COMMENT ON COLUMN workers.local IS 'Local o sede de trabajo';
COMMENT ON COLUMN workers.condiciones_trabajo IS 'Tipo de contrato o condiciones laborales';

-- Índices para mejorar performance en búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_workers_fecha_inicio ON workers(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_workers_area ON workers(area);
CREATE INDEX IF NOT EXISTS idx_workers_sitio ON workers(sitio);
CREATE INDEX IF NOT EXISTS idx_workers_sexo ON workers(sexo);
