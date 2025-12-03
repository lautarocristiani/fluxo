import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}