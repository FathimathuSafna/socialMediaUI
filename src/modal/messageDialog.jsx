import React, { useState, useEffect } from "react";
import {
  Dialog,
  Avatar,
  InputBase,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { getMsgUser } from "../service/messageAPI";
import { useParams } from "react-router-dom";
import Messages from "../staticPages/messages";
import { useTheme as useCustomTheme } from "../store/ThemeContext";


// ... Search styles (unchanged)
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function MessageDialog({ open, handleClose }) {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "var(--bg-primary)" : "var(--bg-primary)";
  const textColor = darkMode ? "#f8fafc" : "#0f172a";

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const { userName } = useParams();

  useEffect(() => {
    if (userName) setSelectedUserName(userName);
  }, [userName]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getMsgUser();
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
    if (!value.trim()) return setSearchResults([]);

    const filtered = allUsers.filter(
      (user) =>
        user.userName?.toLowerCase().includes(value.toLowerCase()) ||
        user.name?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const usersToDisplay = searchKey.trim() === "" ? allUsers : searchResults;

  const handleBackToUsers = () => {
    setSelectedUserName(null);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <AppBar
        elevation={0}
        sx={{
          position: "relative",
          backdropFilter: "blur(28px)",
          backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(248, 250, 252, 0.75)",
          color: textColor,
          borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          boxShadow: darkMode
            ? "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 4px 20px rgba(15, 23, 42, 0.03), inset 0 -1px 0 0 rgba(255, 255, 255, 0.7)",
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} sx={{ mr: 1.5 }}>
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{
              flex: 1,
              fontWeight: 800,
              fontSize: "1.2rem",
              letterSpacing: "-0.5px"
            }}
            variant="h6"
          >
            Direct Messages
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          overflow: "auto",
          flexGrow: 1,
          display: "flex",
          height: "100%",
          width: "100%",
          bgcolor: bgColor,
          color: textColor,
        }}
      >
        {isXs ? (
          selectedUserName ? (
            <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
              <Messages userName={selectedUserName} onBack={handleBackToUsers} />
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                px: 3,
                pt: 3,
                overflowY: "auto",
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
                  value={searchKey}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </Search>

              <Box mt={2.5}>
                {usersToDisplay.length ? (
                  usersToDisplay.map((user) => (
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
                      onClick={() => setSelectedUserName(user.userName)}
                    >
                      <Avatar
                        src={
                          user.profileImageUrl || "/static/images/avatar/1.jpg"
                        }
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
                ) : (
                  <Box textAlign="center" mt={4} color={darkMode ? "#94a3b8" : "#64748b"} sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    No users found.
                  </Box>
                )}
              </Box>
            </Box>
          )
        ) : (
          <>
            <Box
              sx={{
                width: "30%",
                minWidth: "280px",
                maxWidth: "400px",
                borderRight: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
                px: 3,
                pt: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Search sx={{
                backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
                borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                mb: 2.5,
              }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search by name…"
                  value={searchKey}
                  onChange={handleSearchChange}
                />
              </Search>

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  }
                }}
              >
                {usersToDisplay.map((user) => (
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
                    onClick={() => setSelectedUserName(user.userName)}
                  >
                    <Avatar
                      src={
                        user.profileImageUrl || "/static/images/avatar/1.jpg"
                      }
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
                ))}
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto", height: "100%" }}>
              {selectedUserName ? (
                <Messages userName={selectedUserName} onBack={handleBackToUsers} />
              ) : (
                <Box sx={{ textAlign: "center", mt: 20, color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.5px" }}>
                  Select a contact to start messaging
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
}
