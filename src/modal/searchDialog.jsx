import React, { useState, useEffect} from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  InputBase,
  useMediaQuery,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { getAllUsers } from "../service/userAPI"; 
import Grid2 from "@mui/material/Grid2";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import { followUser,getFollowers } from "../service/followApi";
import { useNavigate } from "react-router-dom";



// Styled Components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "16px",
  backgroundColor: "rgba(0, 0, 0, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "&:focus-within": {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.15)",
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: "0.95rem",
    fontWeight: 500,
  },
}));

export default function ResponsiveDialog({ open, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.9)";
  const textColor = darkMode ? "#f8fafc" : "#0f172a";
  const navigate = useNavigate();

  // Fetch all users once when dialog opens
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (open) {
      fetchUsers();
      setSearchKey("");
      setSearchResults([]);
    }
  }, [open]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.userName?.toLowerCase().includes(value.toLowerCase()) ||
        user.name?.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(filtered);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: { xs: "90%", sm: "500px" },
          height: { xs: "70%", sm: "55vh", md: "60vh" },
          maxWidth: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden",
        },
      }}
    >
      <Box
        className="glass-panel"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px",
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          boxShadow: darkMode
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
          }}
        >
          <Search sx={{
            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
            borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
          }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by name…"
              inputProps={{ "aria-label": "search" }}
              value={searchKey}
              onChange={handleSearchChange}
              autoFocus
            />
          </Search>
        </Box>

        <Box
          sx={{
            flex: 1,
            px: 3,
            py: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            }
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: "16px",
                  mb: 1,
                  gap: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"}`,
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.03)",
                    transform: "translateX(4px)",
                    borderColor: "transparent",
                  }
                }}
                onClick={() => {
                  handleClose();
                  navigate(`/profile/${user.userName}`);
                }}
              >
                <Avatar
                  src={user.profilePictureUrl || "/static/images/avatar/1.jpg"}
                  sx={{
                    width: 42,
                    height: 42,
                    border: `1.5px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: textColor }}>
                    {user.userName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : searchKey.trim() !== "" ? (
            <Box sx={{ textAlign: "center", mt: 4, color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500, fontSize: "0.9rem" }}>
              No users found.
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", mt: 4, color: darkMode ? "#64748b" : "#94a3b8", fontWeight: 500, fontSize: "0.85rem", letterSpacing: "0.5px" }}>
              Start typing to search users
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
