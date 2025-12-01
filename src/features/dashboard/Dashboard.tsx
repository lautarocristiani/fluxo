import { useAuthStore } from '../../store/authStore'
import { Box, Typography, Button, Container, Paper, Chip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

export default function Dashboard() {
  const { profile, signOut } = useAuthStore()

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {profile?.first_name || 'User'}
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Chip 
            label={profile?.role?.toUpperCase()} 
            color={profile?.role === 'dispatcher' ? 'primary' : 'success'} 
            variant="outlined" 
            size="small"
          />
          <Button 
            variant="outlined" 
            color="error" 
            onClick={signOut}
            startIcon={<LogoutIcon />}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc' }} variant="outlined">
        <Typography variant="h6" color="text.secondary">
          {profile?.role === 'dispatcher' 
            ? 'Dispatcher Operations View' 
            : 'My Assigned Work Orders'}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          (Data tables and map components will be loaded here in the next step)
        </Typography>
      </Paper>
    </Container>
  )
}