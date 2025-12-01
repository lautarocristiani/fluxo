import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Box, Button, Typography, Alert } from '@mui/material'
import EngineeringIcon from '@mui/icons-material/Engineering'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

export default function DemoLogin() {
  const [error, setError] = useState<string | null>(null)

  const handleDemoLogin = async (role: 'admin' | 'tech') => {
    setError(null)
    const email = role === 'admin' ? 'demo.admin@fluxo.com' : 'demo.tech@fluxo.com'
    const password = 'fluxo123'

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setError(error.message)
  }

  return (
    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textAlign: 'center' }}>
        QUICK ACCESS (DEMO / RECRUITERS)
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" gap={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AdminPanelSettingsIcon />}
          onClick={() => handleDemoLogin('admin')}
          sx={{ borderColor: '#e0e0e0', color: '#555', textTransform: 'none' }}
        >
          Dispatcher
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EngineeringIcon />}
          onClick={() => handleDemoLogin('tech')}
          sx={{ borderColor: '#e0e0e0', color: '#555', textTransform: 'none' }}
        >
          Technician
        </Button>
      </Box>
    </Box>
  )
}