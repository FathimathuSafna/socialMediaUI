import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography, Box } from "@mui/joy";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import Grid from "@mui/material/Grid2";
import { getFollowers, followUser } from "../../service/followApi";
import { useNavigate } from "react-router-dom";

export default function BottomActionsCard() {
  const [followers, setFollowers] = useState([]);
  const [follow, setFollow] = useState(false);
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

  useEffect(() => {
  getAllFollowers(); // initial fetch

  const handleUserFollowChange = () => {
    getAllFollowers(); // re-fetch when someone follows/unfollows
  };

  // Listen for the custom event
  window.addEventListener("userFollowChanged", handleUserFollowChange);

  // Cleanup the listener on unmount
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

  return (
    <>
      {followers.map((user, index) => (
        <Card
          key={user._id}
          variant="outlined"
          sx={{
            width: 300,
            border: 0,
            backgroundColor: bgColor,
            color: textColor,
            marginBottom: 2,
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item sx={{ width: 150 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                <Avatar
                  src={user.profileImageUrl || "/static/images/avatar/1.jpg"}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Typography level="title">{user.userName}</Typography>
              </Box>
            </Grid>
            <Grid item sx={{ width: 50 }}>
              <Button
              sx={{ backgroundColor: '#8e8e8e', '&:hover': { backgroundColor: '#7a7a7a' } }}
                variant="solid"
                onClick={() => handleFollow(user._id)}
              >
                Follow
              </Button>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
}
