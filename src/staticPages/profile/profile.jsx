import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getUserDetails } from "../../service/userAPI";
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
    <Grid2
      container
      direction="column"
      sx={{
        pl: { xs: 0, sm: 2, md: 3 },
        pt: { xs: 4, sm: 3 },
        pr: 0,
        width: "100%",
        height: {
          xs: "100vh",
          sm: "100%",
          md: "100%",
        },
      }}
    >
      {user ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row", // Side by side on all screens
              alignItems: "flex-start",
              gap: { xs: 2, sm: 2,md:7 },
              px: { xs: 2, sm: 4, md: 5 },
              py: { xs: 3, sm: 4 },
              width: "100%",
            }}
          >
            <Avatar
              src={user.profilePictureUrl || "/broken-image.jpg"}
              alt={`${user.userName}'s profile`}
              sx={{
                width: { xs: 70, sm: 110, md: 150 },
                height: { xs: 70, sm: 110, md: 150 },
                border: "1px solid #ccc",
              }}
            />

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "16px", sm: "18px", md: "20px" },
                    fontWeight: 500,
                  }}
                >
                  {user.name || "Unknown"}
                </Typography>
                <SmallButton
                  onClick={() => {
                    if (currentUser) {
                      handleOpenEditProfile();
                    } else if (isfollow) {
                      handleUnFollow(user._id);
                    } else {
                      handleFollow(user._id);
                    }
                  }}
                >
                  {currentUser
                    ? "Edit Profile"
                    : isfollow
                    ? "Unfollow"
                    : "Follow"}
                </SmallButton>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 1,
                }}
              >
                <Typography variant="body2">
                  <b>{postCount}</b> {postCount === 1 ? "post" : "posts"}
                </Typography>
                <Typography
                  variant="body2"
                  onClick={handleOpenFollowers}
                  sx={{ cursor: "pointer" }}
                >
                  <b>{followerCount}</b>{" "}
                  {followerCount === 1 ? "follower" : "followers"}
                </Typography>
                <Typography
                  variant="body2"
                  onClick={handleOpenFollowing}
                  sx={{ cursor: "pointer" }}
                >
                  <b>{followedUserCount}</b> following
                </Typography>
              </Box>

              {/* Bio */}
              {user.bio && (
                <Typography
                  variant="body3"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    mb: 1,
                  }}
                >
                  {user.bio}
                </Typography>
              )}

              {/* Message Button */}
              {!currentUser && (
                <Box sx={{ mt: 2 }}>
                 <Button
                    sx={{ backgroundColor: "#8e8e8e", width: "55%" }}
                    onClick={messageHandleOpen}
                  >
                    Message
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Divider
            sx={{
              mb: { xs: 2, sm: 3 },
              width: "100%",
              p: 0,
              mt: { xs: 4 },
              backgroundColor: "#8e8e8e",
            }}
          />

          <Grid2
            container
            spacing={{ xs: 0.5, sm: 1, md: 2 }}
            sx={{
              mx: { sm: -0.5, md: -1 }, // Counteract spacing on container for edge alignment
              width: {
                xs: "calc(100% + 4px)",
                sm: "calc(100% + 8px)",
                md: "calc(100% + 16px)",
              },
              mt: {
                xs: 1,
              },
              pt: 0,
              gap: 0.4,
              pl: { xs: 1, md: 0 },
            }}
          >
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post, idx) => (
                <Grid2
                  item
                  key={post._id}
                  xs={4}
                  sm={4}
                  md={4}
                  sx={{
                    p: { xs: 0.1, sm: 0.5, md: 0.5 }, // Padding around each image
                    m: 0,
                    pt: 3,
                    pb: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={post.postImageUrl}
                    alt="post"
                    sx={{
                      width: "100%",
                      height: { xs: "119px", sm: "160px", md: "260px" },
                      objectFit: "cover",
                      aspectRatio: "1 / 1",
                      borderRadius: 1,
                      cursor: "pointer",
                    }}
                    // <-- NEW: Open modal on click if it's the current user's profile
                    onClick={() => {
                      if (currentUser) {
                        handleOpenPostModal(post);
                      }
                    }}
                  />
                </Grid2>
              ))
            ) : (
              <Grid2
                item
                xs={12}
                sx={{ textAlign: "center", pt: 4, p: 0, m: 0 }}
              >
                <Typography variant="h6" color="#8e8e8e">
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
        <Grid2 item xs={12} sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="#8e8e8e">
            Loading profile...
          </Typography>
        </Grid2>
      )}
      <MESSAGEDIALOG open={messageOpen} handleClose={messageHandleClose} />
    </Grid2>
  );
}

export default Profile;
