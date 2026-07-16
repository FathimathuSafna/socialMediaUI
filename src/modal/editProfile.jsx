import React, { useState } from "react";
import { Typography, Box, Button, Modal, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { baseURL } from "../service/axiosInstance";
import * as Yup from "yup";
import { updateUserDetails } from "../service/user_api";
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
    const navigate = useNavigate();


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
      const croppedImageFile = new File(
        [croppedImageBlob],
        "cropped-profile.jpeg",
        { type: "image/jpeg" }
      );

      setFieldValue(name, croppedImageFile);
      setCroppedPreview(URL.createObjectURL(croppedImageFile));
      setPreview(null); // Hide the cropper
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 0.5, sm: 1 },
      }}
    >
      {!croppedPreview && !preview && (
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
          }}
          sx={{
            "& .MuiInputBase-root": {
              height: { xs: 40, md: 90 },
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

      {/* Cropped Image Preview */}
      {croppedPreview && (
        <Card
          sx={{
            mt: { xs: 0.5, sm: 2 },
            width: "100%",
            maxWidth: { xs: 110, sm: 180 },
            mx: "auto",
            boxShadow: 2,
            borderRadius: 1,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: { xs: 0.2, sm: 0 } }}>
            {" "}
            {/* Reduced padding for xs */}
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
          <CardActions
            sx={{
              justifyContent: "center",
              px: { xs: 0.5, sm: 2 },
              pb: { xs: 0.5, sm: 2 },
            }}
          >
            {" "}
            {/* Reduced padding for xs */}
            <Button
              color="secondary"
              onClick={() => {
                setCroppedPreview(null);
                setPreview(null); 
                setFieldValue(name, null); 
                navigate(`/`)
              }}
              size="small"
              sx={{ fontSize: "0.6rem", minWidth: "auto", px: 0.5 }} // Smaller text
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
          <CardContent sx={{ p: { xs: 0.2, sm: 0 } }}>
            {" "}
            {/* Reduced padding for xs */}
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
              sx={{
                mt: { xs: 0.5, sm: 2 },
                mx: { xs: 0.5, sm: 2 },
                color: "#8e8e8e",
              }} // Reduced margins for xs
            />
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "flex-end",
              px: { xs: 0.5, sm: 2 },
              pb: { xs: 0.5, sm: 2 },
            }}
          >
            {" "}
            {/* Reduced padding for xs */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setPreview(null);
                setCroppedPreview(null);
                setFieldValue(field.name, null);
              }}
              size="small"
              sx={{
                borderColor: "#8e8e8e",
                color: "#8e8e8e",
                fontSize: "0.55rem",
                minWidth: "auto",
                px: 0.4,
              }}
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
                fontSize: "0.55rem",
                minWidth: "auto",
                px: 0.4, // Smaller text
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
  file: Yup.mixed().required("Profile picture is required"),
});

const EditProfile = ({ open, handleClose, user }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";
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
    const { name, file, bio } = values;

    try {
      // Ensure file is an actual File object, not a Blob URL
      let fileToUpload = file;
      if (typeof file === "string" && file.startsWith("blob:")) {
        const response = await fetch(file);
        fileToUpload = await response.blob();
        fileToUpload = new File([fileToUpload], "cropped-profile.jpeg", {
          type: "image/jpeg",
        });
      } else if (!(file instanceof File)) {
        console.warn("File is not a File object, attempting to convert.");
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = new File([blob], "profile.jpeg", { type: blob.type });
      }
      setUploadProgress(30);

      const base64Image = await fileToBase64(fileToUpload);
      setUploadProgress(60);

      const uploadResponse = await axios.post(`${baseURL}/upload`, {
        image: base64Image,
        folder: "profilepictures"
      });

      if (!uploadResponse.data.status) {
        throw new Error(uploadResponse.data.message || "Failed to upload to Cloudinary");
      }

      const imageUrl = uploadResponse.data.url;
      setUploadProgress(90);

      await updateUserDetails({
        name,
        profilePictureUrl: imageUrl,
        bio,
      });
      setUploadProgress(100);

      setSubmitting(false);
      setUploadProgress(0);

      handleClose();
      navigate("/");
    } catch (error) {
      console.error("Error during profile update:", error);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} userDetails={user}>
      <Box
        className="glass-panel"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90vw", sm: "80vw", md: "600px" },
          overflow: "hidden",
          borderRadius: "28px",
          backdropFilter: "blur(28px)",
          backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.9)",
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          boxShadow: darkMode
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
          p: { xs: 4, sm: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            textAlign: "center",
            mb: 3,
            color: darkMode ? "#f8fafc" : "#0f172a",
          }}
          component="h2"
        >
          Edit Profile
        </Typography>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: textColor, fontWeight: 600 }}>
              Uploading... {uploadProgress}%
            </Typography>
            <Box
              sx={{
                height: 6,
                width: "100%",
                backgroundColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                borderRadius: 99,
                mt: 0.5,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${uploadProgress}%`,
                  background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                  transition: "width 0.4s ease-in-out",
                }}
              />
            </Box>
          </Box>
        )}

        <Formik
          enableReinitialize
          initialValues={{
            name: user.name || "",
            file: null,
            bio: user.bio || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  alignItems: "flex-start",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {/* Form Inputs (Name, Bio) */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flexGrow: 1,
                  }}
                >
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Full Name"
                        label="Name"
                        fullWidth
                        size="small"
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "14px",
                            color: textColor,
                            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.4)",
                            "& fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.2s ease-in-out",
                            },
                            "&:hover fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: darkMode ? "#60a5fa" : "#2563eb",
                              boxShadow: `0 0 0 4px ${darkMode ? "rgba(96, 165, 250, 0.15)" : "rgba(37, 99, 235, 0.08)"}`,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode ? "#94a3b8" : "#64748b",
                            fontSize: "0.9rem",
                            "&.Mui-focused": {
                              color: darkMode ? "#60a5fa" : "#2563eb",
                            }
                          }
                        }}
                      />
                    )}
                  </Field>

                  <Field name="bio">
                    {({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Tell us about yourself"
                        label="Bio"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        size="small"
                        error={Boolean(touched.bio && errors.bio)}
                        helperText={touched.bio && errors.bio}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "14px",
                            color: textColor,
                            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.4)",
                            "& fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                              transition: "all 0.2s ease-in-out",
                            },
                            "&:hover fieldset": {
                              borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: darkMode ? "#60a5fa" : "#2563eb",
                              boxShadow: `0 0 0 4px ${darkMode ? "rgba(96, 165, 250, 0.15)" : "rgba(37, 99, 235, 0.08)"}`,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode ? "#94a3b8" : "#64748b",
                            fontSize: "0.9rem",
                            "&.Mui-focused": {
                              color: darkMode ? "#60a5fa" : "#2563eb",
                            }
                          }
                        }}
                      />
                    )}
                  </Field>

                  {/* File Input for Mobile Viewports */}
                  <Box
                    sx={{
                      width: "100%",
                      display: { xs: "block", sm: "none" },
                      mt: 1,
                    }}
                  >
                    <Field name="file">
                      {({ field, form }) => (
                        <FileInput field={field} form={form} />
                      )}
                    </Field>
                    {touched.file && errors.file && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {errors.file}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      mt: 2,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        borderRadius: "12px",
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                        color: darkMode ? "#f8fafc" : "#0f172a",
                        py: 1,
                        px: 3,
                        flex: 1,
                        "&:hover": {
                          borderColor: darkMode ? "#ffffff" : "#000000",
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                        }
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        borderRadius: "12px",
                        background: darkMode
                          ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
                          : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        color: "#ffffff",
                        py: 1,
                        px: 3,
                        flex: 1,
                        boxShadow: darkMode
                          ? "0 4px 14px 0 rgba(96, 165, 250, 0.2)"
                          : "0 4px 14px 0 rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background: darkMode
                            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                            : "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>

                {/* File Input for Desktop Viewports */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "45%" },
                    display: { xs: "none", sm: "block" },
                    flexShrink: 0,
                  }}
                >
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput field={field} form={form} />
                    )}
                  </Field>
                  {touched.file && errors.file && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 1, display: "block" }}
                    >
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

export default EditProfile;
