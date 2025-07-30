import React, { useEffect, useState, useRef } from "react";
import { getUserMessage } from "../service/userApi";
import {
  Grid2,
  Box,
  Avatar,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme as useCustomTheme } from "../store/ThemeContext";

export default function Messages({ userName, onBack }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [userMsgData, setUserMsgData] = useState(null);
  const { darkMode } = useCustomTheme();
  const bottomRef = useRef(null);

  const bgColor = darkMode ? "#3a3a3a" : "#f5f5f5";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const background = darkMode ? "#121212" : "#ffffff";

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userMsgData]);

  useEffect(() => {
    if (userName) {
      getUserMessage(userName)
        .then((res) => {
          setUserMsgData(res.data.getUser);
        })
        .catch((err) => {
          console.error("Error fetching user message:", err);
        });
    }
  }, [userName]);

  if (!userName) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>
        Select a user to start messaging.
      </Box>
    );
  }

  if (!userMsgData) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>
        Loading messages...
      </Box>
    );
  }

  const messages = [
    { text: "Hey, how's it going?", isSender: false },
    {
      text: "Pretty good! I'm working on a React demo with Material-UI. How about you?",
      isSender: true,
    },
    {
      text: "Nice! I'm just checking it out. What does your component do?",
      isSender: false,
    },
    {
      text: "It's a simple message bubble for a chat interface. It changes alignment and color based on who the sender is. This makes the conversation easy to follow.",
      isSender: true,
    },
    {
      text: "Looks fantastic! It's very clear and stylish. ✨",
      isSender: false,
    },
    {
      text: "Nice! I'm just checking it out. What does your component do?",
      isSender: false,
    },
    {
      text: "It's a simple message bubble for a chat interface. It changes alignment and color based on who the sender is. This makes the conversation easy to follow.",
      isSender: true,
    },
    {
      text: "Looks fantastic! It's very clear and stylish. ✨",
      isSender: false,
    },
    {
      text: "Nice! I'm just checking it out. What does your component do?",
      isSender: false,
    },
    {
      text: "It's a simple message bubble for a chat interface. It changes alignment and color based on who the sender is. This makes the conversation easy to follow.",
      isSender: true,
    },
    {
      text: "Looks fantastic! It's very clear and stylish. ✨",
      isSender: false,
    },
    {
      text: "Nice! I'm just checking it out. What does your component do?",
      isSender: false,
    },
    {
      text: "It's a simple message bubble for a chat interface. It changes alignment and color based on who the sender is. This makes the conversation easy to follow.",
      isSender: true,
    },
    {
      text: "Looks fantastic! It's very clear and stylish. ✨",
      isSender: false,
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {isXs && onBack && (
        <Button
          onClick={onBack}
          sx={{
            alignSelf: "flex-start",
            mb: 1,
            textTransform: "none",
            color: textColor,
          }}
          size="small"
        >
          ← Back to users
        </Button>
      )}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={userMsgData.profileImageUrl} />
        <Box>
          <strong>{userMsgData.userName}</strong>
          <div style={{ fontSize: 12, color: "#888" }}>{userMsgData.name}</div>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: 2,
          scrollbarWidth: "none",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.isSender ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                bgcolor: msg.isSender ? "primary.main" : "grey.300",
                color: msg.isSender ? "#fff" : "#000",
                borderRadius: msg.isSender
                  ? "12px 12px 0 12px"
                  : "12px 12px 12px 0",
                maxWidth: "75%",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          borderTop: "1px solid #ccc",
          backgroundColor: background,
          color: textColor,
        }}
      >
        <TextField
          placeholder="Type your message..."
          fullWidth
          size="small"
          InputProps={{
            sx: {
              color: textColor,
              backgroundColor: background,
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#888",
              },
              "&:hover fieldset": {
                borderColor: textColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: textColor,
              },
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          type="submit"
          sx={{ backgroundColor: bgColor }}
        >
          <SendIcon fontSize="small" sx={{ color: textColor }} />
        </Button>
      </Box>
    </Box>
  );
}
