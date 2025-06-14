import React, { useEffect, useState } from "react";
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
import { createComment, getComments, editComment } from "../service/commentAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;
const menuOptions = ["Edit", "Delete", "Report"];

export default function SlideUpModal({ open, handleClose, postId }) {
  const [comments, setComments] = useState([]);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const token = localStorage.getItem("token");

  const fetchComments = () => {
    if (token && postId) {
      getComments(postId, token)
        .then((response) => setComments(response.data))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [token, postId]);

  const formik = useFormik({
    initialValues: { comment: "" },
    onSubmit: (values, { resetForm }) => {
      createComment(
        { commentText: values.comment, postId },
        { headers: { token } }
      )
        .then(() => {
          resetForm();
          fetchComments();
        })
        .catch((err) => console.error("Error submitting comment:", err));
    },
  });

  const editFormik = useFormik({
    initialValues: { editedComment: "" },
    onSubmit: (values, { resetForm }) => {
      if (!editingComment) return;

      editComment(
        {
          commentId: editingComment._id,
          commentText: values.editedComment,
        },
        { headers: { token } }
      )
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
    editFormik.setFieldValue("editedComment", comment.commentText);
    setEditModalOpen(true);
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
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              bottom: 0,
              position: "absolute",
              width: "40%",
              bgcolor: "background.paper",
              p: 4,
              boxShadow: 24,
              borderRadius: "10px 10px 0 0",
            }}
          >
            {/* Comment List */}
            <Grid2 container direction="column" spacing={2} sx={{ flex: 1, width: "100%" }}>
              <Grid2 sx={{ flex: 1, overflowY: "auto", maxHeight: 180 }}>
                {comments.length > 0 ? (
                  comments.map((comment, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#f7f7f7",
                      }}
                    >
                      <Box>
                        <span style={{ fontWeight: 600 }}>{comment.userName}:</span>{" "}
                        {comment.commentText}
                      </Box>
                      <Box>
                        <IconButton
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
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: "20ch",
                            },
                          }}
                        >
                          {menuOptions.map((option) => (
                            <MenuItem
                              key={option}
                              onClick={() =>
                                option === "Edit"
                                  ? handleEditClick(comment, idx)
                                  : handleMenuClose(idx)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ color: "#888", fontSize: 14 }}>No comments yet.</Box>
                )}
              </Grid2>
            </Grid2>

            {/* Comment Input */}
            <Grid2 container spacing={1} sx={{ width: "100%", alignItems: "center" }}>
              <Grid2 xs={9}>
                <TextField
                  fullWidth
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  placeholder="Type your comment here..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "2px dotted #555" },
                      "&:hover fieldset": { border: "2px dotted #000" },
                      "&.Mui-focused fieldset": { border: "2px dotted rgb(18, 18, 18)" },
                    },
                  }}
                />
              </Grid2>
              <Grid2 xs={3}>
                <Button type="submit" variant="contained" fullWidth>
                  Comment
                </Button>
              </Grid2>
            </Grid2>
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
          <Typography variant="h6" mb={2}>Edit Comment</Typography>
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
            <Button type="submit" onClick={setEditingComment[comment._id]} variant="contained">
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
