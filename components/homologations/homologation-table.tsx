"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import type { Homologation, Company, Course } from "@/types"

export type HomologationWithDetails = Homologation & {
  company?: Company
  course?: Course
}

interface HomologationTableProps {
  data: HomologationWithDetails[]
  onView: (homologation: Homologation) => void
  onEdit: (homologation: Homologation) => void
  onDelete: (homologation: Homologation) => void
}

export function HomologationTable({ data, onView, onEdit, onDelete }: HomologationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [requiredFilter, setRequiredFilter] = useState<string>("all")

  const columns: ColumnDef<HomologationWithDetails>[] = [
    {
      accessorKey: "company",
      header: "Empresa",
      cell: ({ row }) => {
        const company = row.original.company
        return <div className="font-medium">{company?.name || "Sin asignar"}</div>
      },
      filterFn: (row, id, value) => {
        return row.original.company?.name?.toLowerCase().includes(value.toLowerCase()) ?? false
      },
    },
    {
      accessorKey: "course",
      header: "Curso",
      cell: ({ row }) => {
        const course = row.original.course
        return (
          <div>
            <div className="font-medium">{course?.name || "Sin asignar"}</div>
            {course?.duration_hours && (
              <div className="text-xs text-muted-foreground">
                {course.duration_hours} {course.duration_hours === 1 ? "hora" : "horas"}
              </div>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return row.original.course?.name?.toLowerCase().includes(value.toLowerCase()) ?? false
      },
    },
    {
      accessorKey: "is_required",
      header: "Estado",
      cell: ({ row }) => {
        const isRequired = row.getValue("is_required") as boolean
        return (
          <Badge variant={isRequired ? "warning" : "secondary"}>
            {isRequired ? "Obligatorio" : "Opcional"}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        return row.getValue(id) === (value === "required")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const homologation = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(homologation)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(homologation)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(homologation)}
                className="cursor-pointer text-error focus:text-error"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredData = requiredFilter === "all"
    ? data
    : data.filter((h) => requiredFilter === "required" ? h.is_required : !h.is_required)

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar homologaciones..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={requiredFilter} onValueChange={setRequiredFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="required">Obligatorios</SelectItem>
            <SelectItem value="optional">Opcionales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron homologaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} homologación(es) encontrada(s)
        </div>
        <div className="flex items-center space-x-2">
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
