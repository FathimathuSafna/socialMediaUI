import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  ChatBubbleOutline, 
  Send, 
  BookmarkBorder, 
  MoreVert 
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';


const InstagramPost = () => {
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const theme = useCustomTheme();


  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1243);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div style={{
      maxWidth: '470px',
      margin: '24px auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundImage: 'url(https://i.pravatar.cc/150?img=5)',
            backgroundSize: 'cover',
            marginRight: '12px',
            borderRadius: '50%',
          }}/>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>travel_lover</span>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}>
          <MoreVert style={{ fontSize: '20px', color: '#262626' }} />
        </button>
      </div>

      {/* Image */}
      <div 
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: 'url(https://i.pinimg.com/736x/65/46/26/654626eefd5c62ab965fe1763c0e22c1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }}
        onDoubleClick={handleLike}
      />

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 0',
        marginTop: '4px'
      }}>
        <div>
          <button 
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 8px 8px 0'
            }}
          >
            {liked ? 
              <Favorite style={{ color: '#ed4956', fontSize: '24px' }} /> : 
              <FavoriteBorder style={{ fontSize: '24px', color: '#8e8e8e' }} />
            }
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <ChatBubbleOutline style={{ fontSize: '24px', color: '#8e8e8e' }} />
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <Send style={{ fontSize: '24px', color: '#8e8e8e' }} />
          </button>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}>
          <BookmarkBorder style={{ fontSize: '24px', color: '#8e8e8e' }} />
        </button>
      </div>

      {/* Likes */}
      <div style={{ 
        fontWeight: '600', 
        margin: '4px 0', 
        fontSize: '14px',
        padding: '0 8px'
      }}>
        {likes.toLocaleString()} likes
      </div>

      {/* Caption */}
      <div style={{ 
        fontSize: '14px',
        lineHeight: '1.4',
        padding: '0 8px',
        marginBottom: '4px'
      }}>
        <span style={{ fontWeight: '600', marginRight: '4px' }}>travel_lover</span>
        Sunset views in Santorini are unreal! #Greece #Travel #Sunset
      </div>

      {/* Comments */}
      <div style={{ 
        color: '#8e8e8e', 
        fontSize: '14px',
        padding: '0 8px',
        marginBottom: '4px',
        cursor: 'pointer'
      }}>
        View all 142 comments
      </div>

      {/* Timestamp */}
      <div style={{ 
        color: '#8e8e8e', 
        fontSize: '10px',
        textTransform: 'uppercase',
        padding: '0 8px',
        letterSpacing: '0.2px'
      }}>
        3 HOURS AGO
      </div>
      <Box sx={{ paddingTop: '10px' }}>
        <Box
          component="hr"
          sx={{
            border: 0,
            height: '1px',
            backgroundColor: darkMode ? '#000':'#fff' ,
          }}
        />
      </Box>
    </div>
  );
};

export default InstagramPost;