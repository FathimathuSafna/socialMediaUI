import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import NAVBAR from '../components/Navbar/Navbar';
import SIDEBAR from '../components/sideBar/sideBar';
import POSTS from '../components/post/post';
import LIST from '../components/list/list';
import FOOTERBAR from '../components/sideBar/footerBar';
import SMALLBAR from '../components/sideBar/smSideBar';
import { Grid2 } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../store/ThemeContext';

function Pages() {
  const { darkMode } = useCustomTheme(); // Custom dark mode toggle

  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const postBg = darkMode ? '#1e1e1e' : '#F5F5F4';

  return (
    <Grid2
      container
      sx={{
        bgcolor: bgColor,
        color: textColor,
        transition: 'all 0.3s ease-in-out'
      }}
      direction='row'
      >
      {/* Sidebar Section */}
      <Grid2 direction='column' size={{xs:0,md:2}}>
        <Grid2 xs={12} md={12}
         sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: textColor,
          padding: '10px',
          paddingTop: '15px',
          position: 'fixed',
          top: '20px', // <-- add this line
          display: { xs: 'none', md: 'flex' }
        }}
        >
          APPMOSHPERE
        </Grid2>
        <Grid2 md={12} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }} >
          <SIDEBAR/>
        </Grid2>
        <Grid2 sx={{ display: { xs: 'none', sm: 'flex', md: 'none' } }}>
          <SMALLBAR />
        </Grid2>
      </Grid2>

      {/* Main Content Section */}
      <Grid2 container direction="column" size={10}>
        <Grid2 md={10} xs={12}  offset={{ xs: 0, sm: 0, md: 0, lg: 0 }}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              zIndex: 1000,
              width: '100%',
              boxSizing: 'border-box',
              gap: 3,
              bgcolor: bgColor,
              color: textColor,
              overflow: 'hidden', // Prevent content overflow
              padding: '0 16px',
              
            }}
          >
            <NAVBAR />
          </Box>
        </Grid2>

        {/* Posts Section */}
        <Grid2
          container
          direction='row'
          size={{ xs: 12, md: 10, lg: 10 }}
          
          sx={{
            marginTop: '49px',
            height: 'calc(100% - 50px)'
          }}
        >
          <Grid2
            container
            size={{ xs: 12, sm: 12, md: 12, lg: 10 }}
            offset={{ xs: 0, sm: 1, md: 2, lg: 0 }}
            sx={{
              display: { xs: 'flex', md: 'flex' },
              justifyContent: { xs: 'center', md: 'space-between' },
              boxShadow: 2,
              bgcolor: postBg,
              color: textColor,
              borderRadius: 2,
              p: 1
            }}
          >
            {[...Array(4)].map((_, rowIndex) => (
              <Grid2 key={rowIndex} size={{ xs: 11, sm: 6, md: 6 }}>
                <POSTS />
                <POSTS />
              </Grid2>
            ))}
          </Grid2>

          {/* List Section */}
          <Grid2 container size={{ sm: 2, md: 2 }} spacing={-3}>
            <Grid2
              direction='column'
              size={{ xs: 12, sm: 2, md: 2 }}
              paddingLeft={4}
              pt={2}
              pb={3}
              sx={{ color: textColor }}
            >
              {[...Array(4)].map((_, idx) => (
                <Grid2 key={idx} size={{ sm: 2, md: 2 }} pb={1}>
                  <LIST />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Footer Section */}
      <Grid2 size={{ xs: 12 }} sx={{ display: { xs: 'flex', md: 'none' } }}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            zIndex: 1000,
            boxSizing: 'border-box',
            gap: 3,
            bgcolor: bgColor,
            color: textColor
          }}
        >
          <FOOTERBAR />
        </Box>
      </Grid2>
    </Grid2>
  );
}

export default Pages;
