import { useState } from 'react'
import { Box, Avatar, Button, CircularProgress, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { supabase } from '../../../lib/supabase'

interface AvatarUploaderProps {
  url: string | null
  onUpload: (url: string) => void
  userId: string
}

export default function AvatarUploader({ url, onUpload, userId }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      onUpload(data.publicUrl)

    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Avatar
        src={url || undefined}
        sx={{ width: 120, height: 120, fontSize: '3rem' }}
      />
      <Button
        component="label"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Avatar'}
        <input
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </Button>
      <Typography variant="caption" color="text.secondary">
        Recommended: Square JPG/PNG, max 2MB
      </Typography>
    </Box>
  )
}