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
import { useParams } from "react-router-dom";


function Pages() {
  const { darkMode } = useCustomTheme(); // Custom dark mode toggle

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const location = useLocation();
    const { userName } = useParams(); 
    console.log(userName)
    
  const isProfilePage = !!userName;
const isNotProfilePage = !userName;  

  return (
    <Grid2
      container
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: "100vh",
        transition: "all 0.3s ease-in-out",
        mt: 0,
        ml: 0,
      }}
      direction="row"
    >
      {/* Sidebar Section */}
      <Grid2
        direction="column"
        size={{ xs: 2, sm: 3, md: 2, lg: 2 }}
        sx={{ bgcolor: bgColor, mt: 0, borderRight: "1px solid #ccc" }}
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
            left: "5px",
            display: { xs: "none", sm: "flex", md: "flex" },
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontFamily: "'Pacifico', cursive",
              paddingTop: 0,
              paddingLeft:{md:2,sm:0},
              paddingBottom: 4,
              color: darkMode ? textColor :"#075E54",
            }}
          >
            Appmosphere
          </Typography>
        </Grid2>
        <Grid2
          md={12}
          lg={12}
          sx={{
            display: { xs: "none", sm: "none", md: "flex" },
            pl: { xs: 0, md: 10 }, // shorthand for paddingLeft
            width: "100%",
          }}
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
        size={{ xs: 12, sm: 9, md: 10, lg: 10 }}
        sx={{ bgcolor: bgColor }}
      >
        {/* Navbar Section */}

        <NAVBAR />

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
            bgcolor: bgColor,
          }}
        >
          <Grid2
            container
            size={{ xs: 12, sm: 12, md: 12, lg: 10 }}
            sx={{
              display: { md: "flex" },
              bgcolor: bgColor,
              p: 1,
            }}
          >
            <Grid2
              size={
                isProfilePage
                  ? { xs: 12, sm: 12, md: 12 }
                  : { xs: 12, sm: 10, md: 10 }
              }
              offset={isProfilePage ? { md: 0 } : { sm: 2, md: 1 }}
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
             <LIST  userName={userName}/>
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
