import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./signup.css";
import { signup } from "../../service/userAPI";
import "@fontsource/pacifico";

// Validation schema
const SignupSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
  bio: Yup.string(),
  dob: Yup.date().required("Date of birth is required"),
});

function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      navigate("/signup");
    }
  }, []);

  const handleSignup = async (values, { setSubmitting }) => {
    const { userName, name, phoneNumber, email, password, bio, dob } = values;

    setServerError("");

    signup({
      userName,
      name,
      phoneNumber,
      email,
      password,
      bio,
      dob,
    })
      .then((response) => {
        console.log("response ", response);
        if (response.status === true) {
          alert("Signup successful! Please check your email for confirmation.");
          localStorage.setItem("userName", response.userName);
          navigate("/verify", { state: { phoneNumber } });
        } else {
          setServerError(
            response.message || "Signup failed. Please try again."
          );
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Signup error:", error);
        if (error.response && error.response.status === 409) {
          setServerError(error.response.data.message); // Backend message
        } else {
          setServerError("Signup failed. Please try again.");
        }
        setSubmitting(false);
      });
  };

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      gap={3}
      sx={{ padding: "20px", }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "300px",
          height: "90vh",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 1,
        }}
      >
        <Formik
          initialValues={{
            userName: "",
            name: "",
            phoneNumber: "",
            email: "",
            password: "",
            bio: "",
            dob: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid2
                container
                justifyContent={"center"}
                alignItems={"center"}
                direction="column"
                gap={1}
              >
                <Typography
                  sx={{
                    fontSize: 24,
                    fontFamily: "'Pacifico', cursive",
                    paddingTop: 3,
                    paddingBottom: 3,
                    color: "#000",
                  }}
                >
                  Appmosphere
                </Typography>

                <Typography
                  fontStyle="oblique"
                  sx={{
                    pr: 0,
                    fontSize: 12,
                    lineHeight: 1.2,
                    color: "#8e8e8e",
                    pb: 3,
                  }}
                >
                  Signup and explore to see more photos and videos
                </Typography>

                {serverError && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {serverError}
                  </Typography>
                )}

                {[
                  { name: "userName", label: "Username" },
                  { name: "name", label: "Name" },
                  { name: "phoneNumber", label: "Phone No" },
                  { name: "email", label: "Email" },
                  { name: "password", label: "Password", type: "password" },
                  { name: "bio", label: "Bio" },
                  { name: "dob", type: "date" },
                ].map(({ name, label, type = "text" }) => (
                  <Field
                    key={name}
                    name={name}
                    as={TextField}
                    label={label}
                    type={type}
                    variant="outlined"
                    size="small"
                    className="textBox"
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                    fullWidth
                  />
                ))}

                <Grid2 sx={{ paddingTop: "25px", width: "50%" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      borderRadius: "8px",
                      width: "100%",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Signup"}
                  </Button>
                 </Grid2>
                  <Divider
                    sx={{
                      mb: { xs: 2, sm: 3 },
                      width: "100%",
                      p: 0,
                      mt: { xs: 4 },
                      backgroundColor: "#8e8e8e",
                    }}
                  />

                  <Grid2
                    container
                    direction="row"
                    sx={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        paddingTop: "20px",
                        color: "#8e8e8e",
                      }}
                    >
                      Already have an account?
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        pt: 2.2,
                        width: "auto",
                        border: "#8e8e8e",
                        fontSize: 14,
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  </Grid2>
                </Grid2>
            </Form>
          )}
        </Formik>
      </Box>
    </Grid2>
  );
}

export default Signup;
