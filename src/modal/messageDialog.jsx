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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
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
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
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
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

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
    <Dialog fullScreen open={open} onClose={handleClose} sx={{display:'flex',flexDirection: 'column'}}>
      <AppBar sx={{ position: "relative", backgroundColor: darkMode ? "#3a3a3a" : "#075E54"}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ flex: 1 }} variant="h6">
            Messages
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ overflow:'auto',flexGrow:1,display: "flex", height: "100%", width: "100%" ,bgcolor:bgColor,color:textColor}}>
        {isXs ? (
          selectedUserName ? (
            <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
              <Messages userName={selectedUserName} onBack={handleBackToUsers} />
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                px: 2,
                pt: 2,
                overflowY: "auto",
                
              }}
            >
              <Search>
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

              <Box mt={2} >
                {usersToDisplay.length ? (
                  usersToDisplay.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderBottom: "1px solid #eee",
                        gap: 2,
                        cursor: "pointer",
                        
                      }}
                      onClick={() => setSelectedUserName(user.userName)}
                    >
                      <Avatar
                        src={
                          user.profileImageUrl || "/static/images/avatar/1.jpg"
                        }
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <strong>{user.userName}</strong>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {user.name}
                        </div>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" mt={2} color="#999">
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
                width: "25%",
                minWidth: "250px",
                maxWidth: "400px",
                borderRight: "1px solid #ddd",
                px: 2,
                pt: 2,
              }}
            >
              <Search>
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
                mt={2}
                sx={{ overflowY: "auto", height: "calc(100% - 60px)" }}
              >
                {usersToDisplay.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #eee",
                      gap: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedUserName(user.userName)}
                  >
                    <Avatar
                      src={
                        user.profileImageUrl || "/static/images/avatar/1.jpg"
                      }
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <strong>{user.userName}</strong>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {user.name}
                      </div>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
              {selectedUserName ? (
                  <Messages userName={selectedUserName} onBack={handleBackToUsers} />
              ) : (
                <Box textAlign="center" mt={20} color="#888">
                  Select a user to start messaging.
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
}
