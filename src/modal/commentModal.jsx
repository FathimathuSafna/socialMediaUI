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

const ITEM_HEIGHT = 48;

export default function SlideUpModal({
  open,
  handleClose,
  postId,
  description,
  userName,
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
          setComments(response.data)
        setLoading(false)
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
    console.log("Editing ................:", comment);
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
    handleMenuClose(idx);
  };

  return (
    <>
      {/* Main Comment Modal */}
      <Modal open={open} onClose={handleClose}>
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              top: "20%",
              left: "27%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              bottom: 0,
              position: "absolute",
              width: "40%",
              bgcolor: bgColor,
              textColor: textColor,
              p: 4,
              boxShadow: 24,
              borderRadius: "10px 10px 0 0",
              overflowY: "hidden",
            }}
          >
            <Grid2 container direction="row" mb={3} spacing={2}>
              <Grid2
                xs={6}
                sx={{
                  textAlign: "left",
                  fontSize: "15px",
                  color: textColor,
                  fontWeight: "bold",
                  fontFamily: "Arial", // Make sure the font is available
                }}
              >
                {userName}
              </Grid2>

              <Grid2 xs={6}>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: 14,
                    color: textColor,
                    fontWeight: "light",
                    fontFamily: "Georgia",
                  }}
                >
                  {description}
                </Typography>
              </Grid2>
            </Grid2>

            {/* Comment List */}
            <Grid2
              container
              direction="column"
              spacing={1}
              sx={{
                width: "100%",
                display: "flex",
                flexGrow: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              <Grid2 sx={{ flex: 1, scrollbarWidth: "none" }}>
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Skeleton
                          variant="text"
                          width="80%"
                          height={32}
                          sx={{ bgcolor: darkMode ? "#333" : "#ccc" }}
                        />
                      </Box>
                    ))}
                  </>
                ) : comments.length > 0 ? (
                  comments.map((comment, idx) => {
                    const menuOptions = comment.isEditable
                      ? ["Edit", "Delete"]
                      : ["Report"];

                    return (
                      <Grid2>
                        <Box
                          key={idx}
                          sx={{
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <span
                              style={{
                                fontWeight: 900,
                                fontSize: 17,
                                color: textColor,
                              }}
                            >
                              {comment.userName}:
                            </span>{" "}
                            <span style={{ fontSize: 16, color: textColor }}>
                              {comment.commentText}
                            </span>
                          </Box>
                          <Box>
                            <IconButton
                              sx={{ color: textColor }}
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
                                  width: "20ch",
                                  bgcolor: bgColor,
                                  color: textColor,
                                },
                              }}
                            >
                              {menuOptions.map((option) => (
                                <MenuItem
                                  key={option}
                                  onClick={() => {
                                    if (option === "Edit") {
                                      handleEditClick(comment, idx);
                                    } else if (option === "Delete") {
                                      handleDeleteComment(
                                        comment.commentId,
                                        idx
                                      );
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
                      </Grid2>
                    );
                  })
                ) : (
                  <Box sx={{ color: textColor, fontSize: 14 }}>
                    No comments yet.
                  </Box>
                )}
              </Grid2>
            </Grid2>

            {/* Comment Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1, // spacing between TextField and Button
                width: "100%", // take full available width
              }}
            >
              <TextField
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                placeholder="Type your comment here..."
                fullWidth
                sx={{
                  color: textColor,
                  backgroundColor: bgColor,
                  "& .MuiInputBase-input": {
                    height: "20px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: textColor,
                    backgroundColor: bgColor,
                  },
                  "& .MuiOutlinedInput-root": {
                    minHeight: "32px",
                    backgroundColor: bgColor,
                    "& fieldset": { border: "2px dotted #555" },
                    "&:hover fieldset": { border: "2px dotted #000" },
                    "&.Mui-focused fieldset": {
                      border: "2px dotted rgb(18, 18, 18)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: bgColor,
                  color: textColor,
                  boxShadow: "none",
                  fontSize: "13px",
                  minWidth: "50px",
                  padding: "6px 12px",
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Slide>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          component="form"
          onSubmit={editFormik.handleSubmit}
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            width: "30%",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
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
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setEditModalOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained">
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
