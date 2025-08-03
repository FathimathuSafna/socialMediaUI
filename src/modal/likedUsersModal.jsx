import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography, Box, Modal } from "@mui/material";
import { likeUsers } from "../service/likeAPI";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function LIKEDMODAL({ open, handleClose, postId }) {
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const navigate = useNavigate();

  const [users, setuser] = useState([]);

  const getLikedUsers = (postId) => {
    likeUsers(postId)
      .then((response) => {
        console.log("response ui......", response.data);
        setuser(response.data);
      })
      .catch((error) => {
        console.error("error during fetching users:", error);
      });
  };
  useEffect(() => {
    getLikedUsers(postId);
  }, [postId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          maxHeight: "90vh", 
          bgcolor: bgColor,
          color: textColor,
          borderRadius: 1,
          p: 2,
          overflowY: "auto",
        }}
      >
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderBottom: "1px solid #eee",
                  gap: 2,
                  backgroundColor: bgColor,
                  color: textColor,
                }}
                // onClick={() => {
                //   handleClose();
                //   navigate(`/profile/${user.userName}`);
                // }}
              >
                <Avatar
                  src={user.profileImageUrl || "/static/images/avatar/1.jpg"}
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
              No user liked the post .
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
