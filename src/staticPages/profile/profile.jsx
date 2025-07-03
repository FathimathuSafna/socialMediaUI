import { useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getUserDetails } from "../../service/userApi";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Grid2, Divider } from "@mui/material";
import FOLLOWERMODAL from "../../modal/followersModal"; 
import FOLLOWEDMODAL from "../../modal/followedModal";

function Profile() {
  const { userName } = useParams();
  const [user, setuser] = useState(null);
  const [posts, setpost] = useState(null);
  const [postCount, setpostCount] = useState(0);
  const [followedUserCount, setFollowedUserCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [followedOpen, setfollowedOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false); 
  const followHandleOpen = () => setfollowedOpen(true);
  const followHandleClose = () => setfollowedOpen(false);

  useEffect(() => {
    if (!userName) return;

    getUserDetails(userName)
      .then((response) => {
        console.log("fetch poast", response.data.followersCount);
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
              {user.profileImageUrl ? (
                <Avatar
                  src={user.profileImageUrl}
                  sx={{ width: "90%", height: "90%" }}
                />
              ) : (
                <Avatar
                  src="/broken-image.jpg"
                  sx={{ width: "90%", height: "90%" }}
                />
              )}
            </Grid2>
            <Grid2 direction="column" pl={2}>
              <h1>{user.userName}</h1>
              <Grid2 container direction="row" spacing={2}>
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
                <Grid2 item onClick={followHandleOpen} style={{ cursor: "pointer" }}>
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
            <Grid2 container spacing={2} pt={3}>
              {posts.map((post, idx) => (
                <Grid2 item xs={12} sm={6} md={4} key={idx}>
                  <div
                    style={{
                      backgroundImage: `url(${post.postImageUrl})`,
                      height: 270,
                      aspectRatio: "1 / 1",
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
          <FOLLOWERMODAL
        open={open}
        handleClose={handleClose}
      
      />
      <FOLLOWEDMODAL
        open={followedOpen}
        handleClose={followHandleClose}
        />
        </>
      )}
    </Grid2>
  );
}


export default Profile;
