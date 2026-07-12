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
        className="glass-panel"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          maxHeight: "60vh",
          bgcolor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)",
          color: textColor,
          borderRadius: "28px",
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          boxShadow: darkMode
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
          p: 3,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          }
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
            textAlign: "center",
          }}
        >
          Likes
        </Typography>
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "16px",
                  mb: 1,
                  gap: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"}`,
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.03)",
                    transform: "translateX(4px)",
                    borderColor: "transparent",
                  }
                }}
                onClick={() => {
                  handleClose();
                  navigate(`/profile/${user.userName}`);
                }}
              >
                <Avatar
                  src={user.profilePictureUrl || "/static/images/avatar/1.jpg"}
                  sx={{
                    width: 40,
                    height: 40,
                    border: `1.5px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: textColor }}>
                    {user.userName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                    {user.name || ""}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
              No likes yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
