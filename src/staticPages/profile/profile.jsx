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
    <Grid2 container direction="column" spacing={10}>
      {user && (
        <>
          <Grid2
            container
            pt={5}
            spacing={5}
            direction="row"
            alignItems="center"
          >
            <Grid2 sx={{ width: "100px", height: "100px" }}>
              {user.profilePictureUrl ? (
                <Avatar
                  src={user.profilePictureUrl}
                  sx={{ width: "90%", height: "90%" }}
                />
              ) : (
                <Avatar
                  src="/broken-image.jpg"
                  sx={{ width: "90%", height: "90%" }}
                />
              )}
            </Grid2>
            <Grid2 direction="column" pl={2} >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 ,pb: 1}}>
                <h1 style={{ margin: 0 }}>{user.userName}</h1>
                <Button size="sm" sx={{ backgroundColor: '#8e8e8e', '&:hover': { backgroundColor: '#7a7a7a' } }} onClick={editHandleOpen}>Edit Profile</Button>
              </Box>

              <Grid2 container direction="row" spacing={1}>
                <Grid2 item>
                  {postCount >= 0 && (
                    <h5>
                      {postCount} {postCount === 1 ? "post" : "posts"}
                    </h5>
                  )}
                </Grid2>
                <Grid2 item onClick={handleOpen} style={{ cursor: "pointer" }}>
                  {followerCount >= 0 && (
                    <h5>
                      {followerCount}{" "}
                      {followerCount === 1 ? "follower" : "followers"}
                    </h5>
                  )}
                </Grid2>
                <Grid2
                  item
                  onClick={followHandleOpen}
                  style={{ cursor: "pointer" }}
                >
                  {followedUserCount >= 0 && (
                    <h5>
                      {followedUserCount}{" "}
                      {followedUserCount === 1 ? "following" : "followings"}
                    </h5>
                  )}
                </Grid2>
              </Grid2>
              <h5>{user.bio}</h5>
            </Grid2>
          </Grid2>

          {Array.isArray(posts) && posts.length > 0 ? (
            <Grid2 container spacing={1} pt={2} pb={3}>
              {posts.map((post, idx) => (
                <Grid2 item key={idx}>
                  <div
                    style={{
                      backgroundImage: `url(${post.postImageUrl})`,
                      height: 190,
                      
                      aspectRatio: "1 / 2",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 8,
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
          <FOLLOWERMODAL open={open} handleClose={handleClose} />
          <FOLLOWEDMODAL open={followedOpen} handleClose={followHandleClose} />
          <EditProfileModal open={editProfile} handleClose={editHandleClose} user={user} />
        </>
      )}
    </Grid2>
  );
}

export default Profile;
