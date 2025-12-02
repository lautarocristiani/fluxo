import { useState } from 'react'
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
import type { Database } from '../../../types/database.types'

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

type WorkOrderInsert = Database['public']['Tables']['work_orders']['Insert']

export default function CreateOrderModal({ open, onClose, onSuccess }: CreateOrderModalProps) {
  const { templates, technicians, loading: loadingOptions } = useOrderOptions()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    templateId: '',
    assigneeId: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const insertData: WorkOrderInsert = {
      customer_name: formData.customerName,
      customer_address: formData.customerAddress,
      template_id: formData.templateId,
      status: 'pending',
      assignee_id: formData.assigneeId || null
    }

    const { error } = await supabase
      .from('work_orders')
      .insert(insertData)

    setSaving(false)

    if (!error) {
      onSuccess()
      onClose()
      setFormData({ customerName: '', customerAddress: '', templateId: '', assigneeId: '' })
    } else {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Work Order</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Customer Name"
              name="customerName"
              fullWidth
              required
              value={formData.customerName}
              onChange={handleChange}
            />
            <TextField
              label="Address"
              name="customerAddress"
              fullWidth
              required
              value={formData.customerAddress}
              onChange={handleChange}
            />
            
            <TextField
              select
              label="Service Type"
              name="templateId"
              fullWidth
              required
              value={formData.templateId}
              onChange={handleChange}
              disabled={loadingOptions}
            >
              {templates.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign Technician"
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
            disabled={saving || !formData.templateId}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
          >
            Create Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}