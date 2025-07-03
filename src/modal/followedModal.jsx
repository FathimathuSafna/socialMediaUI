import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Dialog,
  InputBase,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import { getUserFollowings } from "../service/followApi";
import { useNavigate } from "react-router-dom";

// Styled Components
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

export default function ResponsiveDialog({open,handleClose} ) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchKey, setSearchKey] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const navigate = useNavigate();

  // Fetch all followings when dialog opens
  useEffect(() => {
      fetchUsers();
      setSearchKey("");
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUserFollowings();
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users based on searchKey
  const filteredUsers = searchKey.trim()
    ? allUsers.filter(
        (item) =>
          item.followedUserId.userName
            ?.toLowerCase()
            .includes(searchKey.toLowerCase()) ||
          item.followedUserId.name
            ?.toLowerCase()
            .includes(searchKey.toLowerCase())
      )
    : allUsers;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: { xs: "80%", sm: "500px", lg: "500px" },
          height: { xs: "60%", sm: "55vh", md: "65vh" },
          maxWidth: "none",
          backgroundColor: bgColor,
          color: textColor,
          scrollbarWidth: "none",
        },
      }}
    >
      <Box sx={{ height: "100%", position: "relative" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "#fff",
            p: 2,
            borderBottom: "1px solid #ddd",
            backgroundColor: bgColor,
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by name…"
              inputProps={{ "aria-label": "search" }}
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              autoFocus
            />
          </Search>
        </Box>

        <Box
          sx={{
            px: 2,
            pt: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 80px)",
            maxWidth: "calc(100vh-10px)",
          }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((item) => {
              const user = item.followedUserId;
              return (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderBottom: "1px solid #eee",
                    gap: 2,
                  }}
                  onClick={() => navigate(`/profile/${user.userName}`)}
                >
                  <Avatar
                    src={user.profileImageUrl || "/static/images/avatar/1.jpg"}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <strong>{user.userName}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: "#888" }}>
                      {user.name}
                    </span>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ textAlign: "center", mt: 2, color: "#999" }}>
              No users found.
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}