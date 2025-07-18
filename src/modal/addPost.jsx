import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  CardActions,
  Slider,
} from "@mui/material";
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

// Validation Schema
const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  file: Yup.mixed().required("Image is required"),
});

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
      const croppedImageFile = new File(
        [croppedImageBlob],
        "cropped-image.jpeg",
        {
          type: "image/jpeg",
        }
      );
      setFieldValue(name, croppedImageFile);
      setCroppedPreviewUrl(URL.createObjectURL(croppedImageFile));
      setPreview(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      <MuiFileInput
        value={value}
        onChange={handleFileChange}
        placeholder="Click to upload"
        fullWidth
         InputProps={{
          style: { color:"#8e8e8e"  }, 
          startAdornment: <CloudUploadIcon sx={{ mr: 1, color: "#8e8e8e" }} />,
        }}
        size="small"
      />

      {croppedPreviewUrl && (
        <Card sx={{ mt: 1, maxWidth: 150, mx: "auto", background: bgColor }}>
          <CardContent sx={{ p: 0.2 }}>
            <Box sx={{ width: "100%", aspectRatio: "1", overflow: "hidden" }}>
              <img
                src={croppedPreviewUrl}
                alt="Cropped Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={() => {
                setCroppedPreviewUrl(null);
                setFieldValue(name, null);
              }}
              size="small"
              sx={{ fontSize: "0.7rem" }}
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      )}

      {preview && !croppedPreviewUrl && (
        <Card sx={{ mt: 1, maxWidth: 150, mx: "auto", background: bgColor }}>
          <CardContent sx={{ p: 0.2 }}>
            <Box sx={{ width: "100%", aspectRatio: "1", position: "relative" }}>
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
              onChange={(e, newZoom) => setZoom(newZoom)}
              sx={{ mt: 0.5, color: "#8e8e8e" }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setPreview(null);
                setCroppedPreviewUrl(null);
                setFieldValue(field.name, null);
              }}
              size="small"
              sx={{ fontSize: "0.65rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={showCroppedImage}
              size="small"
              sx={{
                ml: 1,
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                color: "#ffffff",
                fontSize: "0.65rem",
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

const AddPost = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (values, { setSubmitting }) => {
    const { location, file, description } = values;
    if (!file) {
      console.error("No file to upload.");
      setSubmitting(false);
      return;
    }

    try {
      let fileToUpload = file;
      if (!(file instanceof File)) {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = new File([blob], "image.jpeg", { type: blob.type });
      }

      setUploadProgress(30);

      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(90);

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      await createPost({ location, postImageUrl: imageUrl, description });

      setUploadProgress(100);
      setSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000);
      handleClose();
      navigate("/");
    } catch (error) {
      console.error("Error during post creation:", error);
      setSubmitting(false);
      setUploadProgress(0);
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
          width: { xs: "85vw", sm: "70vw", md: "600px" },
          p: 2,
          borderRadius: 2,
          boxShadow: 24,
          backgroundColor: bgColor,
          color:"#8e8e8e"
        }}
      >
        <Typography variant="h6" textAlign="center" gutterBottom>
          Create New Post
        </Typography>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: textColor }}>
              Uploading... {uploadProgress}%
            </Typography>
            <Box
              sx={{
                height: 5,
                width: "100%",
                backgroundColor: "#ccc",
                borderRadius: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${uploadProgress}%`,
                  backgroundColor: "#8e8e8e",
                  borderRadius: 1,
                  transition: "width 0.4s ease-in-out",
                }}
              />
            </Box>
          </Box>
        )}

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
                  gap: 2,
                }}
              >
                {/* Left: File Upload */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" },
                    mt: 1,
                  }}
                >
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput field={field} form={form} />
                    )}
                  </Field>
                  {touched.file && errors.file && (
                    <Typography color="error" variant="caption">
                      {errors.file}
                    </Typography>
                  )}
                </Box>

                {/* Right: Fields */}
                <Box
                  sx={{ width: "100%", maxWidth: { xs: "100%", sm: "50%" } }}
                >
                  <Field name="location">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Location"
                        fullWidth
                        size="small"
                        margin="dense"
                        InputLabelProps={{
                          style: { color: "#8e8e8e" },
                        }}
                        InputProps={{
                          style: { color: "#8e8e8e" },
                        }}
                        error={touched.location && Boolean(errors.location)}
                        helperText={touched.location && errors.location}
                      />
                    )}
                  </Field>

                  <Field name="description">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        margin="dense"
                        InputLabelProps={{
                          style: { color: "#8e8e8e" },
                        }}
                        InputProps={{
                          style: { color: "#8e8e8e" },
                        }}
                        error={
                          touched.description && Boolean(errors.description)
                        }
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </Field>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      sx={{ color: "#8e8e8e", borderColor: "#8e8e8e" }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        color: "#fff",
                      }}
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
