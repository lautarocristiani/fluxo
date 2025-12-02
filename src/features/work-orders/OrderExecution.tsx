import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, Button, CircularProgress, Alert, Chip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database.types'
import { useAuthStore } from '../../store/authStore'

type WorkOrderWithTemplate = Database['public']['Tables']['work_orders']['Row'] & {
  service_templates: Database['public']['Tables']['service_templates']['Row'] | null
}

export default function OrderExecution() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [order, setOrder] = useState<WorkOrderWithTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('work_orders')
          .select(`
            *,
            service_templates ( * )
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        
        const orderData = data as any
        setOrder(orderData)

        if (orderData.status === 'pending' && profile?.role === 'technician') {
          await supabase
            .from('work_orders')
            .update({ status: 'in_progress' })
            .eq('id', id)
        }

      } catch (err: any) {
        console.error(err)
        setError('Could not load work order details.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [id, profile])

  const handleSubmit = async ({ formData }: any) => {
    if (!order) return
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('work_orders')
        .update({
          status: 'completed',
          form_data: formData,
          completed_at: new Date().toISOString()
        })
        .eq('id', order.id)

      if (error) throw error

      navigate('/')
    } catch (err: any) {
      console.error(err)
      setError('Failed to submit order.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !order || !order.service_templates) {
    return (
      <Box p={4}>
        <Alert severity="error">{error || 'Order not found or invalid template.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    )
  }

  const isReadOnly = order.status === 'completed' || profile?.role === 'dispatcher'
  
  const formDataAny = order.form_data as any
  const evidenceUrl = formDataAny?.installation_photo || formDataAny?.evidence_photo || formDataAny?.photo

  return (
    <Box p={{ xs: 2, md: 4 }} maxWidth="md" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')} 
        >
          Back
        </Button>
        {profile?.role === 'dispatcher' && (
          <Chip label="Dispatcher View (Read Only)" color="primary" variant="outlined" />
        )}
      </Box>

      {order.status === 'completed' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          This order has been completed on {new Date(order.completed_at || '').toLocaleDateString()}.
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box mb={4} borderBottom={1} borderColor="divider" pb={2}>
          <Typography variant="overline" color="text.secondary">
            Order #{order.id.slice(0, 8)}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {order.service_templates.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Client: {order.customer_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.customer_address}
          </Typography>
        </Box>

        <Form
          schema={order.service_templates.schema_definition as any}
          uiSchema={(order.service_templates.ui_schema_definition as any) || {}}
          formData={order.form_data || {}}
          validator={validator}
          onSubmit={handleSubmit}
          readonly={isReadOnly}
          disabled={submitting}
        >
          {!isReadOnly && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={submitting}
                startIcon={submitting && <CircularProgress size={20} color="inherit" />}
              >
                {submitting ? 'Completing...' : 'Complete Work Order'}
              </Button>
            </Box>
          )}
        </Form>

        {isReadOnly && evidenceUrl && (
          <Box mt={4} sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 1, border: '1px dashed #cbd5e1' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              ATTACHED EVIDENCE
            </Typography>
            <Box 
              component="img"
              src={evidenceUrl}
              alt="Work Evidence"
              sx={{ 
                maxWidth: '100%', 
                maxHeight: 300, 
                borderRadius: 1,
                border: '1px solid #e2e8f0'
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  )
}