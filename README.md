# Sistema de Gestión de Personal

Sistema integral de gestión de operaciones y asignación de personal para unidades mineras. Permite gestionar trabajadores, certificaciones, evaluaciones, servicios y generar reportes con KPIs en tiempo real.

## 🚀 Características Principales

- ✅ **Gestión de Trabajadores**: CRUD completo, perfil individual, historial de servicios
- ✅ **Gestión de Cursos y Certificaciones**: Control de vencimientos, alertas automáticas
- ✅ **Gestión de Empresas**: Múltiples unidades mineras, órdenes de servicio
- ✅ **Gestión de Servicios**: Catálogo de servicios, asignación de personal
- ✅ **Sistema de Evaluaciones**: Por diferentes roles (Admin, RRHH, Médico)
- ✅ **Dashboards y KPIs**: Métricas en tiempo real con gráficos interactivos
- ✅ **Reportes**: Exportación a Excel y PDF
- ✅ **Sistema de Roles y Permisos**: 5 niveles de acceso
- ✅ **Gestión Documental**: Repositorio de certificados y contratos
- ✅ **Notificaciones**: Alertas automáticas de certificaciones por vencer

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS (paleta de Supabase)
- **Language**: TypeScript
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table v8
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **API**: Next.js API Routes + Server Actions

### Utilidades
- **Excel**: xlsx (SheetJS)
- **PDF**: jsPDF + jsPDF-AutoTable
- **Validation**: Zod
- **Date**: date-fns

## 📁 Estructura del Proyecto

```
personal-management/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── workers/          # Gestión de trabajadores
│   │   ├── companies/        # Gestión de empresas
│   │   ├── services/         # Gestión de servicios
│   │   ├── courses/          # Gestión de cursos
│   │   ├── evaluations/      # Evaluaciones
│   │   ├── reports/          # Reportes
│   │   ├── documents/        # Documentos
│   │   └── settings/         # Configuración
│   ├── api/                  # API Routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Shadcn components
│   ├── layouts/              # Layouts principales
│   ├── dashboard/            # Componentes del dashboard
│   ├── forms/                # Formularios reutilizables
│   ├── tables/               # Tablas de datos
│   ├── charts/               # Gráficos
│   └── providers/            # Context providers
├── lib/
│   ├── supabase/             # Configuración de Supabase
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils/                # Utilidades
│   ├── validations/          # Esquemas de validación Zod
│   ├── constants/            # Constantes
│   └── fonts.ts
├── hooks/                    # Custom React hooks
├── store/                    # Zustand stores
├── types/                    # TypeScript types
│   ├── database.ts
│   └── index.ts
├── public/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── middleware.ts             # Auth middleware
└── package.json
```

## 🎨 Diseño Visual

El sistema utiliza la paleta de colores de Supabase:
- **Verde principal**: `#6ee7b7`
- **Tema oscuro** por defecto con opción de tema claro
- **Fuente**: Circular Std Medium (500)
- **Estilo**: Moderno, minimalista, profesional

## 🔐 Roles de Usuario

1. **Administrador**: Acceso total al sistema
2. **RRHH**: Gestión de personal, evaluaciones
3. **Médico**: Evaluaciones médicas
4. **Supervisor**: Consulta y reportes
5. **Usuario**: Visualización limitada

## 📊 Base de Datos

### Tablas Principales

- `users` - Usuarios del sistema
- `workers` - Trabajadores
- `companies` - Empresas/Unidades mineras
- `services` - Servicios ofrecidos
- `courses` - Cursos y capacitaciones
- `certifications` - Certificaciones de trabajadores
- `homologations` - Homologaciones por unidad minera
- `worker_services` - Asignación trabajador-servicio
- `evaluations` - Evaluaciones de personal
- `documents` - Repositorio documental
- `audit_logs` - Logs de auditoría
- `notifications` - Notificaciones del sistema

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd personal-management
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

4. **Crear las tablas en Supabase**
- Ejecutar las migraciones SQL en el dashboard de Supabase
- Configurar las políticas RLS (Row Level Security)

5. **Ejecutar el proyecto**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## 🔧 Configuración de Supabase

### Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar la URL y las API keys
4. Ejecutar las migraciones SQL para crear las tablas

### Row Level Security (RLS)

Configurar políticas RLS en Supabase para cada tabla según los roles:
- Admin: acceso total
- RRHH: lectura/escritura en workers, evaluations
- Médico: lectura/escritura en evaluations (tipo médico)
- Supervisor: solo lectura
- Usuario: lectura limitada

## 📈 Próximas Funcionalidades

- [ ] Importación masiva desde Excel
- [ ] Notificaciones por email
- [ ] Dashboards personalizables
- [ ] Exportación de gráficos
- [ ] Multi-idioma (i18n)
- [ ] Modo offline
- [ ] App móvil (React Native)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para soporte técnico, contactar a [tu-email@ejemplo.com]

---

**Desarrollado con ❤️ usando Next.js, Supabase y Shadcn/ui**
