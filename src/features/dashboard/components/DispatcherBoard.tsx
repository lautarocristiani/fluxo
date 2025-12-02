import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Chip, Typography, Paper, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useWorkOrders, type WorkOrder } from '../../work-orders/hooks/useWorkOrders'

const columns: GridColDef[] = [
  { field: 'customer_name', headerName: 'Customer', flex: 1, minWidth: 150 },
  { 
    field: 'service_name', 
    headerName: 'Service Type', 
    flex: 1,
    minWidth: 180,
    valueGetter: (_value, row: WorkOrder) => row.service_templates?.name || 'Unknown'
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 130,
    renderCell: (params: GridRenderCellParams<WorkOrder>) => {
      const status = params.value as string
      let color: 'default' | 'primary' | 'success' | 'warning' = 'default'
      
      if (status === 'pending') color = 'warning'
      if (status === 'in_progress') color = 'primary'
      if (status === 'completed') color = 'success'

      return (
        <Chip 
          label={status.replace('_', ' ').toUpperCase()} 
          color={color} 
          size="small" 
          variant="outlined" 
          sx={{ fontWeight: 'bold' }}
        />
      )
    }
  },
  { 
    field: 'assignee', 
    headerName: 'Technician', 
    flex: 1,
    valueGetter: (_value, row: WorkOrder) => {
      if (!row.profiles) return 'Unassigned'
      return `${row.profiles.first_name || ''} ${row.profiles.last_name || ''}`
    }
  },
  { 
    field: 'created_at', 
    headerName: 'Created At', 
    width: 150,
    valueFormatter: (value) => new Date(value as string).toLocaleDateString()
  }
]

export default function DispatcherBoard() {
  const { orders, loading } = useWorkOrders()

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="text.secondary">
          All Operations ({orders.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Order
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  )
}