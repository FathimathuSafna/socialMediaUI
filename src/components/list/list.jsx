import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography, Box } from "@mui/joy";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import Grid from "@mui/material/Grid2";
import { getFollowers, followUser } from "../../service/followApi";
import { getUserDetails } from "../../service/userAPI";
import EditProfileModal from "../../modal/editProfile";
import { useNavigate, useParams } from "react-router-dom";

export default function BottomActionsCard() {
  const userName = localStorage.getItem("userName");
  const [followers, setFollowers] = useState([]);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [user, setUser] = useState("");
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const navigate = useNavigate();
  const getAllFollowers = () => {
    getFollowers()
      .then((response) => {
        setFollowers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });
  };

  const getUser = (userName) => {
    getUserDetails(userName)
      .then((response) => {
        setUser(response.data.getUser);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });
  };

  useEffect(() => {
      getUser(userName);
    getAllFollowers();
    const handleUserFollowChange = () => {
      getAllFollowers();
    };

    window.addEventListener("userFollowChanged", handleUserFollowChange);

    return () => {
      window.removeEventListener("userFollowChanged", handleUserFollowChange);
    };
  }, []);

  const handleFollow = (userId) => {
    followUser({ followedUserId: userId })
      .then((response) => {
        getAllFollowers();
      })
      .catch((error) => {
        console.error("Error following user:", error);
      });
  };

  const handleOpenEditProfile = () => setOpenEditProfileModal(true);
  const handleCloseEditProfile = () => setOpenEditProfileModal(false);

  return (
    <>
      {user && (
        <Box
          className="glass-panel"
          sx={{
            width: "100%",
            maxWidth: "320px",
            backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "#ffffff",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            borderRadius: "24px",
            boxShadow: darkMode
              ? "0 15px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
              : "0 10px 20px rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              borderColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)",
              transform: "translateY(-2px)",
              boxShadow: darkMode
                ? "0 25px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)"
                : "0 15px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1.5,
            }}
            onClick={() => navigate(`/profile/${user.userName}`)}
          >
            <Avatar
              src={user.profilePictureUrl || "/static/images/avatar/1.jpg"}
              sx={{ width: 44, height: 44 }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: darkMode ? "#f8fafc" : "#0f172a",
                }}
              >
                {user.userName}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={handleOpenEditProfile}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              borderRadius: "10px",
              borderColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)",
              color: darkMode ? "#f8fafc" : "#0f172a",
              px: 2,
              py: 0.6,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "#6366f1",
                color: "#6366f1",
                backgroundColor: darkMode ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.03)",
                transform: "translateY(-1px)",
              }
            }}
          >
            Edit Profile
          </Button>
        </Box>
      )}

      <Typography
        sx={{
          fontSize: "0.825rem",
          fontWeight: 700,
          color: darkMode ? "#94a3b8" : "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          px: 1,
          mb: 2,
        }}
      >
        Suggested for you
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {followers.map((follower) => (
          <Box
            key={follower._id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: 1.5,
              }}
              onClick={() => navigate(`/profile/${follower.userName}`)}
            >
              <Avatar
                src={follower.profilePictureUrl || "/static/images/avatar/1.jpg"}
                sx={{ width: 38, height: 38 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: darkMode ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {follower.userName}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleFollow(follower._id)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 700,
                borderRadius: "10px",
                borderColor: darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)",
                color: "#6366f1",
                px: 2,
                py: 0.6,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  borderColor: "#6366f1",
                  backgroundColor: darkMode ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.08)",
                  transform: "translateY(-1px)",
                }
              }}
            >
              Follow
            </Button>
          </Box>
        ))}
      </Box>

      <EditProfileModal
        open={openEditProfileModal}
        handleClose={handleCloseEditProfile}
        user={user}
      />
    </>
  );
}
