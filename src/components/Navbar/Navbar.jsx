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
        height: 60,
        backdropFilter: "blur(28px)",
        backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(248, 250, 252, 0.75)",
        color: textColor,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
        boxShadow: darkMode
          ? "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)"
          : "0 4px 20px rgba(15, 23, 42, 0.03), inset 0 -1px 0 0 rgba(255, 255, 255, 0.7)",
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          px: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          className="shimmer-text"
          sx={{
            fontSize: 26,
            fontFamily: "'Pacifico', cursive",
            background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 50%, #6366f1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => navigate("/")}
        >
          Appmosphere
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{
              p: 1,
              borderRadius: "14px",
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              "& svg": {
                transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              },
              "&:hover": {
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                "& svg": {
                  transform: "rotate(45deg) scale(1.1)",
                }
              }
            }}
          >
            {darkMode ? (
              <Brightness7Icon sx={{ fontSize: 20, color: "#fbbf24" }} />
            ) : (
              <Brightness4Icon sx={{ fontSize: 20, color: "#475569" }} />
            )}
          </IconButton>

          <Button
            color="inherit"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: "12px",
              px: 2.5,
              py: 0.8,
              backgroundColor: darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
              color: "#ef4444",
              border: `1px solid ${darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.15)"}`,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "#ef4444",
                color: "#ffffff",
                boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.3)",
                transform: "translateY(-1px)",
              }
            }}
          >
            <ExitToAppTwoToneIcon sx={{ mr: 0.6, fontSize: 18 }} />
            Sign Out
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
}