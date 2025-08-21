import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography, Box } from "@mui/joy";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import Grid from "@mui/material/Grid2";
import { getFollowers, followUser } from "../../service/followApi";
import { getUserDetails } from "../../service/userAPI";
import { useNavigate, useParams } from "react-router-dom";

export default function BottomActionsCard({userName}) {
  console.log("userName:",userName)
  const [followers, setFollowers] = useState([]);
  const [user, setUser] = useState('');
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

  const getUser =(userName)=>{
    getUserDetails(userName)
    .then((response) =>{
      console.log("gggggggggggggggggggg",response.data); 
      setUser(response.data)
    }).catch((error) =>{
        console.error("Error fetching followers:", error);
    })
  }

  useEffect(() => {
    if (userName) {
    getUser(userName);
  }
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

  return (
    <>
      <Typography
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: textColor,
          marginLeft: "1.3rem",
          textAlign: "left",
          paddingBottom: "0.5rem",
        }}
      >
        Suggested for you
      </Typography>

      {followers.map((user, index) => (
        <Card
          key={user._id}
          variant="outlined"
          sx={{
            width: 300,
            border: 0,
            backgroundColor: bgColor,
            color: textColor,
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
                  sx={{ width: 40, height: 40, mr: 3.8 }}
                />
                <Typography sx={{ fontSize: 14, color: textColor }}>
                  {user.userName}
                </Typography>
              </Box>
            </Grid>
            <Button
              variant="outlined"
              sx={{
                width: "auto",
                border: "#8e8e8e",
                fontSize: 12,
              }}
              onClick={() => handleFollow(user._id)}
            >
              Follow
            </Button>
          </Grid>
        </Card>
      ))}
    </>
  );
}
