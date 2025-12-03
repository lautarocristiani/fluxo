import { useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider, 
  IconButton,
  Tooltip,
  Container
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HubIcon from '@mui/icons-material/Hub'

export default function Header() {
  const { profile, signOut } = useAuthStore()
  const { mode, setMode } = useThemeStore()
  const navigate = useNavigate()
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    signOut()
  }

  const handleProfile = () => {
    handleMenuClose()
    navigate('/profile')
  }

  const toggleTheme = () => {
    if (mode === 'light') setMode('dark')
    else if (mode === 'dark') setMode('system')
    else setMode('light')
  }

  const getThemeIcon = () => {
    if (mode === 'light') return <LightModeIcon fontSize="small" />
    if (mode === 'dark') return <DarkModeIcon fontSize="small" />
    return <SettingsBrightnessIcon fontSize="small" />
  }

  const getThemeLabel = () => {
    if (mode === 'light') return 'Light Mode'
    if (mode === 'dark') return 'Dark Mode'
    return 'System Theme'
  }

  const fullName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'User'

  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1, 
        borderColor: 'divider',
        borderRadius: 0
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <HubIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Fluxo
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant="subtitle2" 
              fontWeight={600} 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                mr: 1,
                color: 'text.primary'
              }}
            >
              {fullName}
            </Typography>

            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar 
                  src={profile?.avatar_url || undefined}
                  sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}
                >
                  {!profile?.avatar_url && initials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box px={2} py={1}>
              <Typography variant="subtitle2" noWrap>
                {fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {profile?.email}
              </Typography>
            </Box>
            <Divider />
            
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <MenuItem onClick={(e) => {
              e.stopPropagation()
              toggleTheme()
            }}>
              <ListItemIcon>
                {getThemeIcon()}
              </ListItemIcon>
              {getThemeLabel()}
            </MenuItem>

            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}