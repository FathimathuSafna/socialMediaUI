import React, { useState } from "react";
import { Typography, Box, Button, Modal, TextField, Paper, Card, CardContent, CardActions, Slider } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { supabase } from "../store/supabaseClient";
import * as Yup from "yup";
import { createPost } from "../service/postAPI";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

// Custom Formik-compatible FileInput
const FileInput = ({ field, form }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";

  const handleFileChange = (file) => {
    setFieldValue(name, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setCroppedPreviewUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setCroppedPreviewUrl(null);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(preview, croppedAreaPixels);
      const croppedImageFile = new File([croppedImageBlob], "cropped-image.jpeg", { type: "image/jpeg" });
      setFieldValue(name, croppedImageFile);
      setCroppedPreviewUrl(URL.createObjectURL(croppedImageFile));
      setPreview(null);
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
      {croppedPreviewUrl && (
        <Card
          sx={{
            mt: { xs: 0.5, sm: 1 },
            width: "100%",
            maxWidth: { xs: 150, sm: 120 }, // Increased maxWidth for xs to 100px
            mx: "auto",
            boxShadow: 2,
            borderRadius: 1,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 0.2, sm: 0 } }}>
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
                src={croppedPreviewUrl}
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
          <CardActions sx={{ justifyContent: "center", px: { xs: 0.2, sm: 0.5 }, pb: { xs: 0.2, sm: 0.5 } }}>
            <Button
              color="secondary"
              onClick={() => {
                setCroppedPreviewUrl(null);
                setFieldValue(name, null);
              }}
              size="small"
              sx={{ fontSize: '0.6rem', minWidth: 'auto', px: 0.5 }}
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      )}

      {/* Cropper Component */}
      {preview && !croppedPreviewUrl && (
        <Card
          sx={{
            mt: { xs: 0.5, sm: 1 },
            width: "100%",
            maxWidth: { xs: 130, sm: 120 }, // Increased maxWidth for xs to 100px
            mx: "auto",
            boxShadow: 2,
            borderRadius: 1,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 0.2, sm: 0 }, mt: { xs: 0.2, sm: 0.5 } }}>
            <Box
              sx={{
                width: "100%",
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
              onChange={(e, newZoom) => setZoom(newZoom)}
              sx={{ mt: { xs: 0.2, sm: 0.5 }, mx: { xs: 0.2, sm: 0.5 },ml:1, color: "#8e8e8e" }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", px: { xs: 0.2, sm: 0.5 }, pb: { xs: 0.2, sm: 0.5 } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setPreview(null);
                setFieldValue(name, null);
              }}
              size="small"
              sx={{ borderColor: "#8e8e8e", color: "#8e8e8e", fontSize: '0.55rem', minWidth: 'auto', px: 0.4 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={showCroppedImage}
              size="small"
              sx={{
                ml: { xs: 0.2, sm: 0.5 },
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                color: "#ffffff",
                fontSize: '0.55rem',
                minWidth: 'auto', px: 0.4
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

// Validation Schema (remains the same)
const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  file: Yup.mixed().required("Image is required"),
});

const AddPost = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  const handleSubmit = async (values, { setSubmitting }) => {
    const { location, file, description } = values;

    if (!file) {
      console.error("No file to upload.");
      setSubmitting(false);
      return;
    }

    try {
      let fileToUpload = file;
      if (typeof file === 'string' && file.startsWith('blob:')) {
        const response = await fetch(file);
        fileToUpload = await response.blob();
        fileToUpload = new File([fileToUpload], "cropped-image.jpeg", { type: "image/jpeg" });
      } else if (!(file instanceof File)) {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = new File([blob], "image.jpeg", { type: blob.type });
      }

      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      await createPost({
        location,
        postImageUrl: imageUrl,
        description,
      });

      setSubmitting(false);
      handleClose();
      navigate("/");
    } catch (error) {
      console.error("Error during post creation:", error);
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
          width: { xs: "89vw", sm: "70vw", md: "600px" }, // **Reduced xs width to 85vw**
          p: { xs: 0.9, sm: 2 },
          borderRadius: 2,
          boxShadow: 24,
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
            fontSize: { xs: "0.85rem", sm: "1.25rem" },
            textAlign: "center",
            mb: { xs: 1, sm: 2 },
          }}
          component="h2"
          gutterBottom
        >
          Create New Post
        </Typography>

        <Formik
          initialValues={{ location: "", file: null, description: "" }}
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
                    mt: { xs: 0, sm: 1 },
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

                {/* Right: Form Inputs */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    flexGrow: 1,
                    // Added horizontal padding for text fields
                    px: { xs: 0, sm: 0 } ,// **Added 1 unit of padding on left/right for xs**
                  }}
                >
                  <Field name="location">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Location"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        size="small"
                        error={Boolean(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                        sx={{
                          "& .MuiInputBase-input": { color: "#8e8e8e" },
                          "& .MuiInputLabel-root": { color: "#8e8e8e" },
                        }}
                      />
                    )}
                  </Field>

                  <Field name="description">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        multiline
                        rows={1}
                        size="small"
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        helperText={touched.description && errors.description}
                        sx={{
                          "& .MuiInputBase-input": { color: "#8e8e8e" },
                          "& .MuiInputLabel-root": { color: "#8e8e8e" },
                        }}
                      />
                    )}
                  </Field>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: { xs: 0.8, sm: 2 },
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      sx={{ borderColor: "#8e8e8e", color: "#8e8e8e", py: 0.4, fontSize: '0.65rem' }}
                    >
                      Close
                    </Button>
                    <Button
                      sx={{
                        color: "#ffffff",
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        py: 0.4, fontSize: '0.65rem'
                      }}
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      size="small"
                    >
                      Post
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

export default AddPost;