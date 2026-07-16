import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./signup.css";
import { signup } from "../../service/userAPI";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
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
  const { darkMode } = useCustomTheme();

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

  const pageBg = "transparent";

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        background: pageBg,
        transition: "background 0.3s ease-in-out",
        py: 4,
        px: 2,
      }}
    >
      <Box
        className="glass-panel"
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: { xs: 4, md: 5 },
          borderRadius: "28px",
          backdropFilter: "blur(28px)",
          backgroundColor: darkMode ? "rgba(9, 13, 22, 0.55)" : "rgba(255, 255, 255, 0.75)",
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)"}`,
          boxShadow: darkMode
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "0 20px 40px -15px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
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
                justifyContent="center"
                alignItems="center"
                direction="column"
                gap={2.5}
              >
                <Typography
                  className="shimmer-text"
                  sx={{
                    fontSize: 38,
                    fontFamily: "'Pacifico', cursive",
                    textAlign: "center",
                    mb: 0.5,
                    background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 50%, #6366f1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Appmosphere
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? "#94a3b8" : "#64748b",
                    textAlign: "center",
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.2px",
                  }}
                >
                  Sign up to share photos and chat with friends.
                </Typography>

                {serverError && (
                  <Box
                    sx={{
                      width: "100%",
                      p: 1.5,
                      borderRadius: "14px",
                      bgcolor: darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(254, 226, 226, 0.4)",
                      border: `1px solid ${darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      color="error"
                      sx={{ fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      {serverError}
                    </Typography>
                  </Box>
                )}

                {[
                  { name: "userName", label: "Username" },
                  { name: "name", label: "Full Name" },
                  { name: "phoneNumber", label: "Phone Number" },
                  { name: "email", label: "Email Address" },
                  { name: "password", label: "Password", type: "password" },
                  { name: "bio", label: "Short Bio" },
                  { name: "dob", label: "Date of Birth", type: "date" },
                ].map(({ name, label, type = "text" }) => (
                  <Field
                    key={name}
                    name={name}
                    as={TextField}
                    label={type === "date" ? "" : label}
                    type={type}
                    placeholder={type === "date" ? "Date of Birth" : ""}
                    variant="outlined"
                    size="small"
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                    fullWidth
                    InputLabelProps={type === "date" ? { shrink: true } : undefined}
                    InputProps={{
                      sx: {
                        borderRadius: "14px",
                        color: darkMode ? "#f8fafc" : "#0f172a",
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
                          boxShadow: `0 0 0 4px ${darkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.08)"}`,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: darkMode ? "#94a3b8" : "#64748b",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#6366f1",
                        }
                      }
                    }}
                  />
                ))}

                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                    boxShadow: darkMode
                      ? "0 8px 24px -4px rgba(99, 102, 241, 0.4)"
                      : "0 8px 24px -4px rgba(99, 102, 241, 0.25)",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    py: 1.6,
                    mt: 1.5,
                    color: "#ffffff",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)",
                      transform: "translateY(-1.5px)",
                      boxShadow: darkMode
                        ? "0 12px 28px -4px rgba(99, 102, 241, 0.5)"
                        : "0 12px 28px -4px rgba(99, 102, 241, 0.35)",
                    }
                  }}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </Button>

                <Divider
                  sx={{
                    width: "100%",
                    my: 1.5,
                    borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  }}
                />

                <Grid2
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: darkMode ? "#94a3b8" : "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    Already have an account?
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      textTransform: "none",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: darkMode ? "#38bdf8" : "#6366f1",
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      }
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
