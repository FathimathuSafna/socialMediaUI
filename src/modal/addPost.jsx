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
import { supabase } from "../store/supabaseClient";
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
          placeholder="Click to upload"
          fullWidth
          InputProps={{
            style: { color: "#8e8e8e" },
            startAdornment: (
              <CloudUploadIcon sx={{ mr: 1, color: "#8e8e8e" }} />
            ),
            sx: {
              textAlign: "center",
            },
          }}
          sx={{
            "& .MuiInputBase-root": {
              height: { xs: 40, md: 116 },
              alignItems: "center",
            },
            "& input": {
              height: "100%",
              padding: 0,
            },
          }}
          // size="small"
        />
      )}
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

const LocationSearch = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
          setTimeout(() => setShowSuggestions(false), 100);
        }}
        InputLabelProps={{ style: { color: "#8e8e8e" } }}
        InputProps={{
          style: { color: "#8e8e8e" },
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon style={{ color: "#8e8e8e" }} />
            </InputAdornment>
          ),
        }}
      />
      {showSuggestions && results.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            zIndex: 999,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
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
                padding: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
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
  const textColor = darkMode ? "#ffffff" : "#000000";

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
          color: "#8e8e8e",
        }}
      >
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
              <Grid2
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  Add Post
                </Typography>

                <IconButton
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    color: "#8e8e8e",
                    padding: "2px",
                    fontSize: "0.7rem",
                    minWidth: 0,
                  }}
                >
                  <CloseIcon sx={{ fontSize: "1.6rem" }} />
                </IconButton>
              </Grid2>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
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
                    <Typography color="error" variant="caption">
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
                    width: "100%",
                    maxWidth: { xs: "100%" },
                    mt: 1,
                    display: { xs: "block",sm:'none', md: "none" },
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        color: "#fff",
                        mt: 3,
                      }}
                    >
                      submit
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "50%" },
                    mt: 1,
                    display: { xs: "none",sm:'block', md: "block" },
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
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddPost;
