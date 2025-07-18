import React from "react";
import { Modal, Box, Button, CircularProgress, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import the menu icon
import { useTheme as useCustomTheme } from "../store/ThemeContext";

function PostDetailModal({ open, handleClose, post, onDelete }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";

  // --- NEW: State and handlers for the menu ---
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  // --- END NEW ---

  if (!post) {
    return null;
  }

  const handleDelete = async () => {
    // First, close the menu
    handleCloseMenu();
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      setIsDeleting(true);
      try {
        await onDelete(post._id);
      } catch (error) {
        alert("Could not delete the post. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="post-detail-modal-title"
    >
      <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "70%", sm: "40%", md: "50%" }, // Adjusted width
          maxWidth: { xs: '90vw', md: 300 }, // Adjusted max-width
          maxHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: bgColor,
          color: "#8e8e8e"
      }}>
        

        {/* Container for the image and the menu icon */}
        <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0 }}>
          <img
            src={post.postImageUrl}
            alt="User post"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            <MoreVertIcon />
          </IconButton>
          {/* <Box>
           <h1>{post.description}</h1> 
          </Box> */}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleDelete} disabled={isDeleting} sx={{ color: 'red' }}>
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
          </MenuItem>
        </Menu>
       
      </Box>
    </Modal>
  );
}

export default PostDetailModal;