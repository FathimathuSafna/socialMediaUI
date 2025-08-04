import * as React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { useNavigate } from "react-router-dom";
import ExitToAppTwoToneIcon from "@mui/icons-material/ExitToAppTwoTone";

export default function PrimarySearchAppBar({ toggleDrawer }) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useCustomTheme();

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  // const menuId = "primary-search-account-menu";
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{ vertical: "top", horizontal: "right" }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  // const mobileMenuId = "primary-search-account-menu-mobile";
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{ vertical: "top", horizontal: "right" }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem onClick={toggleDarkMode}>
  //       <IconButton color="inherit">
  //         {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
  //       </IconButton>
  //       <p>{darkMode ? "Light" : "Dark"} Mode</p>
  //     </MenuItem>
  //   </Menu>
  // );

  return (
    <Box
      sx={{
        position: "fixed",
        marginTop:1.4,
        top: 0,
        right: 0,
        bgcolor: bgColor,
        color: textColor,
      }}
    >
      <AppBar
        position="static"
        sx={{
          top:0,
          bgcolor: bgColor,
          color: textColor,
          transition: "all 0.3s ease-in-out",
        }}
        elevation={0}
      >
        <Box sx={{ display: "flex", alignItems: "center"}}>
          <Box
            // component="img"
            sx={{
              height: { xs: "24px", sm: "40px" }, 
              width: "auto",
              marginRight: 1,
            }}
          ></Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ display: { xs: "flex", md: "flex" }, alignItems: "center" }}
            >    
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
           
            <Box >
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <ExitToAppTwoToneIcon  sx={{mr:0.6}}/>
                signOut
              </Button>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}
