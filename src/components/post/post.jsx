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
import COMMANTMODAL from "../../modal/commentModal"; // Assuming you have a comment modal component

const InstagramPost = () => {
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1243);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getPosts(token)
        .then((response) => setPosts(response.data))
        .catch((error) => console.error(error));

      getAllUsers(token)
        .then((response) => setUsers(response.data))
        .catch((error) => console.error(error));
    }
  }, [token]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  const getUserById = (userId) => users.find((u) => u._id === userId);

  return (
    <>
      {posts.map((post) => {
        const user = getUserById(post.userId) || {}; // Assuming post.userId exists
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
                      user.profilePicture || "https://i.pravatar.cc/150?img=5"
                    })`,
                    backgroundSize: "cover",
                    marginRight: "12px",
                    borderRadius: "50%",
                  }}
                />
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  {user.userName || "Unknown"}
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
              onDoubleClick={handleLike}
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
                <button onClick={handleLike} style={btnStyle}>
                  {liked ? (
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
              {likes.toLocaleString()} likes
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
                {user.userName || "travel_lover"}
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
