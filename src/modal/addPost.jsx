import React, { useState, useEffect } from "react";
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
  Grid2,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { baseURL } from "../service/axiosInstance";
import * as Yup from "yup";
import { createPost } from "../service/postAPI";
import { useTheme as useCustomTheme } from "../store/ThemeContext";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

// Validation Schema
const validationSchema = Yup.object().shape({
  description: Yup.string()
    .max(200, "location exceeded limit")
    .required("Description is required"),
  location: Yup.string()
    .max(30, "location exceeded limit")
    .required("Location is required"),
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
  const bgColor = darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)";
  const textColor = darkMode ? "#f8fafc" : "#0f172a";

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
      setFieldValue(croppedImageFile);
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
      {!croppedPreviewUrl && !preview && (
        <MuiFileInput
          value={value}
          onChange={handleFileChange}
          placeholder="Click to upload image..."
          fullWidth
          InputProps={{
            style: { color: textColor },
            startAdornment: (
              <CloudUploadIcon sx={{ mr: 1.5, color: "#6366f1" }} />
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              height: { xs: 50, md: 120 },
              alignItems: "center",
              borderRadius: "14px",
              backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              transition: "all 0.2s ease-in-out",
              "& fieldset": {
                borderColor: "transparent !important",
              },
              "&:hover": {
                borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
              },
            },
          }}
        />
      )}
      {croppedPreviewUrl && (
        <Card
          className="glass-panel"
          sx={{
            mt: 1,
            maxWidth: 350,
            mx: "auto",
            background: bgColor,
            borderRadius: "20px",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          }}
        >
          <CardContent sx={{ p: 0.5 }}>
            <Box sx={{ width: "100%", aspectRatio: "1", overflow: "hidden", borderRadius: "16px" }}>
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
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "#ef4444",
              }}
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      )}

      {preview && !croppedPreviewUrl && (
        <Card
          className="glass-panel"
          sx={{
            mt: 1,
            maxWidth: 280,
            mx: "auto",
            background: bgColor,
            borderRadius: "20px",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
            p: 1.5,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ height: 200, width: "100%", position: "relative", borderRadius: "12px", overflow: "hidden" }}>
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
              sx={{ mt: 1.5, color: "#6366f1" }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", p: 0, mt: 1 }}>
            <Button
              variant="text"
              onClick={() => {
                setPreview(null);
                setCroppedPreviewUrl(null);
                setFieldValue(name, null);
              }}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={showCroppedImage}
              size="small"
              sx={{
                ml: 1.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.75rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
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

const LocationSearch = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { darkMode } = useCustomTheme();
  const textColor = darkMode ? "#f8fafc" : "#0f172a";

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: query,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
            headers: {
              "Accept-Language": "en",
            },
          }
        );

        setResults(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const debounce = setTimeout(fetchLocations, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(e.target.value);
        }}
        label="Location"
        fullWidth
        size="small"
        margin="dense"
        onFocus={() => {
          if (results.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        InputLabelProps={{
          style: { color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }
        }}
        InputProps={{
          sx: {
            borderRadius: "14px",
            color: textColor,
            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
          },
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon style={{ color: "#6366f1" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease-in-out",
            },
            "&:hover fieldset": {
              borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6366f1",
              boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.15)`,
            },
          },
        }}
      />
      {showSuggestions && results.length > 0 && (
        <Box
          className="glass-panel"
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: darkMode ? "#0f1626" : "#ffffff",
            zIndex: 999,
            maxHeight: 200,
            overflowY: "auto",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            }
          }}
        >
          {results.map((place) => (
            <Box
              key={place.place_id}
              onClick={() => {
                onSelect(place.display_name);
                setQuery(place.display_name);
                setResults([]);
                setShowSuggestions(false);
              }}
              sx={{
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: textColor,
                borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)"}`,
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.05)",
                },
              }}
            >
              {place.display_name}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const AddPost = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.95)";
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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

      const base64Image = await fileToBase64(fileToUpload);
      setUploadProgress(60);

      const uploadResponse = await axios.post(`${baseURL}/upload`, {
        image: base64Image,
        folder: "posts"
      });

      if (!uploadResponse.data.status) {
        throw new Error(uploadResponse.data.message || "Failed to upload to Cloudinary");
      }

      const imageUrl = uploadResponse.data.url;
      setUploadProgress(90);

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
  const textColor = darkMode ? "#f8fafc" : "#0f172a";

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="glass-panel"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90vw", sm: "70vw", md: "600px" },
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: "28px",
          boxShadow: darkMode
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
        }}
      >
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: textColor, fontWeight: 700 }}>
              Uploading... {uploadProgress}%
            </Typography>
            <Box
              sx={{
                height: 6,
                width: "100%",
                backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                borderRadius: 99,
                mt: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${uploadProgress}%`,
                  background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                  borderRadius: 99,
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
              <Grid2
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3, pb: 1.5, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    color: textColor,
                    letterSpacing: "-0.5px"
                  }}
                >
                  Create New Post
                </Typography>

                <IconButton
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    color: darkMode ? "#94a3b8" : "#64748b",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
                    }
                  }}
                >
                  <CloseIcon sx={{ fontSize: "1.4rem" }} />
                </IconButton>
              </Grid2>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                }}
              >
                <Box
                  sx={{ width: "100%", maxWidth: { xs: "100%", sm: "50%" } }}
                >
                  <Field name="location">
                    {({ field, form }) => (
                      <LocationSearch
                        value={field.value}
                        onSelect={(val) => form.setFieldValue("location", val)}
                      />
                    )}
                  </Field>
                  {touched.location && errors.location && (
                    <Typography color="error" variant="caption" sx={{ fontWeight: 600 }}>
                      {errors.location}
                    </Typography>
                  )}

                  <Field name="description">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        margin="dense"
                        InputLabelProps={{
                          style: { color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }
                        }}
                        InputProps={{
                          sx: {
                            borderRadius: "14px",
                            color: textColor,
                            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.2s ease-in-out",
                            },
                            "&:hover fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#6366f1",
                              boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.15)`,
                            },
                          },
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
                      width: "100%",
                      maxWidth: { xs: "100%" },
                      mt: 1.5,
                      display: { xs: "block", sm: "none" },
                    }}
                  >
                    <Field name="file">
                      {({ field, form }) => (
                        <FileInput field={field} form={form} />
                      )}
                    </Field>
                    {touched.file && errors.file && (
                      <Typography color="error" variant="caption" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {errors.file}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                        px: 4,
                        py: 1,
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",
                          transform: "translateY(-1px)",
                        }
                      }}
                    >
                      Publish Post
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" },
                    mt: 1,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput field={field} form={form} />
                    )}
                  </Field>
                  {touched.file && errors.file && (
                    <Typography color="error" variant="caption" sx={{ fontWeight: 600, mt: 0.5, display: "block" }}>
                      {errors.file}
                    </Typography>
                  )}
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
