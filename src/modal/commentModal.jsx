import React, { useEffect,useState } from "react";
import { Modal, Box, Slide, Button, TextField } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useFormik } from "formik";
import { createComment,getComments } from "../service/commentAPI";

export default function SlideUpModal({ open, handleClose,postId }) {
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if(token){
    getComments(postId,token)
      .then((response) => { 
        setComments(response.data); // store comments related to the postId
      })
      .catch((error) => { 
        console.error("Error fetching comments:", error);
      }
    );
  }
  }, [token]);


  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    onSubmit: (values, { resetForm }) => {
        console.log("Submitting Comment:", values);
        createComment(
      { commentText: values.comment,postId},  
        { headers: { token: `${localStorage.getItem("token")}` } }
    )
      console.log("Submitted Comment:", values.comment);
      resetForm(); // Optional: resets the form after submission
      handleClose(); // Optional: close modal on submit
    },
  });

  

  return (
    <Modal open={open} onClose={handleClose}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            top: "50%",
            left: "20%",
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
          <Grid2 container direction="column" spacing={2} sx={{ flex: 1, width: "100%" }}>
            <Grid2 sx={{ flex: 1, overflowY: 'auto', maxHeight: 180 }}>
              {/* Render fetched comments here */}
              {comments && comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <Box key={idx} sx={{ mb: 1, p: 1, borderRadius: 1 }}>
                    <span style={{ fontWeight: 600 }}>{comment.userName}:</span> {comment.commentText}
                  </Box>
                ))
              ) : (
                <Box sx={{ color: '#888', fontSize: 14 }}>No comments yet.</Box>
              )}
            </Grid2>
          </Grid2>

          <Grid2
            container
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Grid2 xs={9}>
              <TextField
                fullWidth
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                placeholder="Type your comment here..."
                rows={1}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "2px dotted #555",
                    },
                    "&:hover fieldset": {
                      border: "2px dotted #000",
                    },
                    "&.Mui-focused fieldset": {
                      border: "2px dotted rgb(18, 18, 18)",
                    },
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
  );
}
