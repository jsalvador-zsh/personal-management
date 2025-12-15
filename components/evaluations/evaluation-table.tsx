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
import { MoreHorizontal, Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react"
import type { Evaluation, Worker, User } from "@/types"

export type EvaluationWithDetails = Evaluation & {
  worker?: Worker
  evaluator?: User
}

interface EvaluationTableProps {
  data: EvaluationWithDetails[]
  onView: (evaluation: Evaluation) => void
  onEdit: (evaluation: Evaluation) => void
  onDelete: (evaluation: Evaluation) => void
}

const typeLabels = {
  admin: "Administrativa",
  medico: "Médica",
  rrhh: "RRHH",
} as const

export function EvaluationTable({ data, onView, onEdit, onDelete }: EvaluationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const columns: ColumnDef<EvaluationWithDetails>[] = [
    {
      accessorKey: "worker",
      header: "Trabajador",
      cell: ({ row }) => {
        const worker = row.original.worker
        return (
          <div>
            <div className="font-medium">{worker?.full_name || "Sin asignar"}</div>
            {worker?.dni && (
              <div className="text-xs text-muted-foreground">{worker.dni}</div>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return row.original.worker?.full_name?.toLowerCase().includes(value.toLowerCase()) ?? false
      },
    },
    {
      accessorKey: "evaluation_type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.getValue("evaluation_type") as "admin" | "medico" | "rrhh"
        const typeVariants = {
          admin: "secondary",
          medico: "info",
          rrhh: "warning",
        } as const
        return <Badge variant={typeVariants[type]}>{typeLabels[type]}</Badge>
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: "score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Puntuación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue("score") as number | null
        if (score === null) return <span className="text-muted-foreground italic">Sin puntaje</span>
        return <div className="font-medium">{score} / 100</div>
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("date") as string
        return (
          <div className="text-sm">
            {new Date(date).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )
      },
    },
    {
      accessorKey: "evaluator",
      header: "Evaluador",
      cell: ({ row }) => {
        const evaluator = row.original.evaluator
        return (
          <div className="text-sm">
            {evaluator ? evaluator.email : <span className="text-muted-foreground italic">Sin asignar</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "comments",
      header: "Comentarios",
      cell: ({ row }) => {
        const comments = row.getValue("comments") as string | null
        return (
          <div className="max-w-[200px] truncate text-sm text-muted-foreground">
            {comments || "Sin comentarios"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const evaluation = row.original

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
              <DropdownMenuItem onClick={() => onView(evaluation)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(evaluation)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(evaluation)}
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

  const filteredData = typeFilter === "all"
    ? data
    : data.filter((evaluation) => evaluation.evaluation_type === typeFilter)

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
          placeholder="Buscar evaluaciones..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="admin">Administrativa</SelectItem>
            <SelectItem value="medico">Médica</SelectItem>
            <SelectItem value="rrhh">RRHH</SelectItem>
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
                  No se encontraron evaluaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} evaluación(es) encontrada(s)
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
