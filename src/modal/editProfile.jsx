import React, { useState } from "react";
import { Typography, Box, Button, Modal, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { supabase } from "../store/supabaseClient";
import * as Yup from "yup";
import { updateUserDetails } from "../service/userApi";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "../utils/cropImage";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Custom Formik-compatible FileInput
const FileInput = ({ field, form }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";

  const handleFileChange = (file) => {
    setFieldValue(name, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setCroppedPreview(null); // Clear previous cropped preview when new file selected
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setCroppedPreview(null); // Clear both on no file
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(preview, croppedAreaPixels);
      // Convert Blob back to File for Formik, if necessary for your backend
      const croppedImageFile = new File([croppedImageBlob], "cropped-profile.jpeg", { type: "image/jpeg" });

      setFieldValue(name, croppedImageFile); // Update Formik value with the File object
      setCroppedPreview(URL.createObjectURL(croppedImageFile)); // Show URL for image preview
      setPreview(null); // Hide the cropper
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 0.5, sm: 1 } }}>
      <MuiFileInput
        value={value}
        onChange={handleFileChange}
        placeholder="Click to upload"
        fullWidth
        InputProps={{
          startAdornment: <CloudUploadIcon sx={{ mr: 1, color: "#8e8e8e" }} />,
        }}
        size="small"
      />

      {/* Cropped Image Preview */}
      {croppedPreview && (
        <Card
          sx={{
            mt: { xs: 0.5, sm: 2 },
            width: "100%",
            maxWidth: { xs: 110, sm: 300 }, // **Increased maxWidth for xs to 110px**
            mx: "auto",
            boxShadow: 2, // Slightly reduced shadow
            borderRadius: 1,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 0.2, sm: 0 } }}> {/* Reduced padding for xs */}
            <Box
              sx={{
                width: "100%",
                aspectRatio: "1",
                position: "relative",
                background: bgColor,
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={croppedPreview}
                alt="Cropped Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", px: { xs: 0.5, sm: 2 }, pb: { xs: 0.5, sm: 2 } }}> {/* Reduced padding for xs */}
            <Button
              color="secondary"
              onClick={() => {
                setCroppedPreview(null);
                setPreview(null); // Ensure preview is also cleared
                setFieldValue(name, null); // Clear Formik value
              }}
              size="small"
              sx={{ fontSize: '0.6rem', minWidth: 'auto', px: 0.5 }} // Smaller text
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      )}

      {/* Cropper Component */}
      {preview && !croppedPreview && (
        <Card
          sx={{
            mt: { xs: 0.5, sm: 2 },
            width: "100%",
            maxWidth: { xs: 110, sm: 300 }, // **Increased maxWidth for xs to 110px**
            mx: "auto",
            boxShadow: 2, // Slightly reduced shadow
            borderRadius: 1,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 0.2, sm: 0 } }}> {/* Reduced padding for xs */}
            <Box
              sx={{
                width: "100%", // **Changed from {xs: "50%", sm: "100%"} to "100%"**
                aspectRatio: "1",
                position: "relative",
                background: bgColor,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, newZoom) => setZoom(newZoom)} // Corrected handler parameter
              sx={{ mt: { xs: 0.5, sm: 2 }, mx: { xs: 0.5, sm: 2 }, color: "#8e8e8e" }} // Reduced margins for xs
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", px: { xs: 0.5, sm: 2 }, pb: { xs: 0.5, sm: 2 } }}> {/* Reduced padding for xs */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setPreview(null);
                setFieldValue(name, null); // Clear Formik value if cancelled
              }}
              size="small"
              sx={{ borderColor: "#8e8e8e", color: "#8e8e8e", fontSize: '0.55rem', minWidth: 'auto', px: 0.4 }} // Smaller text
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={showCroppedImage}
              size="small"
              sx={{
                ml: { xs: 0.5, sm: 1 }, // Reduced ml for xs
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                color: "#ffffff",
                fontSize: '0.55rem', minWidth: 'auto', px: 0.4 // Smaller text
              }}
            >
              Crop & Use
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};

// Validation Schema
const validationSchema = Yup.object().shape({
  file: Yup.mixed().required("Profile picture is required"), // Changed message for clarity
});

const EditProfile = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  const handleSubmit = async (values, { setSubmitting }) => {
    const { name, file, bio } = values;

    try {
      // Ensure file is an actual File object, not a Blob URL
      let fileToUpload = file;
      if (typeof file === 'string' && file.startsWith('blob:')) {
        const response = await fetch(file);
        fileToUpload = await response.blob();
        fileToUpload = new File([fileToUpload], "cropped-profile.jpeg", { type: "image/jpeg" });
      } else if (!(file instanceof File)) {
         // If it's something else that needs conversion (e.g., if you're pre-filling with a remote URL)
         // This might not be needed if FileInput correctly returns a File or Blob.
         console.warn("File is not a File object, attempting to convert.");
         const response = await fetch(file);
         const blob = await response.blob();
         fileToUpload = new File([blob], "profile.jpeg", { type: blob.type });
      }

      // 1. Upload image to Supabase Storage
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profilepictures/${fileName}`; // Changed path to be more specific to profiles

      const { data, error: uploadError } = await supabase.storage
        .from("profilepictures")
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("profilepictures")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Update user details
      await updateUserDetails({ // Using await for updateUserDetails
        name,
        profilePictureUrl: imageUrl,
        bio,
      });

      setSubmitting(false);
      handleClose();
      // Consider navigating to the profile page instead of home
      // const currentUserName = localStorage.getItem("userName"); // Assuming username is in local storage
      // navigate(`/profile/${currentUserName}`);
      navigate("/"); // Sticking to original navigate for now

    } catch (error) {
      console.error("Error during profile update:", error);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80vw", sm: "70vw", md: "600px" }, // **Reduced xs width to 70vw**
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 0.9, sm: 3 }, // **Reduced overall padding for xs to 0.8**
          backgroundColor: bgColor,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontStyle: "inherit",
            fontSize: { xs: "0.85rem", sm: "1.25rem" }, // **Reduced title font size for xs to 0.9rem**
            textAlign: "center",
            mb: { xs: 1, sm: 2 }, // Added a little bottom margin for xs
          }}
          component="h2"
          gutterBottom
        >
          Edit Profile
        </Typography>

        <Formik
          initialValues={{ name: "", file: null, bio: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0.9, sm: 3 }, 
                  alignItems: "flex-start", 
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {/* Left: Image Upload & Preview */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    pt: { xs: 0, sm: 2 } 
                  }}
                >
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput field={field} form={form} />
                    )}
                  </Field>
                  {touched.file && errors.file && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.1, fontSize: '0.65rem' }}>
                      {errors.file}
                    </Typography>
                  )}
                </Box>

                {/* Right: Form Inputs (Name, Bio) */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" }, // Let inner padding handle the "narrower" effect
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flexGrow: 1,
                    px: { xs: 0, sm: 0 }, // **Added horizontal padding for xs to create left/right gap and effectively narrow text fields**
                  }}
                >
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Name" // Changed label to "Name"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        size="small" // Added size small for compactness
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: "#8e8e8e",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#8e8e8e",
                          },
                        }}
                      />
                    )}
                  </Field>

                  <Field name="bio">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Bio" // Changed label to "Bio"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        multiline // Kept multiline
                        rows={1} // Set to 1 row initially for compactness
                        size="small" // Added size small for compactness
                        error={Boolean(touched.bio && errors.bio)}
                        helperText={touched.bio && errors.bio}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: "#8e8e8e",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#8e8e8e",
                          },
                        }}
                      />
                    )}
                  </Field>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: { xs: 1, sm: 2 }, // **Reduced mt for xs to 1**
                      px: { xs: 1.5, sm: 0 }, // **Apply same horizontal padding to buttons for consistency**
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      sx={{ borderColor: "#8e8e8e", color: "#8e8e8e", py: 0.4, fontSize: '0.65rem' }} // **Reduced py and font size**
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        color: "#ffffff",
                        py: 0.4, // **Reduced py and font size**
                        fontSize: '0.65rem',
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditProfile;