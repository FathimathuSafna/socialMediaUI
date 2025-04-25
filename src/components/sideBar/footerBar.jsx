import { Box, Grid2 } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';



function footerBar() {
  const { darkMode } = useCustomTheme();

  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  return (
    <>
    <Grid2 container direction='row'  alignItems='center' gap={3} sx={{
        backgroundColor: bgColor,
        color: textColor,
        padding: '10px',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000, // Set a high z-index
        display: { xs: 'flex', sm: 'none', md: 'none' }
      }}>
         <Box sx={{ justifyContent: 'space-around', width: '100%' ,display: { xs: 'flex', sm: 'none', md: 'none' }}}>
         <HomeIcon/>
         <SearchIcon/>
         <ChatIcon />
            <AddBoxOutlinedIcon/>
            <AccountCircleOutlinedIcon/>
            </Box>
        </Grid2>
</>
      
  )
}

export default footerBar