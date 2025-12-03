import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Box, CircularProgress } from '@mui/material'
import AuthPage from '../features/auth/AuthPage'
import Dashboard from '../features/dashboard/Dashboard'
import OrderExecution from '../features/work-orders/OrderExecution'
import ProfilePage from '../features/profile/ProfilePage'
import MainLayout from '../components/layout/MainLayout'

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
      
      <Route element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders/:id" element={<OrderExecution />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}