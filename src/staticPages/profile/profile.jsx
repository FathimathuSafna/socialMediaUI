import { useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getUserDetails } from "../../service/userApi";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Grid2, Box } from "@mui/material";
import FOLLOWERMODAL from "../../modal/followersModal";
import FOLLOWEDMODAL from "../../modal/followedModal";
import { Button } from "@mui/joy";
import EditProfileModal from "../../modal/editProfile";

function Profile() {
  const { userName } = useParams();
  const [user, setuser] = useState(null);
  const [posts, setpost] = useState(null);
  const [postCount, setpostCount] = useState(0);
  const [followedUserCount, setFollowedUserCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [followedOpen, setfollowedOpen] = useState(false);
  const [editProfile, seteditProfile] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const followHandleOpen = () => setfollowedOpen(true);
  const followHandleClose = () => setfollowedOpen(false);
  const editHandleOpen = () => seteditProfile(true);
  const editHandleClose = () => seteditProfile(false);

  useEffect(() => {
    if (!userName) return;

    getUserDetails(userName)
      .then((response) => {
        setuser(response.data.getUser);
        setpost(response.data.posts);
        setpostCount(response.data.postCount);
        setFollowedUserCount(response.data.followedCount);
        setFollowerCount(response.data.followersCount);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [userName]);

  return (
    <Grid2 container direction="column"  spacing={{ xs: 1, sm: 6, md: 6 }}>
      {user && (
        <>
          <Grid2
            container
            spacing={0}
            alignItems="center"
            justifyContent="flex-start"
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              pt:{
                xs: 2,
                sm: 2,
                md: 4,
              },
            }}
          >
            <Grid2
              item
              xs={3}
              sm={3}
              md={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: {
                  xs: 2,
                  sm: 0,
                },
              }}
            >
              <Avatar
                src={user.profilePictureUrl || "/broken-image.jpg"}
                sx={{
                  width: {
                    xs: 90,
                    sm: 100,
                    md: 120,
                  },
                  height: {
                    xs: 90,
                    sm: 100,
                    md: 120,
                  },
                }}
              />
            </Grid2>

            <Grid2
              item
              xs={8}
              sm={9}
              md={10}
              sx={{
                pl: {
                  xs: 4,
                  sm: 10,
                  md: 10,
                },
              }}
            >
              {/* Username + Button */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                  justifyContent: {
                    xs: "flex-start",
                    sm: "flex-start",
                  },
                  mb: 2,
                }}
              >
                <h2 style={{ margin: 0 }}>{user.userName}</h2>
                <Button
                  size="sm"
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    "&:hover": { backgroundColor: "#7a7a7a" },
                    textTransform: "none",
                  }}
                  onClick={editHandleOpen}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Stats Row */}
              <Box
                sx={{
                  display: "flex",
                  gap: {
                    xs: 2,
                    sm: 6,
                    md: 6,
                  },
                  flexWrap: "wrap",
                  textAlign: "left",
                  mb: 2,
                }}
              >
                <Box>
                  <strong>{postCount}</strong>{" "}
                  {postCount === 1 ? "post" : "posts"}
                </Box>
                <Box sx={{ cursor: "pointer" }} onClick={handleOpen}>
                  <strong>{followerCount}</strong>{" "}
                  {followerCount === 1 ? "follower" : "followers"}
                </Box>
                <Box sx={{ cursor: "pointer" }} onClick={followHandleOpen}>
                  <strong>{followedUserCount}</strong>{" "}
                  {followedUserCount === 1 ? "following" : "followings"}
                </Box>
              </Box>

              {/* Bio */}
              {user.bio && <Box>{user.bio}</Box>}
            </Grid2>
          </Grid2>

          {/* Posts Grid */}
          {Array.isArray(posts) && posts.length > 0 ? (
            <Grid2
              container
              // Adjust spacing specifically for 'xs'
              spacing={{ xs: 0.5, sm: 2, md: 2 }} // Reduced spacing for xs
              pt={10}
              pb={3}
              sx={{
                justifyContent: "center",
              }}
            >
              {posts.map((post, idx) => (
                <Grid2
                  item
                  key={idx}
                  xs={4} // This should still lead to 3 items per row (12/4 = 3)
                  sm={4}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // Optional: Add a small padding to the Grid2 item itself if spacing isn't enough
                    // padding: { xs: '2px', sm: '0px' },
                  }}
                >
                  <Box
                    component="img"
                    src={post.postImageUrl}
                    alt="post"
                    sx={{
                      width: "100%", // Always fill the parent's width
                      height: {
                        xs: "120px", // Even smaller height for xs to make them fit better
                        sm: "180px",
                        md: "220px",
                      },
                      borderRadius: 2,
                      objectFit: "cover",
                      aspectRatio: "1 / 1", // Optional: Maintain a square aspect ratio
                      // Optional: Set a min-width to ensure visibility on very small screens,
                      // but typically, 100% width and grid items handle this
                       minWidth: { xs: '60px' }
                    }}
                  />
                </Grid2>
              ))}
            </Grid2>
          ) : (
            <Grid2 pt={3}>
              <h3>No posts to show.</h3>
            </Grid2>
          )}

          {/* Modals */}
          <FOLLOWERMODAL open={open} handleClose={handleClose} />
          <FOLLOWEDMODAL open={followedOpen} handleClose={followHandleClose} />
          <EditProfileModal
            open={editProfile}
            handleClose={editHandleClose}
            user={user}
          />
        </>
      )}
    </Grid2>
  );
}

export default Profile;