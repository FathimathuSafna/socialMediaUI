import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the menu icon
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import { FavoriteBorder, ChatBubbleOutline } from "@mui/icons-material";
import { getPostLikeCount } from "../service/postAPI";
import COMMANTMODAL from "../modal/commentModal";


function PostDetailModal({ open, handleClose, post, onDelete }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";

  // --- NEW: State and handlers for the menu ---
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [opened, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleOpenModal = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };
  const handleCloseModal = () => setOpen(false);

  const [likeCount, setLikeCount] = useState(0); // clear naming

  useEffect(() => {
    if (post?._id) {
      getPostLikeCount(post._id)
        .then((response) => {
          console.log("Fetched like count:", response.likeCount);
          setLikeCount(response.likeCount);
        })
        .catch((error) => console.error("Failed to fetch like count:", error));
    }
  }, [post]);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (!post) {
    return null;
  }

  const handleDelete = async () => {
    // First, close the menu
    handleCloseMenu();
    if (
      window.confirm("Are you sure you want to permanently delete this post?")
    ) {
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
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="post-detail-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "70%", sm: "40%", md: "50%" },
            maxWidth: { xs: "90vw", md: 300 },
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: bgColor,
            color: "#8e8e8e",
            border: 10,
            borderColor: bgColor,
          }}
        >
          {/* Container for the image and the menu icon */}
          <Box sx={{ position: "relative", flexGrow: 1, minHeight: 0 }}>
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
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1} padding="4px 8px">
              <IconButton size="small" sx={{ color: "#8e8e8e" }}>
                <FavoriteBorder sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  handleOpenModal(
                    post._id,
                    post.description,
                    post.userId.userName,
                    post.userId.profilePictureUrl
                  )
                }
                sx={{ color: "#8e8e8e" }}
              >
                <ChatBubbleOutline sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            <Box
              style={{
                fontWeight: "600",
                margin: "4px 0",
                fontSize: "14px",
                padding: "0 8px",
              }}
            >
              {likeCount} likes
            </Box>
            <Box sx={{ bgcolor: bgColor,pl:1 }}>
              <Typography>{post.description}</Typography>
            </Box>
          </Box>

          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{ color: "red" }}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </MenuItem>
          </Menu>
        </Box>
      </Modal>
      {opened && selectedPostId === post._id && (
        <COMMANTMODAL
          open={opened}
          handleClose={handleCloseModal}
          postId={selectedPostId}
          description={post.description}
          userName={post.userId.userName}
          profilePicture={post.userId.profilePictureUrl}
        />
      )}
    </>
  );
}

export default PostDetailModal;
