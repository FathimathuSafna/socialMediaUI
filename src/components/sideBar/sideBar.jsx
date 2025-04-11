import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Grid2} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Divider from '@mui/material/Divider';

function sideBar() {
  return (
    <>
    <Box  sx={{ flexGrow: 1 }}>
      <Grid2 container direction='row'  alignItems='center'  sx={{backgroundColor: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1}}>
        <Grid2 item>
    <Card sx={{height: '100vh' ,position: 'fixed', top: '4.5rem', left: 0, zIndex: 1}} >
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        <Grid2  container direction='column'  alignItems='center' gap={3}>
        <Grid2  item container direction='row'  alignItems='center' gap={3}>
          <Grid2>
            <HomeIcon/>
          </Grid2>
          <Grid2>
          <button style={{backgroundColor: 'white',border: 'none', fontSize: '1.1rem',cursor: 'pointer', textDecoration: 'none'}}>
              Home
              </button>
          </Grid2>
          </Grid2>
          <Grid2  container direction='row'  alignItems='center' gap={2}>
          <Grid2>
            <SearchIcon/>
          </Grid2>
          <Grid2>
          <button style={{backgroundColor: 'white',border: 'none', fontSize: '1.1rem',cursor: 'pointer', textDecoration: 'none'}}>
              Search
              </button>
          </Grid2>
          </Grid2>
          <Grid2  container direction='row'  alignItems='center' gap={2}>
          <Grid2 >
           <ChatIcon />
          </Grid2>
          <Grid2>
          <button style={{backgroundColor: 'white',border: 'none',fontSize: '1rem',cursor: 'pointer'}}>
              Messages
              </button>
          </Grid2>
          </Grid2>
          <Grid2  container direction='row'  alignItems='center' gap={2}>
          <Grid2>
            <AddBoxOutlinedIcon/>
          </Grid2>
          <Grid2>
          <button style={{backgroundColor: 'white',border: 'none', fontSize: '1.1rem',cursor: 'pointer', textDecoration: 'none'}}>
              Create
              </button>
          </Grid2>
          </Grid2>
          <Grid2 item container direction='row'  alignItems='center' gap={2}>
          <Grid2>
            <AccountCircleOutlinedIcon/>
          </Grid2>
          <Grid2>
          <button style={{backgroundColor: 'white', border: 'none', fontSize: '1.1rem',cursor: 'pointer', textDecoration: 'none'}}>
              Profile
              </button>
          </Grid2>
          </Grid2>
          </Grid2>
      </Typography>
     
    </CardContent>
    </Card>
    </Grid2></Grid2>
    </Box>
    
    
    </>
  )
}

export default sideBar;