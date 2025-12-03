import { useState, useEffect } from 'react'
import { Box, Paper, Typography, TextField, Button, Grid, Alert, Divider } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import AvatarUploader from './components/AvatarUploader'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        avatarUrl: profile.avatar_url || ''
      })
    }
  }, [profile])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        avatar_url: formData.avatarUrl,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      
      await refreshProfile()
      setMessage({ type: 'success', text: 'Profile updated successfully!' })

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }))
  }

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4 }}>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <Alert severity={message.type}>
                {message.text}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="center">
            {user && (
              <AvatarUploader 
                url={formData.avatarUrl} 
                onUpload={handleAvatarUpload}
                userId={user.id} 
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box component="form" onSubmit={handleUpdate}>
              <Typography variant="h6" mb={2}>Personal Information</Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    disabled
                    value={user?.email || ''}
                    helperText="Email cannot be changed."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="flex-end">
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}