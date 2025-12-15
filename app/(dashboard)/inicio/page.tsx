"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building2,
  Award,
  Briefcase,
  ClipboardCheck,
  FileText,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Shield,
  Database,
  CheckCircle2,
} from "lucide-react"

export default function InicioPage() {
  const router = useRouter()
  const { profile } = useUser()

  const features = [
    {
      icon: Users,
      title: "Gestión de Personal",
      description: "Control completo de trabajadores, sus datos personales y profesionales",
      link: "/trabajadores",
      color: "text-brand-500",
      bgColor: "bg-brand-50",
    },
    {
      icon: Building2,
      title: "Empresas y Servicios",
      description: "Administra unidades mineras y los servicios que prestan",
      link: "/empresas",
      color: "text-info",
      bgColor: "bg-info-light/10",
    },
    {
      icon: Award,
      title: "Certificaciones",
      description: "Monitoreo de certificaciones, vencimientos y renovaciones",
      link: "/certificaciones",
      color: "text-warning",
      bgColor: "bg-warning-light/10",
    },
    {
      icon: BookOpen,
      title: "Cursos y Capacitaciones",
      description: "Catálogo de cursos y homologaciones por empresa",
      link: "/cursos",
      color: "text-success",
      bgColor: "bg-success-light/10",
    },
    {
      icon: ClipboardCheck,
      title: "Evaluaciones",
      description: "Registro y seguimiento de evaluaciones administrativas, médicas y RRHH",
      link: "/evaluaciones",
      color: "text-error",
      bgColor: "bg-error-light/10",
    },
    {
      icon: FileText,
      title: "Documentos",
      description: "Almacenamiento seguro de contratos, órdenes de servicio y certificados",
      link: "/documentos",
      color: "text-secondary",
      bgColor: "bg-muted",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Registra Empresas",
      description: "Comienza creando las unidades mineras con las que trabajas",
      icon: Building2,
    },
    {
      number: "02",
      title: "Agrega Personal",
      description: "Registra los trabajadores con toda su información personal y profesional",
      icon: Users,
    },
    {
      number: "03",
      title: "Crea Cursos",
      description: "Define el catálogo de cursos y certifica al personal",
      icon: BookOpen,
    },
    {
      number: "04",
      title: "Monitorea",
      description: "Revisa alertas de vencimientos y mantén actualizado el sistema",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="p-8 space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent rounded-2xl -z-10" />
        <div className="py-12 px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4">Sistema de Gestión de Personal Minero</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Bienvenido, {profile?.full_name || "Usuario"}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Gestiona de forma integral a tu personal, certificaciones, evaluaciones y documentos
              en un solo lugar. Con seguridad, control y trazabilidad completa.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/trabajadores")} size="lg">
                Gestionar Personal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline" size="lg">
                Ver Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How to Start */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Cómo Empezar</h2>
        <p className="text-muted-foreground mb-6">
          Sigue estos pasos para configurar tu sistema correctamente
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl font-bold text-brand-50 -mr-4 -mt-4">
                {step.number}
              </div>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5 text-brand-500" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Funcionalidades del Sistema</h2>
        <p className="text-muted-foreground mb-6">
          Explora todos los módulos disponibles para gestionar tu operación
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(feature.link)}
            >
              <CardHeader>
                <div className={`h-12 w-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  Ir al módulo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
