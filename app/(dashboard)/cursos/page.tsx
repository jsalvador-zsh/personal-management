"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, GraduationCap, Loader2 } from "lucide-react"
import { CourseTable } from "@/components/courses/course-table"
import { CourseFormDialog } from "@/components/courses/course-form-dialog"
import { CourseDetailDialog } from "@/components/courses/course-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Course } from "@/types"
import type { CourseFormData } from "@/lib/validations/course"
import { toast } from "sonner"

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setCourses(data || [])
    } catch (error: any) {
      console.error("Error fetching courses:", error)
      toast.error("Error al cargar los cursos")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CourseFormData) => {
    setActionLoading(true)
    try {
      const courseData = {
        name: data.name,
        description: data.description || null,
        duration_hours: data.duration_hours,
      }

      const { error } = await (supabase.from("courses") as any).insert(courseData).select()

      if (error) throw error

      toast.success("Curso creado exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating course:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear cursos")
      } else {
        toast.error(`Error: ${error.message || "Error al crear el curso"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: CourseFormData) => {
    if (!selectedCourse) return

    setActionLoading(true)
    try {
      const courseData = {
        name: data.name,
        description: data.description || null,
        duration_hours: data.duration_hours,
      }

      const { error } = await (supabase
        .from("courses") as any)
        .update(courseData)
        .eq("id", selectedCourse.id)

      if (error) throw error

      toast.success("Curso actualizado exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedCourse(null)
    } catch (error: any) {
      console.error("Error updating course:", error)
      toast.error(`Error: ${error.message || "Error al actualizar el curso"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCourse) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", selectedCourse.id)

      if (error) throw error

      toast.success("Curso eliminado exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedCourse(null)
    } catch (error: any) {
      console.error("Error deleting course:", error)
      if (error.message?.includes("violates foreign key constraint")) {
        toast.error("No se puede eliminar el curso porque tiene certificaciones asociadas")
      } else {
        toast.error("Error al eliminar el curso")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (course: Course) => {
    setSelectedCourse(course)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Administra los cursos y capacitaciones disponibles
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Lista de Cursos ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CourseTable
            data={courses}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CourseFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      {/* Edit Dialog */}
      <CourseFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        course={selectedCourse}
        isLoading={actionLoading}
      />

      {/* Detail Dialog */}
      <CourseDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        course={selectedCourse}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso{" "}
              <strong>{selectedCourse?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
