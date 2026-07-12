import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Avatar, Slide, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";

const GEMINI_API_KEY = "AIzaSyBd3DBak5KSUPuua-lC6Dm0mPdB-yN3v8c";

export default function ChatbotWidget() {
  const { darkMode } = useCustomTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi! I am **Atmosphere AI**, your cosmic helper. 🌌 How can I assist you on the Appmosphere platform today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      // Build conversation history formatted for Gemini API API
      const history = [
        {
          role: "user",
          parts: [{ text: "You are Atmosphere AI, a helpful, enthusiastic, and cosmic-themed assistant for the Appmosphere social network. Keep answers concise, clear, supportive, and formatted with basic markdown (use **bold** for emphasis). Guide users on how to share posts, follow friends, toggle dark/light theme, and direct message contacts." }]
        },
        ...messages.map((msg) => ({
          role: msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.text }]
        })),
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents: history }),
        }
      );

      const data = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, my cosmic links are down. Please try asking again.";

      setMessages((prev) => [...prev, { role: "model", text: generatedText }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Oops! I encountered an error connecting to the AI grid." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    if (!text) return "";
    return text.split("\n").map((para, i) => {
      let formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
      return (
        <Typography
          key={i}
          variant="body2"
          sx={{
            mb: 0.5,
            fontSize: "0.85rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  const textColor = darkMode ? "#f8fafc" : "#0f172a";
  const glassBg = darkMode ? "rgba(9, 13, 22, 0.85)" : "rgba(255, 255, 255, 0.95)";

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            color: "#ffffff",
            boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4), inset 0 1px 0 0 rgba(255,255,255,0.3)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              transform: "scale(1.08) translateY(-2px)",
              boxShadow: "0 12px 35px rgba(99, 102, 241, 0.5), inset 0 1px 0 0 rgba(255,255,255,0.3)",
            },
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 24 }} />
        </IconButton>
      )}

      {/* Expanded Chat Box */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          className="glass-panel"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: { xs: "90vw", sm: "360px" },
            height: "500px",
            bgcolor: glassBg,
            color: textColor,
            borderRadius: "24px",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"}`,
            boxShadow: darkMode
              ? "0 20px 50px rgba(0,0,0,0.5)"
              : "0 15px 35px rgba(15, 23, 42, 0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                  width: 38,
                  height: 38,
                  boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 20, color: "#ffffff" }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: textColor, lineHeight: 1.2 }}>
                  Atmosphere AI
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      animation: "pulse 1.5s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(0.85)", opacity: 0.5 },
                        "50%": { transform: "scale(1.15)", opacity: 1 },
                        "100%": { transform: "scale(0.85)", opacity: 0.5 },
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                    Online
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{
                color: darkMode ? "#94a3b8" : "#64748b",
                "&:hover": { backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Messages list */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <Box
                  key={index}
                  sx={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: isUser ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                      background: isUser
                        ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                        : darkMode
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.03)",
                      border: isUser
                        ? "none"
                        : `1px solid ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                      color: isUser ? "#ffffff" : textColor,
                      boxShadow: isUser ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none",
                    }}
                  >
                    {formatText(msg.text)}
                  </Box>
                </Box>
              );
            })}

            {isTyping && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  p: 1.5,
                  borderRadius: "18px 18px 18px 2px",
                  bgcolor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <CircularProgress size={12} sx={{ color: "#6366f1" }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Atmosphere AI is typing...
                </Typography>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Footer Input */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Ask Atmosphere AI..."
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                sx: {
                  borderRadius: "14px",
                  color: textColor,
                  backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)",
                  boxShadow: "none",
                },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
