import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography } from '@mui/joy';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';
import Grid from '@mui/material/Grid2';
import { getFollowers,followUser } from '../../service/followApi';

export default function BottomActionsCard() {
  const [followers, setFollowers] = useState([]);
  const [follow, setFollow] = useState(false);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
    const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
    getFollowers(token)
      .then((response) => setFollowers(response.data)
    )
      .catch((error) => console.error(error));
  }
  }, [token]);

const handleFollow = (userId) => {
    followUser({ token, followedUserId: userId })
      .then((response) => {
        console.log("Followed:", response);
        setFollow((prev) => new Set(prev).add(userId));
        window.location.reload();
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
            <Grid item sx={{ width: 50 }}>
              <Avatar src={user.profileImageUrl || "/static/images/avatar/1.jpg"} />
            </Grid>
            <Grid item sx={{ width: 100 }}>
              <Typography level="title">{user.name}</Typography>
            </Grid>
            <Grid item sx={{ width: 50 }}>
              <Button variant="solid" color="primary"  onClick={() => handleFollow(user._id)}>
                Follow
              </Button>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
}
