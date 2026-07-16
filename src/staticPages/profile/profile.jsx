import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getUserDetails } from "../../service/user_api";
import Avatar from "@mui/material/Avatar";
import { Grid2, Box, Typography, Divider } from "@mui/material";
import { Button } from "@mui/joy";
import { followUser, unFollowUser } from "../../service/followApi";
import { deletePost } from "../../service/postAPI";

import FOLLOWERMODAL from "../../modal/followersModal";
import FOLLOWEDMODAL from "../../modal/followedModal";
import EditProfileModal from "../../modal/editProfile";
import PostDetailModal from "../../modal/postDetailModal";
import SmallButton from "../../ButtonsAnimation/SmallButton";
import MESSAGEDIALOG from "../../modal/messageDialog";

function Profile() {
  const { userName } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [followedUserCount, setFollowedUserCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [isfollow, setisfollow] = useState(false);
  const [follower, setfollower] = useState([]);
  const [following, setfollowing] = useState([]);

  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [messageOpen, setmessageOpen] = useState(false);
  const handleOpenFollowers = () => setOpenFollowersModal(true);
  const handleCloseFollowers = () => setOpenFollowersModal(false);
  const handleOpenFollowing = () => setOpenFollowingModal(true);
  const handleCloseFollowing = () => setOpenFollowingModal(false);
  const handleOpenEditProfile = () => setOpenEditProfileModal(true);
  const handleCloseEditProfile = () => setOpenEditProfileModal(false);
  const messageHandleOpen = () => setmessageOpen(true);
  const messageHandleClose = () => setmessageOpen(false);

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setOpenPostModal(true);
  };
  const handleClosePostModal = () => {
    setOpenPostModal(false);
    setSelectedPost(null);
  };

  const { darkMode } = useCustomTheme();

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((currentPosts) => currentPosts.filter((p) => p._id !== postId));
      setPostCount((prevCount) => prevCount - 1);
      handleClosePostModal();
    } catch (error) {
      console.error("Failed to delete post:", error);
      throw error;
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser({ followedUserId: userId });
      setisfollow(true);
      setFollowerCount((prev) => prev + 1);
      window.dispatchEvent(new Event("userFollowChanged"));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnFollow = async (userId) => {
    try {
      await unFollowUser({ followedUserId: userId });
      setisfollow(false);
      setFollowerCount((prev) => prev - 1);
      window.dispatchEvent(new Event("userFollowChanged"));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    if (!userName) return;

    getUserDetails(userName)
      .then((response) => {
        setUser(response.data.getUser);
        setPosts(response.data.posts);
        setPostCount(response.data.postCount);
        setFollowedUserCount(response.data.followedCount);
        setFollowerCount(response.data.followersCount);
        setCurrentUser(response.data.currentUser === true);
        setisfollow(response.data.isFollowing === true);
        setfollower(response.data.followerUsers);
        setfollowing(response.data.followedUsers);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [userName]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "935px",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 },
      }}
    >
      {user ? (
        <>
          {/* Profile Header Banner */}
          <Box
            className="glass-panel"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: 3, sm: 6, md: 8 },
              p: { xs: 4, sm: 5 },
              borderRadius: "28px",
              backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "#ffffff",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
              mb: 5,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)",
                boxShadow: darkMode
                  ? "0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)"
                  : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
              }
            }}
          >
            <Box
              sx={{
                p: "3.5px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: darkMode ? "0 0 25px rgba(99, 102, 241, 0.25)" : "0 0 25px rgba(99, 102, 241, 0.12)",
                transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": {
                  transform: "rotate(15deg) scale(1.05)",
                }
              }}
            >
              <Avatar
                src={user.profilePictureUrl || "/broken-image.jpg"}
                alt={`${user.userName}'s profile`}
                sx={{
                  width: { xs: 104, sm: 122, md: 132 },
                  height: { xs: 104, sm: 122, md: 132 },
                  border: `3px solid ${darkMode ? "#080b11" : "#ffffff"}`,
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.35rem", sm: "1.6rem" },
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {user.name || "Unknown"}
                </Typography>
                
                <Button
                  onClick={() => {
                    if (currentUser) {
                      handleOpenEditProfile();
                    } else if (isfollow) {
                      handleUnFollow(user._id);
                    } else {
                      handleFollow(user._id);
                    }
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    borderRadius: "12px",
                    px: 3,
                    py: 1,
                    backgroundColor: currentUser
                      ? (darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.05)")
                      : (isfollow ? (darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)") : "transparent"),
                    color: currentUser
                      ? (darkMode ? "#ffffff" : "#0f172a")
                      : (isfollow ? "#ef4444" : "#ffffff"),
                    border: currentUser
                      ? `1px solid ${darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)"}`
                      : (isfollow ? "1px solid rgba(239, 68, 68, 0.3)" : "none"),
                    background: !currentUser && !isfollow ? "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)" : undefined,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: !currentUser && !isfollow
                      ? (darkMode ? "0 4px 14px 0 rgba(99, 102, 241, 0.25)" : "0 4px 14px 0 rgba(99, 102, 241, 0.15)")
                      : "none",
                    "&:hover": {
                      backgroundColor: currentUser
                        ? (darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.08)")
                        : (isfollow ? (darkMode ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.12)") : undefined),
                      background: !currentUser && !isfollow ? "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)" : undefined,
                      transform: "translateY(-1px)",
                    }
                  }}
                >
                  {currentUser
                    ? "Edit Profile"
                    : isfollow
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 3, sm: 4 },
                  mb: 2.5,
                }}
              >
                <Typography sx={{ fontSize: "0.95rem", color: darkMode ? "#94a3b8" : "#64748b" }}>
                  <b style={{ color: darkMode ? "#f8fafc" : "#0f172a", fontWeight: 700 }}>{postCount}</b> {postCount === 1 ? "post" : "posts"}
                </Typography>
                <Typography
                  onClick={handleOpenFollowers}
                  sx={{
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: darkMode ? "#94a3b8" : "#64748b",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  <b style={{ color: darkMode ? "#f8fafc" : "#0f172a", fontWeight: 700 }}>{followerCount}</b>{" "}
                  {followerCount === 1 ? "follower" : "followers"}
                </Typography>
                <Typography
                  onClick={handleOpenFollowing}
                  sx={{
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: darkMode ? "#94a3b8" : "#64748b",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  <b style={{ color: darkMode ? "#f8fafc" : "#0f172a", fontWeight: 700 }}>{followedUserCount}</b> following
                </Typography>
              </Box>

              {/* Bio */}
              {user.bio && (
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    color: darkMode ? "#cbd5e1" : "#334155",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {user.bio}
                </Typography>
              )}

              {/* Message Button */}
              {!currentUser && (
                <Box sx={{ mt: 2.5, width: "100%" }}>
                  <Button
                    onClick={messageHandleOpen}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      borderRadius: "12px",
                      px: 4,
                      py: 1,
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.05)",
                      color: darkMode ? "#ffffff" : "#0f172a",
                      border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)"}`,
                      width: { xs: "100%", sm: "200px" },
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.08)",
                        transform: "translateY(-1px)",
                      }
                    }}
                  >
                    Message
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Divider
            sx={{
              mb: 4,
              borderColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            }}
          />

          {/* Posts Gallery */}
          <Grid2
            container
            spacing={3}
            sx={{
              width: "100%",
              m: 0,
            }}
          >
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <Grid2
                  key={post._id}
                  size={{ xs: 6, sm: 4, md: 4 }}
                  sx={{
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "1/1",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-sm)",
                      border: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0, 0, 0, 0.05)"}`,
                      cursor: "pointer",
                      position: "relative",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "var(--shadow-md)",
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={post.postImageUrl}
                      alt="post"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        "&:hover": {
                          transform: "scale(1.05)",
                        }
                      }}
                      onClick={() => {
                        if (currentUser) {
                          handleOpenPostModal(post);
                        }
                      }}
                    />
                  </Box>
                </Grid2>
              ))
            ) : (
              <Grid2
                size={12}
                sx={{ textAlign: "center", py: 8 }}
              >
                <Typography variant="h6" sx={{ color: darkMode ? "#475569" : "#94a3b8", fontWeight: 600 }}>
                  No posts to show.
                </Typography>
              </Grid2>
            )}
          </Grid2>

          {/* Modals */}
          <FOLLOWERMODAL
            open={openFollowersModal}
            followerUsers={follower}
            handleClose={handleCloseFollowers}
          />
          <FOLLOWEDMODAL
            open={openFollowingModal}
            followedUsers={following}
            handleClose={handleCloseFollowing}
          />
          <EditProfileModal
            open={openEditProfileModal}
            handleClose={handleCloseEditProfile}
            user={user}
          />
          <PostDetailModal
            open={openPostModal}
            handleClose={handleClosePostModal}
            post={selectedPost}
            onDelete={handleDeletePost}
          />
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" sx={{ color: darkMode ? "#475569" : "#94a3b8", fontWeight: 600 }}>
            Loading profile...
          </Typography>
        </Box>
      )}
      <MESSAGEDIALOG open={messageOpen} handleClose={messageHandleClose} />
    </Box>
  );
}

export default Profile;
