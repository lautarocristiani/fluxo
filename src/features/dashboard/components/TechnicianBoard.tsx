import { Box, Card, CardContent, Typography, Chip, Button, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useWorkOrders } from '../../work-orders/hooks/useWorkOrders'

export default function TechnicianBoard() {
  const { orders, loading } = useWorkOrders()

  if (loading) {
    return <Typography>Loading your tasks...</Typography>
  }

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">No active tasks assigned.</Typography>
        <Typography variant="body2">Great job! You are all caught up.</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
          <Card elevation={2} sx={{ 
            borderLeft: 6, 
            borderColor: order.status === 'completed' ? 'success.main' : 
                         order.status === 'in_progress' ? 'primary.main' : 'warning.main'
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  #{order.id.slice(0, 8)}
                </Typography>
                <Chip 
                  label={order.status.replace('_', ' ')} 
                  size="small" 
                  color={order.status === 'completed' ? 'success' : order.status === 'in_progress' ? 'primary' : 'warning'} 
                />
              </Stack>
              
              <Typography variant="h6" gutterBottom>
                {order.service_templates?.name}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={0.5} mb={2} color="text.secondary">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{order.customer_address}</Typography>
              </Box>

              <Typography variant="body2" fontWeight="bold" sx={{ mb: 2 }}>
                Client: {order.customer_name}
              </Typography>

              {order.status !== 'completed' ? (
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<PlayArrowIcon />}
                  color={order.status === 'pending' ? 'primary' : 'secondary'}
                >
                  {order.status === 'pending' ? 'Start Job' : 'Resume Job'}
                </Button>
              ) : (
                <Button variant="outlined" fullWidth startIcon={<CheckCircleIcon />} disabled>
                  Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}