import { useState } from 'react'
import { Box, Typography, Link, Paper } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import HubIcon from '@mui/icons-material/Hub'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import DemoLogin from './components/DemoLogin'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Box component="main" sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Box
        sx={{
          flex: { xs: 0, md: 1.3 },
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(37, 99, 235, 0.4) 100%)',
            zIndex: 1
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Field Service Excellence
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Intelligent work order management for modern teams.
          </Typography>
        </Box>
      </Box>

      <Box
        component={Paper}
        elevation={0}
        square
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper'
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 450
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={5}>
            <HubIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ letterSpacing: '-1px' }}>
              Fluxo
            </Typography>
          </Box>

          <Box sx={{ width: '100%' }}>
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography component="h1" variant="h5" fontWeight="600" gutterBottom>
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter your credentials to access the workspace.
                  </Typography>
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography component="h1" variant="h5" fontWeight="600" gutterBottom>
                    Create an account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Start optimizing your field operations today.
                  </Typography>
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>

            <Box textAlign="center" mt={3}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Link>
            </Box>

            <DemoLogin />
            
          </Box>
        </Box>
      </Box>
    </Box>
  )
}