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
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      setFieldValue(name, croppedImage); // For Formik
      // Show the cropped image as preview
      setCroppedPreview(URL.createObjectURL(croppedImage));
      setPreview(null); // Hide cropper
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <MuiFileInput
        value={value}
        onChange={handleFileChange}
        placeholder="Click to upload"
        fullWidth
      />

      {/* Show preview outside the input */}

      {croppedPreview ? (
        <Card
          sx={{
            mt: 2,
            width: { xs: 250, sm: 300 },
            mx: "auto",
            boxShadow: 3,
            borderRadius: 2,
            background: bgColor,
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 250, sm: 300 },
                position: "relative",
                background: bgColor,
                borderRadius: 2,
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
                  borderRadius: 8,
                }}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
            <Button
              color="secondary"
              onClick={() => {
                setCroppedPreview(null);
                setPreview(null);
                setFieldValue(name, null);
              }}
              size="small"
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      ) : (
        preview && (
          <Card
            sx={{
              mt: 2,
              width: { xs: 250, sm: 300 },
              mx: "auto",
              boxShadow: 3,
              borderRadius: 2,
              background: bgColor,
              position: "relative",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 250, sm: 300 },
                  position: "relative",
                  background: bgColor,
                  borderRadius: 2,
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
                onChange={(e, zoom) => setZoom(zoom)}
                sx={{ mt: 2, mx: 2 }}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setPreview(null)}
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={showCroppedImage}
                size="small"
                sx={{ ml: 1 }}
              >
                Crop & Use
              </Button>
            </CardActions>
          </Card>
        )
      )}
    </Box>
  );
};

// Validation Schema
const validationSchema = Yup.object().shape({
  file: Yup.mixed().required("Image is required"),
});

const EditProfile = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#000000";

  const handleSubmit = async (values, { setSubmitting }) => {
    const {  name, file, bio } = values;

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("profilepictures")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("profilepictures")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      updateUserDetails({
        name,
        profilePictureUrl: imageUrl,
        bio,
      })
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);
          handleClose();
          navigate("/");
        })

        .catch((error) => {
          console.error("Error during editing profile:", error);
          setSubmitting(false);
        });
    } catch (error) {
      console.error("Error during file upload:", error);
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
          width: 400,
          height:520,
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          color: textColor,
          backgroundColor: bgColor,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontStyle: "inherit" }}
          component="h2"
          gutterBottom
        >
          Edit Profile
        </Typography>

        <Formik
          initialValues={{  name: "", file: null, bio: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field name="name">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
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
              <Field name="file">
                {({ field, form }) => <FileInput field={field} form={form} />}
              </Field>

              <Field name="bio">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="bio"
                    fullWidth
                    variant="outlined"
                    margin="normal"
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
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Edit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditProfile;
