import React, { useState } from "react";
import { Avatar, Box, Button, InputBase } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { getAllUsers } from "../service/userApi";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
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
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function ResponsiveDialog({ open, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchKey(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await getAllUsers( value); // Pass search key if your API supports it
      setSearchResults(response.data); // Adjust if your API returns differently
    } catch (error) {
      setSearchResults([]);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        width="100%"
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Box sx={{ p: 2, height: 350, minWidth:{ xs:80, sm: 100 , md: 400,lg:600} }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchKey}
              onChange={handleSearchChange}
              autoFocus
            />
            {searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  zIndex: 1200,
                  width: "100%",
                  boxShadow: 3,
                  maxHeight: 250,
                  overflowY: "auto",
                  borderRadius: 1,
                  mt: 3,
                }}
              >
                {searchResults.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #eee",
                      gap: 2, // space between avatar and text
                    }}
                  >
                    <Avatar
                      src={
                        user.profileImageUrl || "/static/images/avatar/1.jpg"
                      }
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box>
                      <strong>{user.userName}</strong>
                      <br />
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {user.name}
                      </span>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Search>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
