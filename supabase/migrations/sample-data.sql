-- ============================================================================
-- DATOS DE PRUEBA BASADOS EN MODELO EXCEL ZABALA
-- ============================================================================

-- ============================================================================
-- EMPRESA (Cliente Principal)
-- ============================================================================
INSERT INTO companies (name, description, work_mode, cost_center) VALUES
('COMPAÑIA MINERA ANTAMINA S.A.', 'Unidad minera principal - Cliente', 'presencial', 'OP 2212-035');

-- ============================================================================
-- SERVICIOS
-- ============================================================================
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio de Soporte y Mantenimiento de Red de Comunicaciones',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Supervisión Técnica de Cobertura en Zona Sur',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio Mantenimiento Preventivo Equipos Flota Pesada (PM)',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Supervisión Cobertura Valle Fortaleza',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio de mantenimiento Itrack 80 cami',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio de Soporte Red de Control',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Administración Operativa de Infraestructura de Servidores y Bases de Datos de Antamina',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio de Servidores, Base de Datos y Ciberseguridad',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio de Soporte para Red de Control y Monitoreo',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio Integral de Servidores, Base de Datos y Ciberseguridad',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Administración y Mantenimiento de Infraestructura de Telecomunicaciones',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Servicio Técnico de Mantenimiento Itrack para 80 Camiones',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');
INSERT INTO services (name, company_id, status, description) VALUES
('Supervisión Operativa de Cobertura en Áreas Críticas',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1),
 'activo',
 'Servicio de telecomunicaciones y soporte técnico');

-- ============================================================================
-- CURSOS (Ejemplos basados en el contexto minero)
-- ============================================================================
INSERT INTO courses (name, description, duration_hours) VALUES
('Seguridad en Operaciones Mineras', 'Curso obligatorio de seguridad para operaciones en mina', 40),
('Telecomunicaciones en Minería', 'Fundamentos de sistemas de telecomunicaciones en entornos mineros', 32),
('Mantenimiento de Equipos de Flota Pesada', 'Procedimientos de mantenimiento preventivo y correctivo', 48),
('Gestión de Servidores y Bases de Datos', 'Administración de infraestructura IT en entornos críticos', 56),
('Ciberseguridad Industrial', 'Protección de sistemas de control industrial', 24),
('Itrack y Sistemas de Monitoreo', 'Operación y mantenimiento de sistemas de tracking', 16);

-- ============================================================================
-- TRABAJADORES
-- ============================================================================
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('SURCO LAGOS WILFREDO SEBASTIÁN', '70000000', 'wilfredo.sebastián.surco@electrodata.com.pe', '+51 900 000 100',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('RECURSOS HUMANOS', '70000001', 'recursos.humanos@electrodata.com.pe', '+51 900 000 101',
 'TÉCNICO DE TELECOMUNICACIONES', 'inhabilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('GUTIERREZ VALERO WILLY ADRIAN', '70000002', 'willy.adrian.gutierrez@electrodata.com.pe', '+51 900 000 102',
 'SUPERVISOR DE SEGURIDAD', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('TALENTO HUMANO ', '70000003', 'talento.humano@electrodata.com.pe', '+51 900 000 103',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('PUMA QUIROZ PEDRO JUAN', '70000004', 'pedro.juan.puma@electrodata.com.pe', '+51 900 000 104',
 'TÉCNICO DE TELECOMUNICACIONES', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('LISTA DE COLABORADORES', '70000005', 'de.colaboradores.lista@electrodata.com.pe', '+51 900 000 105',
 'SUPERVISOR DE OPERACIONES', 'inhabilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('MI PERFIL ', '70000006', 'mi.perfil@electrodata.com.pe', '+51 900 000 106',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('NUÑEZ PACHECO ALEXANDER', '70000007', 'pacheco.alexander.nuñez@electrodata.com.pe', '+51 900 000 107',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('FERNANDEZ ROJAS RAISA LIDIA', '70000008', 'raisa.lidia.fernandez@electrodata.com.pe', '+51 900 000 108',
 'GESTOR DE SERVICIOS', 'inhabilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('GONZÁLES RENZO ALEXIS', '70000009', 'renzo.alexis.gonzáles@electrodata.com.pe', '+51 900 000 109',
 'TÉCNICO DE TELECOMUNICACIONES', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('EVALUACION PERSONAL', '70000010', 'evaluacion.personal@electrodata.com.pe', '+51 900 000 110',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('CATACHURA TITI WILBER', '70000011', 'titi.wilber.catachura@electrodata.com.pe', '+51 900 000 111',
 'ANALISTA DE INFRAESTRUCTURA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('HUAMAN CALCINA KAREN ROSARIO', '70000012', 'karen.rosario.huaman@electrodata.com.pe', '+51 900 000 112',
 'ASISTENTE ADMINISTRATIVA', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('LEON CHÁVEZ ESTEFANY', '70000013', 'chávez.estefany.leon@electrodata.com.pe', '+51 900 000 113',
 'ADMINISTRADOR DE CONTRATOS', 'habilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));
INSERT INTO workers (full_name, dni, email, phone, position, status, company_id) VALUES
('MANRIQUE LUNA VALENTIN ARNULFO', '70000014', 'valentin.arnulfo.manrique@electrodata.com.pe', '+51 900 000 114',
 'TÉCNICO DE TELECOMUNICACIONES', 'inhabilitado',
 (SELECT id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1));

-- ============================================================================
-- CERTIFICACIONES (Ejemplos)
-- ============================================================================
-- Asignar certificaciones a los primeros 10 trabajadores
DO $$
DECLARE
    worker_record RECORD;
    course_record RECORD;
    issue_date DATE;
    expiry_date DATE;
BEGIN
    FOR worker_record IN (SELECT id FROM workers LIMIT 10)
    LOOP
        FOR course_record IN (SELECT id FROM courses ORDER BY RANDOM() LIMIT 2)
        LOOP
            issue_date := CURRENT_DATE - (RANDOM() * 365)::INTEGER;
            expiry_date := issue_date + INTERVAL '1 year';

            INSERT INTO certifications (worker_id, course_id, issue_date, expiry_date)
            VALUES (worker_record.id, course_record.id, issue_date, expiry_date);
        END LOOP;
    END LOOP;
END $$;

-- ============================================================================
-- EVALUACIONES (Ejemplos)
-- ============================================================================
DO $$
DECLARE
    worker_record RECORD;
    evaluator_id UUID;
    eval_types TEXT[] := ARRAY['admin', 'medico', 'rrhh'];
    eval_type TEXT;
BEGIN
    -- Obtener un evaluador (el primer usuario admin)
    SELECT id INTO evaluator_id FROM users WHERE role = 'admin' LIMIT 1;

    IF evaluator_id IS NOT NULL THEN
        FOR worker_record IN (SELECT id FROM workers LIMIT 10)
        LOOP
            eval_type := eval_types[1 + FLOOR(RANDOM() * 3)::INTEGER];

            INSERT INTO evaluations (worker_id, evaluator_id, evaluation_type, score, date, comments)
            VALUES (
                worker_record.id,
                evaluator_id,
                eval_type::evaluation_type,
                70 + (RANDOM() * 30)::INTEGER,
                CURRENT_DATE - (RANDOM() * 180)::INTEGER,
                'Evaluación realizada correctamente. Personal cumple con estándares.'
            );
        END LOOP;
    END IF;
END $$;

-- ============================================================================
-- HOMOLOGACIONES (Cursos obligatorios por empresa)
-- ============================================================================
DO $$
DECLARE
    company_id UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO company_id FROM companies WHERE name = 'COMPAÑIA MINERA ANTAMINA S.A.' LIMIT 1;

    IF company_id IS NOT NULL THEN
        FOR course_record IN (SELECT id FROM courses WHERE name LIKE '%Seguridad%' OR name LIKE '%Ciberseguridad%')
        LOOP
            INSERT INTO homologations (company_id, course_id, is_required)
            VALUES (company_id, course_record.id, true)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;
END $$;

COMMIT;
