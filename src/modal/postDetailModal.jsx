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
import LIKEDMODAL from "../modal/likedUsersModal";

function PostDetailModal({ open, handleClose, post, onDelete }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";

  // --- NEW: State and handlers for the menu ---
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [opened, setOpen] = useState(false);
  const [openLikeModal, setOpenLikeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleLikeOpenModal = (postId) => {
    setSelectedPostId(postId);
    setOpenLikeModal(true);
  };
  const handleLikeCloseModal = () => setOpenLikeModal(false);
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
          className="glass-panel"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: "400px" },
            bgcolor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)",
            color: darkMode ? "#f8fafc" : "#0f172a",
            borderRadius: "28px",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            boxShadow: darkMode
              ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
              : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
            overflow: "hidden",
          }}
        >
          {/* Image + Menu */}
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
            <img
              src={post.postImageUrl}
              alt="User post"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClickMenu}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(9, 13, 22, 0.6)",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(9, 13, 22, 0.8)",
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Icons and Description */}
          <Box sx={{ p: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <IconButton
                size="small"
                sx={{
                  color: "#ef4444",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.15)" }
                }}
                onClick={() => handleLikeOpenModal(post._id)}
              >
                <FavoriteBorder sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenModal(post._id)}
                sx={{
                  color: "#6366f1",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.15)" }
                }}
              >
                <ChatBubbleOutline sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", mb: 1, color: darkMode ? "#cbd5e1" : "#475569" }}>
              {likeCount} likes
            </Typography>

            <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.5, color: darkMode ? "#cbd5e1" : "#475569" }}>
              {post.description}
            </Typography>
          </Box>

          {/* Menu for delete */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                bgcolor: darkMode ? "#0f1626" : "#ffffff",
                color: darkMode ? "#f8fafc" : "#0f172a",
                borderRadius: "12px",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }
            }}
          >
            <MenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{ color: "#ef4444", fontWeight: 700, fontSize: "0.85rem" }}
            >
              {isDeleting ? <CircularProgress size={20} sx={{ color: "#ef4444" }} /> : "Delete"}
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
      {openLikeModal && selectedPostId === post._id && (
        <LIKEDMODAL
          open={openLikeModal}
          handleClose={handleLikeCloseModal}
          postId={selectedPostId}
        />
      )}
    </>
  );
}

export default PostDetailModal;
