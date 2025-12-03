import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { 
  Box, 
  Chip, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useWorkOrders, type WorkOrder } from '../../work-orders/hooks/useWorkOrders'
import CreateOrderModal from '../../work-orders/components/CreateOrderModal'
import EditOrderModal from '../../work-orders/components/EditOrderModal'
import { supabase } from '../../../lib/supabase'

export default function DispatcherBoard() {
  const { orders, loading, refetch } = useWorkOrders()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState('all')
  const navigate = useNavigate()

  const requestDelete = (id: string) => {
    setDeleteOrderId(id)
  }

  const confirmDelete = async () => {
    if (deleteOrderId) {
      await supabase.from('work_orders').delete().eq('id', deleteOrderId)
      await refetch()
      setDeleteOrderId(null)
    }
  }

  const filteredOrders = tabValue === 'all' 
    ? orders 
    : orders.filter(o => o.status === tabValue)

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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<WorkOrder>) => {
        const isCompleted = params.row.status === 'completed'

        return (
          <Box>
            <Tooltip title="View Details">
              <IconButton 
                size="small" 
                onClick={() => navigate(`/orders/${params.row.id}`)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Edit / Reassign">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => setEditingOrder(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {!isCompleted && (
              <Tooltip title="Delete">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => requestDelete(params.row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Operations Center
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Order
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_e, v) => setTabValue(v)} 
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Orders" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="In Progress" value="in_progress" />
          <Tab label="Completed" value="completed" />
        </Tabs>
        
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
        </Box>
      </Paper>

      <CreateOrderModal 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refetch}
      />

      <EditOrderModal
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSuccess={() => {
          refetch()
          setEditingOrder(null)
        }}
        order={editingOrder}
      />

      <Dialog
        open={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this work order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOrderId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}