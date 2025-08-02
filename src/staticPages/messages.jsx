import React, { useEffect, useState, useRef } from "react";
import {
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
import { socket } from "../socket";
import { createMessage, getMessage } from "../service/messageAPI";

export default function Messages({ userName, onBack }) {
  const currentUserName = localStorage.getItem("userName");

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const { darkMode } = useCustomTheme();

  const [userMsgData, setUserMsgData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  const bgColor = darkMode ? "#3a3a3a" : "#f5f5f5";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const background = darkMode ? "#121212" : "#ffffff";

  useEffect(() => {
    const loadConversation = async () => {
      if (!userName) return;
      try {
        const res = await getMessage(userName);
        setUserMsgData({
          _id: res.recipient._id,
          userName: res.recipient.userName,
          name: res.recipient.name,
          profileImageUrl: res.recipient.profileImageUrl,
          conversationId: res.conversationId,
          messages: res.messages || [],
          sender: res.sender,
          recipient: res.recipient,
        });
        socket.emit("join", res.conversationId);
      } catch (err) {
        console.error("Error loading conversation:", err);
      }
    };
    loadConversation();
  }, [userName]);

  useEffect(() => {
    if (userMsgData?.conversationId) {
      socket.emit("join", userMsgData.conversationId);
    }
  }, [userMsgData?.conversationId]);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === userMsgData?.conversationId) {
        setUserMsgData((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), msg],
        }));
      }
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [userMsgData?.conversationId]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMsgData?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messagePayload = {
      receiverId: userMsgData._id,
      message: newMessage.trim(),
    };

    socket.emit("send_message", messagePayload);
    setNewMessage("");

    // try {
    //   await createMessage(messagePayload);
    // } catch (err) {
    //   console.error("Failed to save message:", err);
    // }
  };

  if (!userName) {
    return <Box p={4} textAlign="center" color="#888">Select a user to start messaging.</Box>;
  }

  if (!userMsgData) {
    return <Box p={4} textAlign="center" color="#888">Loading messages...</Box>;
  }

  const messages = userMsgData.messages || [];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {isXs && onBack && (
        <Button onClick={onBack} sx={{ alignSelf: "flex-start", mb: 1, color: textColor }} size="small">
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
        }}
      >
        {messages.map((msg, index) => {
          const isCurrentUserSender =
            msg.senderId === userMsgData.sender._id &&
            userMsgData.sender.userName === currentUserName;

          return (
            <Box
              key={msg._id || index}
              sx={{
                display: "flex",
                justifyContent: isCurrentUserSender ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: isCurrentUserSender ? "primary.main" : "grey.300",
                  color: isCurrentUserSender ? "#fff" : "#000",
                  borderRadius: isCurrentUserSender ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  maxWidth: "75%",
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.6 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSendMessage}
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          fullWidth
          size="small"
          InputProps={{
            sx: {
              color: textColor,
              backgroundColor: background,
              borderRadius: 2,
              "& fieldset": { borderColor: "#888" },
              "&:hover fieldset": { borderColor: textColor },
              "&.Mui-focused fieldset": { borderColor: textColor },
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
