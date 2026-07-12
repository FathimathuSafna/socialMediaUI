import React, { use, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Slide,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useFormik } from "formik";
import {
  createComment,
  getComments,
  editComment,
  deleteComment,
} from "../service/commentAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import SendIcon from "@mui/icons-material/Send";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";

const ITEM_HEIGHT = 48;

export default function SlideUpModal({
  open,
  handleClose,
  postId,
  description,
  userName,
  profilePicture,
}) {
  const [comments, setComments] = useState([]);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  const fetchComments = () => {
    if (postId) {
      setLoading(true);
      getComments(postId)
        .then((response) => {
          setComments(response.data);
          setLoading(false);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const formik = useFormik({
    initialValues: { comment: "" },
    onSubmit: (values, { resetForm }) => {
      createComment({ commentText: values.comment, postId })
        .then(() => {
          resetForm();
          fetchComments();
        })
        .catch((err) => console.error("Error submitting comment:", err));
    },
  });

  const editFormik = useFormik({
    initialValues: { editedComment: "" },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (!editingComment) return;

      editComment({
        commentId: editingComment.commentId,
        commentText: values.editedComment,
      })
        .then(() => {
          resetForm();
          setEditModalOpen(false);
          setEditingComment(null);
          fetchComments();
        })
        .catch((err) => console.error("Error editing comment:", err));
    },
  });

  const handleMenuOpen = (event, idx) => {
    setMenuAnchorEls((prev) => ({ ...prev, [idx]: event.currentTarget }));
  };

  const handleMenuClose = (idx) => {
    setMenuAnchorEls((prev) => ({ ...prev, [idx]: null }));
  };

  const handleEditClick = (comment, idx) => {
    setEditingComment(comment);
    editFormik.setFieldValue(
      "editedComment",
      comment.commentText,
      comment.commentId
    );
    setEditModalOpen(true);
    handleMenuClose(idx);
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(() => {
        fetchComments();
      })
      .catch((err) => console.error("Error deleting comment:", err));
  };

  return (
    <>
      {/* Main Comment Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Slide direction="up" in={open}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            className="glass-panel"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: {
                xs: "90%",
                sm: "500px",
              },
              height: { xs: "75vh", sm: "60vh" },
              bgcolor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)",
              color: textColor,
              p: 3.5,
              boxShadow: darkMode
                ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
                : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
              borderRadius: "28px",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
              overflow: "hidden",
            }}
          >
            {/* Header info */}
            <Grid2 container direction="row" alignItems="center" mb={2.5} gap={1.5} sx={{ pb: 2, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              <Avatar
                src={profilePicture ? profilePicture : "/broken-image.jpg"}
                sx={{
                  width: 40,
                  height: 40,
                  border: `1.5px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: textColor }}>
                  {userName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: darkMode ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Grid2>

            {/* Comment List */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                mb: 2.5,
              }}
            >
              {loading ? (
                <Box>
                  {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ mb: 2, display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                      <Skeleton variant="text" width="70%" height={24} sx={{ bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                    </Box>
                  ))}
                </Box>
              ) : comments.length > 0 ? (
                comments.map((comment, idx) => {
                  const menuOptions = comment.isEditable
                    ? ["Edit", "Delete"]
                    : ["Report"];

                  return (
                    <Box
                      key={comment.commentId || idx}
                      sx={{
                        mb: 1.5,
                        p: 1.5,
                        borderRadius: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0, 0, 0, 0.03)"}`,
                      }}
                    >
                      <Box display="flex" gap={1.5} alignItems="center">
                        <Avatar
                          src={comment.profilePicture || "/broken-image.jpg"}
                          sx={{
                            width: 32,
                            height: 32,
                            border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                          }}
                        />
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: textColor, display: "inline-block", mr: 0.5 }}>
                            {comment.userName}
                          </Typography>
                          <Typography sx={{ fontSize: "0.85rem", color: darkMode ? "#cbd5e1" : "#475569", display: "inline" }}>
                            {comment.commentText}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}
                          size="small"
                          onClick={(e) => handleMenuOpen(e, idx)}
                          aria-controls={`menu-${idx}`}
                          aria-haspopup="true"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          id={`menu-${idx}`}
                          anchorEl={menuAnchorEls[idx]}
                          open={Boolean(menuAnchorEls[idx])}
                          onClose={() => handleMenuClose(idx)}
                          PaperProps={{
                            sx: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: "16ch",
                              bgcolor: darkMode ? "#0f1626" : "#ffffff",
                              color: textColor,
                              borderRadius: "12px",
                              border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          {menuOptions.map((option) => (
                            <MenuItem
                              key={option}
                              sx={{ fontSize: "0.85rem", fontWeight: 600 }}
                              onClick={() => {
                                if (option === "Edit") {
                                  handleEditClick(comment, idx);
                                } else if (option === "Delete") {
                                  handleDeleteComment(comment.commentId);
                                  handleMenuClose(idx);
                                } else {
                                  handleMenuClose(idx);
                                }
                              }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ color: darkMode ? "#94a3b8" : "#64748b", fontSize: "0.85rem", textAlign: "center", mt: 4, fontWeight: 500 }}>
                  No comments yet. Be the first to share your thoughts!
                </Box>
              )}
            </Box>

            {/* Comment Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                pt: 1.5,
                borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
              }}
            >
              <TextField
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                placeholder="Write a comment..."
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: "14px",
                    color: textColor,
                    backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.15)`,
                    },
                  },
                }}
              />

              <IconButton
                type="submit"
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  p: 1.2,
                  "&:hover": {
                    background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Slide>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          component="form"
          onSubmit={editFormik.handleSubmit}
          className="glass-panel"
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            width: { xs: "90%", sm: "400px" },
            bgcolor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)",
            p: 4,
            borderRadius: "28px",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            boxShadow: darkMode
              ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
              : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
          }}
        >
          <Typography
            variant="h6"
            mb={2.5}
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color: textColor,
              letterSpacing: "-0.2px",
            }}
          >
            Edit Comment
          </Typography>
          <TextField
            fullWidth
            name="editedComment"
            value={editFormik.values.editedComment}
            onChange={editFormik.handleChange}
            variant="outlined"
            multiline
            rows={3}
            InputProps={{
              sx: {
                borderRadius: "14px",
                color: textColor,
                backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6366f1",
                  boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.15)`,
                },
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
            <Button
              onClick={() => setEditModalOpen(false)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: darkMode ? "#94a3b8" : "#64748b",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: textColor,
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                px: 3,
                py: 1,
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",
                  transform: "translateY(-1px)",
                }
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
