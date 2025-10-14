"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconAlertTriangle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

// ----------------------
// Schema & Example Data
// ----------------------
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  status: z.string(),
  accuracy: z.string(),
  latency: z.string(),
  owner: z.string(),
  lastRunStatus: z.string(),
  nextRunTime: z.string(),
})

const sampleData: z.infer<typeof schema>[] = [
  {
    id: 1,
    name: "Invoice Processor",
    role: "Document Parser",
    status: "Active",
    accuracy: "94.2%",
    latency: "1.8s",
    owner: "Jamik Tashpulatov",
    lastRunStatus: "Success",
    nextRunTime: "Today, 15:00",
  },
  {
    id: 2,
    name: "Sales Agent",
    role: "Leads Generation Bot",
    status: "Idle",
    accuracy: "89.4%",
    latency: "2.2s",
    owner: "Eddie Lake",
    lastRunStatus: "Failed",
    nextRunTime: "Today, 16:45",
  },
  {
    id: 3,
    name: "CodeAssist-01",
    role: "Code Helper",
    status: "Error",
    accuracy: "—",
    latency: "—",
    owner: "Emily Whalen",
    lastRunStatus: "Pending",
    nextRunTime: "Tomorrow, 09:00",
  },
]

// ----------------------
// Drag Handle
// ----------------------
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
      <IconGripVertical className="size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// ----------------------
// Table Columns
// ----------------------
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Agent",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const color =
        status === "Active"
          ? "bg-green-500"
          : status === "Idle"
          ? "bg-yellow-500"
          : "bg-red-500"
      return (
        <Badge variant="outline" className="px-2">
          <span className={`mr-2 size-2 rounded-full ${color}`} />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "accuracy",
    header: "Accuracy",
    cell: ({ row }) => <div>{row.original.accuracy}</div>,
  },
  {
    accessorKey: "latency",
    header: "Latency",
    cell: ({ row }) => <div>{row.original.latency}</div>,
  },
  {
    accessorKey: "lastRunStatus",
    header: "Last Run",
    cell: ({ row }) => {
      const status = row.original.lastRunStatus
      const color =
        status === "Success"
          ? "text-green-600 dark:text-green-400"
          : status === "Failed"
          ? "text-red-600 dark:text-red-400"
          : "text-muted-foreground"
      const icon =
        status === "Success" ? (
          <IconCircleCheckFilled className="size-4 text-green-500" />
        ) : status === "Failed" ? (
          <IconAlertTriangle className="size-4 text-red-500" />
        ) : (
          <IconLoader className="size-4 text-muted-foreground" />
        )
      return (
        <div className="flex items-center gap-2">
          {icon}
          <span className={`font-medium ${color}`}>{status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "nextRunTime",
    header: "Next Run",
    cell: ({ row }) => <div className="text-left font-semibold text-foreground">{row.original.nextRunTime}</div>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <Select defaultValue={row.original.owner}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Assign owner" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
          <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
          <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Logs</DropdownMenuItem>
          <DropdownMenuItem>Retrain</DropdownMenuItem>
          <DropdownMenuItem>Disable</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ----------------------
// Draggable Row
// ----------------------
function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })
  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

// ----------------------
// Main Table Component
// ----------------------
export function DataTable() {
  const [data, setData] = React.useState(() => sampleData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map(({ id }) => id), [data])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs defaultValue="overview" className="w-full flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" size="sm">
            <IconPlus />
            Start Agent
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  )
}

// ----------------------
// Drawer for Agent Details
// ----------------------
const chartData = [
  { time: "00:00", accuracy: 90 },
  { time: "06:00", accuracy: 92 },
  { time: "12:00", accuracy: 95 },
  { time: "18:00", accuracy: 94 },
  { time: "24:00", accuracy: 96 },
]

const chartConfig = {
  accuracy: { label: "Accuracy", color: "var(--primary)" },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Last run: <span className="font-medium">{item.lastRunStatus}</span> · Next scheduled run:{" "}
            <span className="font-medium">{item.nextRunTime}</span>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4">
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="accuracy" type="natural" fill="var(--color-accuracy)" fillOpacity={0.4} stroke="var(--color-accuracy)" />
            </AreaChart>
          </ChartContainer>
          <Separator />
          <form className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={item.status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Idle">Idle</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select defaultValue={item.owner}>
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
