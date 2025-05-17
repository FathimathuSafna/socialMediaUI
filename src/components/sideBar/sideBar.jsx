import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';
import AddPost from '../../modal/addPost';
import SearchDialog from '../../modal/searchDialog';

function Sidebar() {
  const { darkMode } = useCustomTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchHandleOpen = () => setSearchOpen(true);
  const searchHandleClose = () => setSearchOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const btnColor = darkMode ? '#121212' : '#ffffff';

  const menuItems = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <SearchIcon />, label: 'Search' ,action: searchHandleOpen},
    { icon: <ChatIcon />, label: 'Messages' },
    { icon: <AddBoxOutlinedIcon />, label: 'Create', action: handleOpen },
    { icon: <AccountCircleOutlinedIcon />, label: 'Profile' }
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid2
          container
          alignItems="center"
          sx={{
            bgcolor: bgColor,
            color: textColor,
            transition: 'all 0.3s ease-in-out',
            padding: '10px',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1
          }}
        >
          <Grid2 item>
            <Box
              sx={{
                height: '100vh',
                position: 'fixed',
                top: '4.5rem',
                left: 0,
                zIndex: 1,
                padding: '1rem'
              }}
            >
              <Grid2 container direction="column" spacing={3}>
                {menuItems.map((item, index) => (
                  <Grid2
                    key={index}
                    container
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid2 item>{item.icon}</Grid2>
                    <Grid2 item>
                      <Button
                        sx={{
                          backgroundColor: btnColor,
                          border: 'none',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          color: textColor,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: darkMode ? '#1e1e1e' : '#f0f0f0'
                          }
                        }} 
                        onClick={item.action}
                      >
                        {item.label}
                      </Button>
                    </Grid2>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      {/* Image Upload Modal */}
      <AddPost open={open} handleClose={handleClose} />
      <SearchDialog open={searchOpen} handleClose={searchHandleClose} />
    </>
  );
}

export default Sidebar;
