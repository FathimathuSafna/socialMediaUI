import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { MuiFileInput } from 'mui-file-input';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../store/supabaseClient'



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CustomFileInput = ({ value, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '30px',
      marginBottom: '20px',
      marginTop: '10px',
      cursor: 'pointer',
    }}
  >
    <MuiFileInput
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: value
          ? null
          : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  pointerEvents: 'none',
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Click to upload image
                </Typography>
              </Box>
            ),
        sx: {
          height: value ? 'auto' : '150px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
      }}
    />
    {value && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">{value.name}</Typography>
      </Box>
    )}
  </Box>
);

const AddPost = ({ open, handleClose }) => {
  const navigate = useNavigate()
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const date = new Date().toISOString().split('T')[0];



  const handleUpload = async () => {
    if (!value || !description) return;

    // Upload image to Supabase storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('posts')
      .upload(`images/${Date.now()}_${value.name}`, value);

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return;
    }

    // Insert the post data into Supabase table
    const { error: insertError } = await supabase.from('posts').insert([
      {
        image_url: fileData.path,
        description: description,
      },
    ]);

    if (insertError) {
      console.error('Insert failed:', insertError);
    } else {
      handleClose(); 
      navigate('/'); 
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Post
        </Typography>

        <CustomFileInput value={value} onChange={setValue} />

        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleUpload}>
            Post
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPost;
