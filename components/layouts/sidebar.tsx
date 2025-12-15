"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  GitMerge,
  ClipboardCheck,
  FileText,
  UserCog,
  Bell
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/types/database"

interface SidebarProps {
  userRole?: UserRole
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: UserRole[]
}

export function Sidebar({ userRole = 'usuario' }: SidebarProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: "/inicio",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/trabajadores",
      label: "Trabajadores",
      icon: Users,
    },
    {
      href: "/empresas",
      label: "Empresas",
      icon: Building2,
    },
    {
      href: "/servicios",
      label: "Servicios",
      icon: Briefcase,
    },
    {
      href: "/cursos",
      label: "Cursos",
      icon: GraduationCap,
    },
    {
      href: "/certificaciones",
      label: "Certificaciones",
      icon: Award,
    },
    {
      href: "/homologaciones",
      label: "Homologaciones",
      icon: GitMerge,
    },
    {
      href: "/evaluaciones",
      label: "Evaluaciones",
      icon: ClipboardCheck,
      roles: ['admin', 'rrhh', 'medico'],
    },
    {
      href: "/documentos",
      label: "Documentos",
      icon: FileText,
    },
    {
      href: "/usuarios",
      label: "Usuarios",
      icon: UserCog,
      roles: ['admin'],
    },
    {
      href: "/notificaciones",
      label: "Notificaciones",
      icon: Bell,
      badge: 0,
    },
  ]

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/inicio" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">
              Gestión <span className="text-brand">Personal</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="h-5 min-w-[20px] px-1 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-brand/5 p-3">
            <p className="text-xs font-medium text-brand">Sistema v1.0</p>
            <p className="text-xs text-muted-foreground">
              Gestión de Personal Minero
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
