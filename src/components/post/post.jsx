import { useState, useEffect } from "react";
import { Box, Avatar, IconButton, Typography } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
  BookmarkBorder,
  MoreVert,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import { getPosts } from "../../service/postAPI";
import { likePost } from "../../service/likeAPI";
import COMMANTMODAL from "../../modal/commentModal";
import { useNavigate } from "react-router-dom";

const InstagramPost = () => {
  const { darkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const getAllPosts = () => {
    getPosts()
      .then((response) => {
        const fetchedPosts = response.data;
        setPosts(fetchedPosts);
      })
      .catch((error) => console.error("Failed to fetch posts:", error));
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleLike = (postId) => {
    likePost({ postId })
      .then(() => {
        getAllPosts(); // Refresh posts to update like state
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <>
      {posts.map((post) => (
        <Box
          key={post._id}
          className="glass-panel"
          sx={{
            maxWidth: "520px",
            margin: "32px auto",
            backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "#ffffff",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            borderRadius: "24px",
            boxShadow: darkMode
              ? "0 20px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
              : "0 15px 30px -10px rgba(15, 23, 42, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
            overflow: "hidden",
            p: 2.5,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              transform: "translateY(-3px)",
              borderColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)",
              boxShadow: darkMode
                ? "0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)"
                : "0 25px 45px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
            }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/profile/${post.userId.userName}`)}
            >
              <Box
                sx={{
                  p: "2px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px rgba(99, 102, 241, 0.25)",
                  marginRight: "12px",
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    transform: "rotate(15deg) scale(1.05)",
                  }
                }}
              >
                <Avatar
                  src={post.userId?.profilePictureUrl || "/broken-image.jpg"}
                  sx={{
                    width: 38,
                    height: 38,
                    border: `2px solid ${darkMode ? "#080b11" : "#ffffff"}`,
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {post.userId?.userName || "Unknown"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              sx={{
                color: darkMode ? "#94a3b8" : "#64748b",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                }
              }}
            >
              <MoreVert sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Image */}
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "18px",
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${post.postImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "scale(1.04)",
                }
              }}
              onDoubleClick={() => handleLike(post._id)}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleLike(post._id)}
                sx={{
                  color: post.isLiked ? "#f43f5e" : (darkMode ? "#94a3b8" : "#64748b"),
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  p: 1,
                  borderRadius: "12px",
                  "&:hover": {
                    transform: "scale(1.15)",
                    backgroundColor: "rgba(244, 63, 94, 0.08)",
                  }
                }}
              >
                {post.isLiked ? (
                  <Favorite sx={{ fontSize: 22 }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 22 }} />
                )}
              </IconButton>
              <IconButton
                onClick={() =>
                  handleOpen(
                    post._id,
                    post.description,
                    post.userId.userName,
                    post.userId.profilePictureUrl
                  )
                }
                sx={{
                  color: darkMode ? "#94a3b8" : "#64748b",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  p: 1,
                  borderRadius: "12px",
                  "&:hover": {
                    transform: "scale(1.15) rotate(-8deg)",
                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                    color: "#6366f1",
                  }
                }}
              >
                <ChatBubbleOutline sx={{ fontSize: 22 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: darkMode ? "#94a3b8" : "#64748b",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  p: 1,
                  borderRadius: "12px",
                  "&:hover": {
                    transform: "scale(1.15) rotate(12deg)",
                    backgroundColor: "rgba(6, 182, 212, 0.08)",
                    color: "#06b6d4",
                  }
                }}
              >
                <Send sx={{ fontSize: 22 }} />
              </IconButton>
            </Box>
            <IconButton
              sx={{
                color: darkMode ? "#94a3b8" : "#64748b",
                transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                p: 1,
                borderRadius: "12px",
                "&:hover": {
                  transform: "scale(1.15)",
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  color: "#f59e0b",
                }
              }}
            >
              <BookmarkBorder sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>

          {/* Likes */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.85rem",
              color: darkMode ? "#f8fafc" : "#0f172a",
              px: 1,
              mt: 1,
            }}
          >
            {post.likeCount} likes
          </Typography>

          {/* Caption */}
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: "1.6",
              color: darkMode ? "#cbd5e1" : "#334155",
              px: 1,
              mt: 0.5,
            }}
          >
            <span style={{ fontWeight: 700, color: darkMode ? "#f8fafc" : "#0f172a", marginRight: "8px" }}>
              {post.userId?.userName || "Unknown"}
            </span>
            {post.description}
          </Typography>

          {/* Comments */}
          {post.commentCount > 0 && (
            <Typography
              onClick={() => handleOpen(post._id)}
              sx={{
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "14px",
                px: 1,
                mt: 0.5,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                }
              }}
            >
              View all {post.commentCount} comments
            </Typography>
          )}

          {/* Timestamp */}
          <Typography
            sx={{
              color: darkMode ? "#475569" : "#94a3b8",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              px: 1,
              mt: 1.5,
            }}
          >
            3 hours ago
          </Typography>

          {/* Comment Modal */}
          {open && selectedPostId === post._id && (
            <COMMANTMODAL
              open={open}
              handleClose={handleClose}
              postId={selectedPostId}
              description={post.description}
              userName={post.userId.userName}
              profilePicture={post.userId.profilePictureUrl}
            />
          )}
        </Box>
      ))}
    </>
  );
};

export default InstagramPost;
