"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import type { Certification, Worker, Course } from "@/types"

export type CertificationWithDetails = Certification & {
  worker?: Worker
  course?: Course
}

interface CertificationTableProps {
  data: CertificationWithDetails[]
  onView: (certification: Certification) => void
  onEdit: (certification: Certification) => void
  onDelete: (certification: Certification) => void
}

export function CertificationTable({
  data,
  onView,
  onEdit,
  onDelete,
}: CertificationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<CertificationWithDetails>[] = [
    {
      accessorKey: "worker",
      header: "Trabajador",
      cell: ({ row }) => {
        const worker = row.original.worker
        return worker ? (
          <div>
            <div className="font-medium">{worker.full_name}</div>
            <div className="text-xs text-muted-foreground font-mono">{worker.dni}</div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">Sin asignar</span>
        )
      },
    },
    {
      accessorKey: "course",
      header: "Curso",
      cell: ({ row }) => {
        const course = row.original.course
        return course ? (
          <span className="text-sm">{course.name}</span>
        ) : (
          <span className="text-sm text-muted-foreground italic">Sin asignar</span>
        )
      },
    },
    {
      accessorKey: "issue_date",
      header: "Fecha Emisión",
      cell: ({ row }) => {
        const date = row.getValue("issue_date") as string
        return (
          <span className="text-sm">
            {new Date(date).toLocaleDateString("es-PE")}
          </span>
        )
      },
    },
    {
      accessorKey: "expiry_date",
      header: "Fecha Vencimiento",
      cell: ({ row }) => {
        const date = row.getValue("expiry_date") as string
        return (
          <span className="text-sm">
            {new Date(date).toLocaleDateString("es-PE")}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as "vigente" | "por_vencer" | "vencido"
        const statusVariants = {
          vigente: "success",
          por_vencer: "warning",
          vencido: "error"
        } as const

        const statusLabels = {
          vigente: "Vigente",
          por_vencer: "Por Vencer",
          vencido: "Vencido"
        }

        return (
          <Badge variant={statusVariants[status]}>
            {statusLabels[status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const certification = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(certification)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(certification)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(certification)}
            >
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por trabajador, curso..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="vigente">Vigente</SelectItem>
            <SelectItem value="por_vencer">Por Vencer</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron certificaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {data.length} certificaciones
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
