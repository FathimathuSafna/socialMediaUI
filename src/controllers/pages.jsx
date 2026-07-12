import React from "react";
import { useLocation } from "react-router-dom";
import NAVBAR from "../components/Navbar/Navbar";
import SIDEBAR from "../components/sideBar/sideBar";
import POSTS from "../components/post/post";
import LIST from "../components/list/list";
import { Box, Typography, Divider } from "@mui/material";
import FOOTERBAR from "../components/sideBar/footerBar";
import SMALLBAR from "../components/sideBar/smSideBar";
import { Grid2 } from "@mui/material";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import PROFILE from "../staticPages/profile/profile";
import "@fontsource/pacifico";
import ChatbotWidget from "../components/chatbotWidget/chatbotWidget";

function Pages() {
  const { darkMode } = useCustomTheme();

  const bgColor = darkMode ? "var(--bg-primary)" : "var(--bg-primary)";
  const textColor = darkMode ? "var(--text-primary)" : "var(--text-primary)";
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const userName = pathSegments.length > 2 ? pathSegments[2] : pathSegments[1];
  const isProfilePage = location.pathname.startsWith("/profile/");

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: "100vh",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Navbar Section */}
      <NAVBAR />

      {/* Sidebar Section */}
      <SIDEBAR />

      {/* Main Content Section */}
      <Box
        sx={{
          pt: "60px", // Offset for top fixed navbar
          pl: { xs: 0, sm: "180px", md: "240px" }, // Offset for left fixed sidebar
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Grid2
          container
          spacing={4}
          sx={{
            width: "100%",
            m: 0,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Main Feed or Profile Section */}
          <Grid2
            size={isProfilePage ? { xs: 12 } : { xs: 12, md: 8, lg: 8.5 }}
            sx={{
              p: 0,
            }}
          >
            {isProfilePage ? (
              <PROFILE userName={userName} />
            ) : (
              <Box sx={{ maxWidth: "600px", mx: "auto" }}>
                <POSTS />
              </Box>
            )}
          </Grid2>

          {/* Right Suggested List Column */}
          {!isProfilePage && (
            <Grid2
              size={{ md: 4, lg: 3.5 }}
              sx={{
                display: { xs: "none", md: "block" },
                p: 0,
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: "84px", // Navbar offset + padding
                }}
              >
                <LIST userName={userName} />
              </Box>
            </Grid2>
          )}
        </Grid2>
      </Box>

      {/* Footer Section for Mobile */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <FOOTERBAR />
      </Box>

      {/* Global AI Chatbot Assistant */}
      <ChatbotWidget />
    </Box>
  );
}

export default Pages;
