import { useState, useEffect } from "react";
import { Box } from "@mui/material";
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
import { getAllUsers } from "../../service/userApi";
import { likePost, getLikesCount } from "../../service/likeAPI";
import COMMANTMODAL from "../../modal/commentModal"; // Assuming you have a comment modal component

const InstagramPost = () => {
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

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
      .then((response) => {
        getAllPosts();
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <>
      {posts.map((post) => {
        

        return (
          <div
            key={post.id}
            style={{
              maxWidth: "470px",
              margin: "24px auto",
              fontFamily: "system-ui, -apple-system, sans-serif",
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundImage: `url(${
                      post.userId.profilePicture || "https://i.pravatar.cc/150?img=5"
                    })`,
                    backgroundSize: "cover",
                    marginRight: "12px",
                    borderRadius: "50%",
                  }}
                />
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  {post.userId.userName || "Unknown"}
                </span>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                <MoreVert style={{ fontSize: "20px", color: textColor }} />
              </button>
            </div>

            {/* Image */}
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                backgroundImage: `url(${post.postImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onDoubleClick={() => handleLike(post._id)}
            />

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 8px",
                marginTop: "4px",
              }}
            >
              <div>
                <button onClick={() => handleLike(post._id)} style={btnStyle}>
                  {post.isLiked ? (
                    <Favorite style={{ color: "#ed4956", fontSize: "24px" }} />
                  ) : (
                    <FavoriteBorder
                      style={{ fontSize: "24px", color: "#8e8e8e" }}
                    />
                  )}
                </button>
                <button style={btnStyle} onClick={() => handleOpen(post._id)}>
                  <ChatBubbleOutline
                    style={{ fontSize: "24px", color: "#8e8e8e" }}
                  />
                </button>
                <button style={btnStyle}>
                  <Send style={{ fontSize: "24px", color: "#8e8e8e" }} />
                </button>
              </div>
              <button style={btnStyle}>
                <BookmarkBorder
                  style={{ fontSize: "24px", color: "#8e8e8e" }}
                />
              </button>
            </div>

            {/* Likes */}
            <div
              style={{
                fontWeight: "600",
                margin: "4px 0",
                fontSize: "14px",
                padding: "0 8px",
              }}
            >
              {post.likeCount} likes
            </div>

            {/* Caption */}
            <div
              style={{
                fontSize: "14px",
                lineHeight: "1.4",
                padding: "0 8px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontWeight: "600", marginRight: "4px" }}>
                {post.userId.userName || "unknown"}
              </span>
              {post.description}
            </div>

            {/* Comments */}
            <div
              style={{
                color: "#8e8e8e",
                fontSize: "14px",
                padding: "0 8px",
                marginBottom: "4px",
                cursor: "pointer",
              }}
            >
              View all 142 comments
            </div>

            {/* Timestamp */}
            <div
              style={{
                color: "#8e8e8e",
                fontSize: "10px",
                textTransform: "uppercase",
                padding: "0 8px",
                letterSpacing: "0.2px",
              }}
            >
              3 HOURS AGO
            </div>

            {/* Divider */}
            <Box sx={{ paddingTop: "10px" }}>
              <Box
                component="hr"
                sx={{
                  border: 0,
                  height: "1px",
                  backgroundColor: darkMode ? "#333" : "#eaeaea",
                }}
              />
            </Box>
            {/* Comment Modal for this post */}
            {open && selectedPostId === post._id && (
              <COMMANTMODAL
                open={open}
                handleClose={handleClose}
                postId={selectedPostId}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const btnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
};

export default InstagramPost;
