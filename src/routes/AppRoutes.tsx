import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AuthPage from '../features/auth/AuthPage'
import Dashboard from '../features/dashboard/Dashboard'
import OrderExecution from '../features/work-orders/OrderExecution'
import { Box, CircularProgress } from '@mui/material'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  if (!user) return <Navigate to="/auth" replace />
  
  return <>{children}</>
}

export default function AppRoutes() {
  const { initializeAuth, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    initializeAuth()
  }, [])

  useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/orders/:id" element={
        <PrivateRoute>
          <OrderExecution />
        </PrivateRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}