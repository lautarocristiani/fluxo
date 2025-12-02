import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  MenuItem, 
  Box,
  CircularProgress
} from '@mui/material'
import { supabase } from '../../../lib/supabase'
import { useOrderOptions } from '../hooks/useOrderOptions'
import type { WorkOrder } from '../hooks/useWorkOrders'

interface EditOrderModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  order: WorkOrder | null
}

export default function EditOrderModal({ open, onClose, onSuccess, order }: EditOrderModalProps) {
  const { technicians, loading: loadingOptions } = useOrderOptions()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    assigneeId: ''
  })

  // Cargar datos actuales cuando se abre el modal
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        assigneeId: order.assignee_id || ''
      })
    }
  }, [order])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setSaving(true)

    const updateData = {
      status: formData.status as 'pending' | 'in_progress' | 'completed',
      assignee_id: formData.assigneeId === '' ? null : formData.assigneeId
    }

    const { error } = await supabase
      .from('work_orders')
      .update(updateData)
      .eq('id', order.id)

    setSaving(false)

    if (!error) {
      onSuccess()
      onClose()
    } else {
      console.error('Error updating order:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Order #{order?.id.slice(0, 8)}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              disabled
              label="Customer"
              fullWidth
              value={order?.customer_name || ''}
            />
            
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>

            <TextField
              select
              label="Re-assign Technician"
              name="assigneeId"
              fullWidth
              value={formData.assigneeId}
              onChange={handleChange}
              disabled={loadingOptions}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {technicians.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={saving}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}