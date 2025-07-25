import React from "react";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import NAVBAR from "../components/Navbar/Navbar";
import SIDEBAR from "../components/sideBar/sideBar";
import POSTS from "../components/post/post";
import LIST from "../components/list/list";
import FOOTERBAR from "../components/sideBar/footerBar";
import SMALLBAR from "../components/sideBar/smSideBar";
import { Grid2 } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import PROFILE from "../staticPages/profile/profile";

function Pages() {
  const { darkMode } = useCustomTheme(); // Custom dark mode toggle

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const postBg = darkMode ? "#1e1e1e" : "#ffffff";
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile/");
  const userName = isProfilePage ? location.pathname.split("/")[2] : null;

  return (
    <Grid2
      container
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: "100vh",
        transition: "all 0.3s ease-in-out",
      }}
      direction="row"
    >
      {/* Sidebar Section */}
      <Grid2
        direction="column"
        size={{ xs: 2, sm: 2, md: 2, lg: 2 }}
        sx={{ bgcolor: bgColor }}
      >
        <Grid2
          xs={0}
          sm={12}
          md={12}
          lg={12}
          sx={{
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: textColor,
            padding: "10px",
            paddingTop: "15px",
            position: "fixed",
            top: "20px",
            display: { xs: "none", sm: "flex", md: "flex" },
          }}
        > aPPMoshere
        </Grid2>
        <Grid2
          md={12}
          lg={12}
          sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
        >
          <SIDEBAR />
        </Grid2>
        <Grid2 sm={12} sx={{ display: { xs: "none", sm: "flex", md: "none" } }}>
          <SMALLBAR />
        </Grid2>
      </Grid2>

      {/* Main Content Section */}

      <Grid2
        container
        direction="column"
        size={{ xs: 12, sm: 10, md: 10, lg: 10 }}
      >
        {/* Navbar Section */}
        {!isProfilePage && (
          <Grid2
            size={
              isProfilePage
                ? { xs: 0, sm: 0, md: 0 }
                : { xs: 12, sm: 10, md: 10 }
            }
            sx={{
              position: "relative",
              zIndex: 1000,
              display: isProfilePage
                ? "none"
                : { xs: "flex", sm: "flex", md: "flex" },
            }}
          >
            <Box
              sx={{
                position: "fixed",
                top: 0,
                zIndex: 1000,
                width: "100%",
                boxSizing: "border-box",
                gap: 3,
                bgcolor: bgColor,
                color: textColor,
                overflow: "hidden",
                height: "64px", // Ensure navbar height is fixed
                flexWrap: "wrap",
              }}
            >
              {" "}
              <NAVBAR />
            </Box>
          </Grid2>
        )}

        {/* Content Below Navbar */}
        <Grid2
          container
          size={
            isProfilePage
              ? { xs: 12, sm: 12, md: 10 }
              : { xs: 12, sm: 10, md: 10 }
          }
          sx={{
            marginTop: isProfilePage
              ? { xs: 0, sm: 2 }
              : { xs: "10px", sm: "13px" },
            flexDirection: "row",
          }}
        >
          <Grid2
            container
            size={{ xs: 12, sm: 12, md: 12, lg: 10 }}
            
            sx={{
              display: { md: "flex" },
              bgcolor: bgColor,
              color: textColor,
              p: 1,
            }}
          >
            <Grid2
              size={
                isProfilePage
                  ? { xs: 12, sm: 12, md: 12 }
                  : { xs: 12, sm: 10, md: 10 }
              }
              offset={isProfilePage ? {md:0}:{sm:2,md:1}}
              sx={{
                mt: 2,
                
              }}
            >
              {isProfilePage ? <PROFILE userName={userName} /> : <POSTS />}
            </Grid2>
          </Grid2>

          {/* List Section */}
          <Grid2
            container
            size={{ sm: 2, md: 2, lg: 2 }}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <Grid2
              direction="column"
              sx={{
                color: textColor,
                position: { md: "fixed" },
                paddingLeft: 1,
                pt: 8,
                pb: 3,
                width: "100%",
              }}
              size={{ xs: 12, sm: 2, md: 2, lg: 2 }}
              pt={8}
              pb={3}
            >
              <LIST />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Footer Section */}
      <Grid2 sx={{ display: { xs: "flex", sm: "none", md: "none" } }}>
        <FOOTERBAR />
      </Grid2>
    </Grid2>
  );
}

export default Pages;
