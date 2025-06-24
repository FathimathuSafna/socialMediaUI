import { Box, Grid2, IconButton } from "@mui/material";
import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import AddPost from "../../modal/addPost";
import SearchDialog from "../../modal/searchDialog";
import { useNavigate } from "react-router-dom";

function footerBar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchHandleOpen = () => setSearchOpen(true);
  const searchHandleClose = () => setSearchOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid2
        container
        sx={{
          bgcolor: bgColor,
          color: textColor,
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1200,
          width: "100vw",
        }}
        gap={1}
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            py: 1,
          }}
        >
          <Box sx={{ cursor: "pointer", p: 1 }} onClick={() => navigate("/")}>
            <HomeIcon /> 
          </Box>

          <Box onClick={searchHandleOpen} sx={{ cursor: "pointer", p: 1 }}>
            <SearchIcon />
          </Box>
          <Box sx={{ cursor: "pointer", p: 1 }}>
            <ChatIcon />
          </Box>
          <Box onClick={handleOpen} sx={{ cursor: "pointer", p: 1 }}>
            <AddBoxOutlinedIcon />
          </Box>
          <Box sx={{ cursor: "pointer", p: 1 }} onClick={() => navigate(`/profile/${userName}`)}>
            <AccountCircleOutlinedIcon />
          </Box>
        </Box>
      </Grid2>

      <AddPost open={open} handleClose={handleClose} />
      <SearchDialog open={searchOpen} handleClose={searchHandleClose} />
    </>
  );
}

export default footerBar;
