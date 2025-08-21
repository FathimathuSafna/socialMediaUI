import * as React from "react";
import { AppBar, Box, IconButton, Button, Typography } from "@mui/material";
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

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        height: 50,
        bgcolor: bgColor,
        color: textColor,
        transition: "all 0.3s ease-in-out",
      }}
      elevation={0}
    >
      {/* 1. Create a parent Box with flex properties */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between", // This pushes items to opposite ends
          width: "100%",
          height: "100%",
          px: 2, // Adds some horizontal padding
        }}
      >
        {/* 2. Your Logo */}
        <Typography
          sx={{
            fontSize: 24,
            fontFamily: "'Pacifico', cursive",
            color: textColor,
          }}
        >
          Appmosphere
        </Typography>

        {/* 3. A Box for your action buttons */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <Button
            color="inherit"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <ExitToAppTwoToneIcon sx={{ mr: 0.6 }} />
            signOut
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
}