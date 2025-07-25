import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import AddPost from "../../modal/addPost";
import SearchDialog from "../../modal/searchDialog";
import { useNavigate } from "react-router-dom";

function SmSideBar() {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchHandleOpen = () => setSearchOpen(true);
  const searchHandleClose = () => setSearchOpen(false);

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const btnColor = darkMode ? "#121212" : "#ffffff";
  const userName = localStorage.getItem("userName");

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", action: () => navigate("/") },
    { icon: <SearchIcon />, label: "Search", action: searchHandleOpen },
    { icon: <ChatIcon />, label: "Messages" },
    { icon: <AddBoxOutlinedIcon />, label: "create", action: handleOpen },
    {
      icon: <AccountCircleOutlinedIcon />,
      label: "Profile",
      action: () => navigate(`/profile/${userName}`),
    },
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
            transition: "all 0.3s ease-in-out",
            padding: "10px",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
          }}
        >
          <Grid2 item>
            <Box
              sx={{
                height: "100vh",
                position: "fixed",
                top: "4.5rem",
                left: 0,
                zIndex: 1,
                padding: "1rem",
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
                    <Grid2 item>
                      <Button
                        sx={{
                          backgroundColor: btnColor,
                          border: "none",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          color: textColor,
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: darkMode ? "#1e1e1e" : "#f0f0f0",
                          },
                        }}
                        onClick={item.action}
                      >
                        {item.icon}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: {  sm: "0.9rem" }, 
                            lineHeight: 1, 
                            textAlign: "center",
                            color: textColor,
                            marginLeft: "14px", 
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Button>
                    </Grid2>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <AddPost open={open} handleClose={handleClose} />
      <SearchDialog open={searchOpen} handleClose={searchHandleClose} />
    </>
  );
}

export default SmSideBar;
