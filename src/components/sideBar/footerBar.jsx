import { Box, Grid2 } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


function footerBar() {
  return (
    <>
    <Grid2 container direction='row'  alignItems='center' gap={3} sx={{backgroundColor: 'white',padding: '10px', position: 'fixed', bottom: 0, width: '100%', zIndex: 1}}>
         <Box sx={{display:{xs:'flex', sm:'none',md:'none'}, justifyContent: 'space-around', width: '100%'}}>
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