import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Chip, Button, Stack, Tabs, Tab, Alert, Tooltip, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import HistoryIcon from '@mui/icons-material/History'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useWorkOrders, type WorkOrder } from '../../work-orders/hooks/useWorkOrders'

export default function TechnicianBoard() {
  const { orders, loading } = useWorkOrders()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  const activeOrders = orders.filter(o => o.status === 'in_progress')
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const completedOrders = orders.filter(o => o.status === 'completed')

  const hasActiveJob = activeOrders.length > 0

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const renderCard = (order: WorkOrder, isDisabled: boolean = false) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
      <Card elevation={2} sx={{ 
        borderLeft: 6, 
        borderColor: order.status === 'completed' ? 'success.main' : 
                     order.status === 'in_progress' ? 'primary.main' : 'warning.main',
        opacity: isDisabled ? 0.7 : 1
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

          {order.status === 'completed' ? (
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<VisibilityIcon />} 
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              View Details
            </Button>
          ) : (
            <Tooltip title={isDisabled ? "Complete your current active job first" : ""}>
              <span>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<PlayArrowIcon />}
                  color={order.status === 'pending' ? 'primary' : 'secondary'}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  disabled={isDisabled}
                >
                  {order.status === 'pending' ? 'Start Job' : 'Resume Job'}
                </Button>
              </span>
            </Tooltip>
          )}
        </CardContent>
      </Card>
    </Grid>
  )

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }} variant="fullWidth">
        <Tab icon={<EngineeringIcon />} label={`Current (${activeOrders.length})`} />
        <Tab icon={<AccessTimeIcon />} label={`To Do (${pendingOrders.length})`} />
        <Tab icon={<HistoryIcon />} label={`History (${completedOrders.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          {activeOrders.length === 0 ? (
            <Alert severity="info">No jobs in progress. Pick a task from "To Do".</Alert>
          ) : (
            <Grid container spacing={2}>
              {activeOrders.map(order => renderCard(order))}
            </Grid>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {hasActiveJob && pendingOrders.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You have an active job. Please complete it before starting a new one.
            </Alert>
          )}
          <Grid container spacing={2}>
            {pendingOrders.map(order => renderCard(order, hasActiveJob))}
          </Grid>
        </Box>
      )}

      {tabValue === 2 && (
        <Grid container spacing={2}>
          {completedOrders.map(order => renderCard(order))}
        </Grid>
      )}
    </Box>
  )
}