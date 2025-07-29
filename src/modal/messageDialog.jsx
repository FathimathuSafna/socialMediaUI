import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Avatar,
  Divider,
  InputBase,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Grid2,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { getAllUsers } from "../service/userApi";
import { useNavigate } from "react-router-dom";
import Messages from "../staticPages/messages";
import { useParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const { userName } = useParams();
  const activeUserName = userName || selectedUserName;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(); // Fetch all users
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
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 0, flex: 1 }} variant="h6" component="div">
            Messages
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid2 container direction={"row"} xs={12}>
        <Grid2 item direction={"column"} xs={5} sx={{ p: 2 }}>
          <Grid2>
            <Search>
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
          </Grid2>
          <Grid2>
            <Box
              sx={{
                px: 2,
                pt: 1,
                overflowY: "auto",
                maxHeight: "calc(100vh - 80px)",
                maxWidth: "calc(100vh-10px)",
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #eee",
                      gap: 2,
                    }}
                    onClick={() => {
                      setSelectedUserName(user.userName);
                      navigate(`/message/${user.userName}`, { replace: false });
                    }}
                  >
                    <Avatar
                      src={
                        user.profileImageUrl || "/static/images/avatar/1.jpg"
                      }
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <strong>{user.userName}</strong>
                      <br />
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {user.name}
                      </span>
                    </Box>
                    {/* <Grid2 sx={{ marginLeft: "auto" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFollow(user._id)}
                  >
                    Follow
                  </Button>
                </Grid2> */}
                  </Box>
                ))
              ) : searchKey.trim() !== "" ? (
                <Box sx={{ textAlign: "center", mt: 2, color: "#999" }}>
                  No users found.
                </Box>
              ) : null}
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 item xs={7} direction="column">
          {activeUserName ? (
            <Messages userName={activeUserName} />
          ) : (
            <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>
              Select a user to start messaging.
            </Box>
          )}
        </Grid2>
      </Grid2>
    </Dialog>
  );
}
