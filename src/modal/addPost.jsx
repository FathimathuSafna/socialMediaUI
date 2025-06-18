import React, { useState } from "react";
import { Typography, Box, Button, Modal, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { supabase } from "../store/supabaseClient";
import * as Yup from "yup";
import Axios from "axios";
import { createPost } from "../service/postAPI";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Custom Formik-compatible FileInput
const FileInput = ({ field, form }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const [preview, setPreview] = useState(null);

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

  return (
    <Box sx={{ width: "100%" }}>
      <MuiFileInput
        value={value}
        onChange={handleFileChange}
        placeholder="Click to upload"
        fullWidth
      />

      {/* Show preview outside the input */}
      {preview && (
        <Box sx={{ mt: 2 }}>
          <img src={preview} alt="Preview" style={{ maxWidth: 80 }} />
        </Box>
      )}
    </Box>
  );
};

// Validation Schema
const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  file: Yup.mixed().required("Image is required"),
});

const AddPost = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const { location, file, description } = values;

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;


      createPost(
        {
          location,
          postImageUrl: imageUrl,
          description,
        },
      )
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);
          handleClose();
          navigate("/");
        })

        .catch((error) => {
          console.error("Error during creating post:", error);
          setSubmitting(false);
        });
    } catch (error) {
      console.error("Error during file upload:", error);
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Post
        </Typography>

        <Formik
          initialValues={{ location: "", file: null, description: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field name="location">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="location"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                )}
              </Field>
              <Field name="file">
                {({ field, form }) => <FileInput field={field} form={form} />}
              </Field>

              <Field name="description">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
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
                  Post
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddPost;
