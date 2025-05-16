import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography } from '@mui/joy';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';
import Grid from '@mui/material/Grid2';
import { getFollowers } from '../../service/followApi';

export default function BottomActionsCard() {
  const [followers, setFollowers] = useState([]);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    getFollowers(token)
      .then((response) => setFollowers(response.data))
      .catch((error) => console.error(error));
  }
  }, []);

  return (
    <>
      {followers.map((user, index) => (
        <Card
          key={index}
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
            <Grid item>
              <Avatar src={user.profileImageUrl || "/static/images/avatar/1.jpg"} />
            </Grid>
            <Grid item xs>
              <Typography level="title">{user.name}</Typography>
              <Typography level="body2">{user.email}</Typography>
            </Grid>
            <Grid item>
              <Button variant="solid" color="primary">
                Follow
              </Button>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
}
