import { useAuthStore } from '../../store/authStore'
import { Box } from '@mui/material'
import DispatcherBoard from './components/DispatcherBoard'
import TechnicianBoard from './components/TechnicianBoard'

export default function Dashboard() {
  const { profile } = useAuthStore()
  const isDispatcher = profile?.role === 'dispatcher'
  
  return (
    <Box>
       {isDispatcher ? <DispatcherBoard /> : <TechnicianBoard />}
    </Box>
  )
}