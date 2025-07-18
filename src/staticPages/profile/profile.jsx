import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getUserDetails } from "../../service/userApi";
import Avatar from "@mui/material/Avatar";
import { Grid2, Box, Typography, Divider } from "@mui/material";
import { Button } from "@mui/joy";
import { followUser, unFollowUser } from "../../service/followApi";
import { deletePost } from "../../service/postAPI";

// Import your Modals
import FOLLOWERMODAL from "../../modal/followersModal";
import FOLLOWEDMODAL from "../../modal/followedModal";
import EditProfileModal from "../../modal/editProfile";
import PostDetailModal from "../../modal/postDetailModal";

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
  const handleOpenFollowers = () => setOpenFollowersModal(true);
  const handleCloseFollowers = () => setOpenFollowersModal(false);
  const handleOpenFollowing = () => setOpenFollowingModal(true);
  const handleCloseFollowing = () => setOpenFollowingModal(false);
  const handleOpenEditProfile = () => setOpenEditProfileModal(true);
  const handleCloseEditProfile = () => setOpenEditProfileModal(false);


 const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setOpenPostModal(true);
  };
  const handleClosePostModal = () => {
    setOpenPostModal(false);
    setSelectedPost(null);
  };

  const { darkMode } = useCustomTheme();

  // <-- NEW: Handler to perform the deletion
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      // Update state to remove post from UI without a refresh
      setPosts((currentPosts) => currentPosts.filter((p) => p._id !== postId));
      setPostCount((prevCount) => prevCount - 1);
      handleClosePostModal(); // Close the modal on success
    } catch (error) {
      console.error("Failed to delete post:", error);
      // Re-throw error so the modal can handle its state (e.g., stop loading spinner)
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
        console.log("User data fetched:", response.data.followerUsers);
        setfollower(response.data.followerUsers);
        setfollowing(response.data.followedUsers);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [userName]);

  return (
    // Main Container for the Profile Page
    <Grid2
      container
      direction="column"
      sx={{
        flexGrow: 1,
        px: { xs: 0, sm: 2, md: 4 },
        pt: { xs: 4, sm: 0 },
        m: 0,
        pb: 4,
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
          {/* --- PROFILE HEADER SECTION --- */}
          <Grid2
            container
            flexDirection={{ xs: "row", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            justifyContent={{ xs: "flex-start", sm: "flex-start" }}
            display={{ xs: "flex", sm: "flex" }}
            sx={{
              width: "100%",
              py: { xs: 2, sm: 4 },
              gap: { xs: 1, sm: 0 },
              mb: { xs: 2, sm: 4 },
              pr: { xs: 1, sm: 0 },
              pl: { xs: 1, sm: 0 },
            }}
          >
            {/* Avatar Section */}
            <Grid2
              item
              xs={3}
              sm={3}
              md={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 0,
                m: 0,
              }}
            >
              <Avatar
                src={user.profilePictureUrl || "/broken-image.jpg"}
                alt={`${user.userName}'s profile`}
                sx={{
                  width: { xs: 80, sm: 120, md: 150 },
                  height: { xs: 80, sm: 120, md: 150 },
                  border: "1px solid #ccc",
                }}
              />
            </Grid2>

            <Grid2
              item
              xs={9}
              sm={9}
              md={10}
              sx={{
                pl: { xs: 1, sm: 4, md: 8 },
                p: 0,
                m: 0,
              }}
            >
              {/* Username & Buttons Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "flex-start", sm: "flex-start" },
                  gap: { xs: 1, sm: 3 },
                  flexWrap: "wrap",
                  mb: { xs: 1.5, sm: 2 },
                  p: 0,
                  m: 0,
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ m: 0, fontWeight: "bold" }}
                >
                  {user.userName}
                </Typography>

                <Button
                  size="sm"
                  sx={{
                    backgroundColor: "#8e8e8e",
                    "&:hover": { backgroundColor: "#8e8e8e" },
                    textTransform: "none",
                    px: 0.5,
                    py: 0.5,
                    ml: 1.5,
                  }}
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
                </Button>
              </Box>

              {/* Stats Row */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 4 },
                  flexWrap: "wrap",
                  justifyContent: { xs: "flex-start", sm: "flex-start" },
                  mb: { xs: 1.5, sm: 2 },
                  p: 0, // No padding
                  m: 0, // No margin
                }}
              >
                <Typography variant="body1">
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {postCount}
                  </Box>{" "}
                  {postCount === 1 ? "post" : "posts"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: "pointer" }}
                  onClick={handleOpenFollowers}
                >
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {followerCount}
                  </Box>{" "}
                  {followerCount === 1 ? "follower" : "followers"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: "pointer" }}
                  onClick={handleOpenFollowing}
                >
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {followedUserCount}
                  </Box>{" "}
                  {followedUserCount === 1 ? "following" : "followings"}
                </Typography>
              </Box>

              {/* Bio */}
              {user.bio && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: { xs: 2, sm: 0 },
                    p: 0,
                    m: 0,
                    textAlign: { xs: "left", sm: "left" }, // Explicitly center the bio text on xs
                  }}
                >
                  {user.bio}
                </Typography>
              )}
            </Grid2>
          </Grid2>

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
                    display: "flex-start",
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
                        height: { xs: "120px", sm: "180px", md: "200px" },
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
    </Grid2>
  );
}

export default Profile;
