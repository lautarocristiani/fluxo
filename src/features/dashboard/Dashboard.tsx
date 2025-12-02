import { useAuthStore } from '../../store/authStore'
import { Box, Typography, Button, Container, Chip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DispatcherBoard from './components/DispatcherBoard'
import TechnicianBoard from './components/TechnicianBoard'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  const isDispatcher = profile?.role === 'dispatcher'

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Fluxo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {profile?.first_name || 'User'}
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Chip 
            label={profile?.role?.toUpperCase()} 
            color={isDispatcher ? 'primary' : 'secondary'} 
            variant="outlined" 
          />
          <Button 
            variant="outlined" 
            color="error" 
            onClick={signOut}
            startIcon={<LogoutIcon />}
            size="small"
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      <Box>
        {isDispatcher ? <DispatcherBoard /> : <TechnicianBoard />}
      </Box>
    </Container>
  )
}