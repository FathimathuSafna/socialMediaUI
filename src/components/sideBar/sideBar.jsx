import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import AddPost from "../../modal/addPost";
import SearchDialog from "../../modal/searchDialog";
import {  useNavigate } from "react-router-dom";
import MESSAGEDIALOG from '../../modal/messageDialog'

function Sidebar() {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const [open, setOpen] = useState(false);
  const [messageOpen, setmessageOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false);
  const searchHandleOpen = () => setSearchOpen(true);
  const searchHandleClose = () => setSearchOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const messageHandleOpen = () => setmessageOpen(true)
  const messageHandleClose = () => setmessageOpen(false)

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const btnColor = darkMode ? "#121212" : "#ffffff";
  const userName = localStorage.getItem("userName");

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", action: () => navigate("/") },
    { icon: <SearchIcon />, label: "Search", action: searchHandleOpen },
    { icon: <ChatIcon />, label: "Messages",action:messageHandleOpen },
    { icon: <AddBoxOutlinedIcon />, label: "Create", action: handleOpen },
    {
      icon: <AccountCircleOutlinedIcon />,
      label: "Profile",
      action: () => navigate(`/profile/${userName}`),
    },
  ];

  const currentPath = window.location.pathname;

  const getIsActive = (label) => {
    if (label === "Home" && currentPath === "/") return true;
    if (label === "Profile" && currentPath.startsWith("/profile/")) return true;
    return false;
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          position: "fixed",
          top: 60,
          left: 0,
          width: { xs: "0px", sm: "180px", md: "240px" },
          borderRight: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          bgcolor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(28px)",
          pt: 4,
          px: 2,
          display: { xs: "none", sm: "block" },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {menuItems.map((item, index) => {
            const active = getIsActive(item.label);
            return (
              <Button
                key={index}
                onClick={item.action}
                startIcon={item.icon}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: active ? 700 : 500,
                  py: 1.5,
                  px: 2.5,
                  borderRadius: "14px",
                  color: active
                    ? (darkMode ? "#ffffff" : "#0f172a")
                    : (darkMode ? "#94a3b8" : "#64748b"),
                  backgroundColor: active
                    ? (darkMode ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.06)")
                    : "transparent",
                  borderLeft: active
                    ? `4px solid #6366f1`
                    : "4px solid transparent",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "& .MuiButton-startIcon": {
                    color: active
                      ? "#6366f1"
                      : "inherit",
                    mr: 2,
                    "& svg": {
                      fontSize: 22,
                    }
                  },
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)",
                    transform: "translateX(4px)",
                    color: darkMode ? "#ffffff" : "#0f172a",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      <AddPost open={open} handleClose={handleClose} />
      <SearchDialog open={searchOpen} handleClose={searchHandleClose} />
      <MESSAGEDIALOG open={messageOpen} handleClose={messageHandleClose}/>
    </>
  );
}

export default Sidebar;
