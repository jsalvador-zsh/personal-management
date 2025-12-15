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
import { Plus, FileText, Loader2 } from "lucide-react"
import { DocumentTable } from "@/components/documents/document-table"
import { DocumentFormDialog } from "@/components/documents/document-form-dialog"
import { DocumentDetailDialog, type DocumentWithDetails } from "@/components/documents/document-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Document } from "@/types"
import type { DocumentFormData } from "@/lib/validations/document"
import { toast } from "sonner"

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<DocumentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithDetails | null>(null)

  const supabase = createClient()

  useEffect(() => {
    getCurrentUser()
    fetchData()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          creator:users!documents_created_by_fkey(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error: any) {
      console.error("Error fetching documents:", error)
      toast.error("Error al cargar los documentos")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: DocumentFormData) => {
    setActionLoading(true)
    try {
      const documentData = {
        name: data.name,
        type: data.type,
        url: data.url,
        related_to: data.related_to,
        related_id: data.related_id,
        created_by: currentUserId,
      }

      const { error } = await (supabase.from("documents") as any).insert(documentData).select()
      if (error) throw error

      toast.success("Documento creado exitosamente")
      await fetchData()
      setCreateDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating document:", error)
      if (error.message?.includes("violates row-level security")) {
        toast.error("No tienes permisos para crear documentos")
      } else {
        toast.error(`Error: ${error.message || "Error al crear el documento"}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (data: DocumentFormData) => {
    if (!selectedDocument) return

    setActionLoading(true)
    try {
      const documentData = {
        name: data.name,
        type: data.type,
        url: data.url,
        related_to: data.related_to,
        related_id: data.related_id,
      }

      const { error } = await (supabase
        .from("documents") as any)
        .update(documentData)
        .eq("id", selectedDocument.id)

      if (error) throw error

      toast.success("Documento actualizado exitosamente")
      await fetchData()
      setEditDialogOpen(false)
      setSelectedDocument(null)
    } catch (error: any) {
      console.error("Error updating document:", error)
      toast.error(`Error: ${error.message || "Error al actualizar el documento"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDocument) return

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", selectedDocument.id)

      if (error) throw error

      toast.success("Documento eliminado exitosamente")
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedDocument(null)
    } catch (error: any) {
      console.error("Error deleting document:", error)
      toast.error("Error al eliminar el documento")
    } finally {
      setActionLoading(false)
    }
  }

  const openViewDialog = (document: Document) => {
    const docWithDetails = documents.find((d) => d.id === document.id)
    setSelectedDocument(docWithDetails || null)
    setDetailDialogOpen(true)
  }

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document as DocumentWithDetails)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document as DocumentWithDetails)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando documentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Repositorio de Documentos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona certificados, contratos y archivos
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2" disabled={!currentUserId}>
          <Plus className="h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Documentos ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentTable
            data={documents}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {currentUserId && (
        <>
          <DocumentFormDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onSubmit={handleCreate}
            isLoading={actionLoading}
            currentUserId={currentUserId}
          />

          <DocumentFormDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleEdit}
            document={selectedDocument}
            isLoading={actionLoading}
            currentUserId={currentUserId}
          />
        </>
      )}

      <DocumentDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        document={selectedDocument}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el documento <strong>{selectedDocument?.name}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
