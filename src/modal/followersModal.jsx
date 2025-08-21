import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Dialog,
  InputBase,
  useMediaQuery,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
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

export default function FOLLOWERMODAL({ open, handleClose, followerUsers = [] }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchKey, setSearchKey] = useState("");
  const { darkMode } = useCustomTheme();
  const navigate = useNavigate();

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  // Reset search input when modal is opened
  useEffect(() => {
    if (open) setSearchKey("");
  }, [open]);

  // Filter followers
  const filteredFollowers = followerUsers.filter((item) => {
    const user = item?.userId;
    if (!user) return false;

    const search = searchKey.trim().toLowerCase();
    return (
      user.userName?.toLowerCase().includes(search) ||
      user.name?.toLowerCase().includes(search)
    );
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="follower-dialog-title"
      PaperProps={{
        sx: {
          width: { xs: "90%", sm: "500px" },
          height: { xs: "60%", sm: "55vh", md: "65vh" },
          maxWidth: "none",
          backgroundColor: bgColor,
          color: textColor,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Search Bar */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: bgColor,
            p: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search followers…"
              inputProps={{ "aria-label": "search" }}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              autoFocus
            />
          </Search>
        </Box>

        {/* Follower List */}
        <Box
          sx={{
            px: 2,
            pt: 1,
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {filteredFollowers.length > 0 ? (
            filteredFollowers.map((item) => {
              const user = item.userId;
              return (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderBottom: "1px solid #eee",
                    gap: 2,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.action.hover, 0.1),
                    },
                  }}
                  onClick={() => {
                    handleClose();
                    navigate(`/profile/${user.userName}`);
                  }}
                >
                  <Avatar
                    src={user.profilePictureUrl || "/static/images/avatar/1.jpg"}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{user.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.name || ""}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" color="#8e8e8e">
                No followers found.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
