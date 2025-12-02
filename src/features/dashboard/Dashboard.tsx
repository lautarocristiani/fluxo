import { useAuthStore } from '../../store/authStore'
import { Box, Typography, Button, Container, Chip, Paper } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DispatcherBoard from './components/DispatcherBoard'
import TechnicianBoard from './components/TechnicianBoard'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  const isDispatcher = profile?.role === 'dispatcher'
  
  const fullName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'User'

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Fluxo
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Typography variant="body2" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {fullName}
          </Typography>
          
          <Chip 
            label={profile?.role?.toUpperCase()} 
            color={isDispatcher ? 'primary' : 'secondary'} 
            size="small"
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
      </Paper>

      <Box>
        {isDispatcher ? <DispatcherBoard /> : <TechnicianBoard />}
      </Box>
    </Container>
  )
}