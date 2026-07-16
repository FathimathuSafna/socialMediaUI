import React, { useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { login } from "../../service/userAPI";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";
import '@fontsource/pacifico';

// Validation schema
const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState("");
  const { darkMode } = useCustomTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      login({
        phoneNumber: values.phone,
        password: values.password,
      })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userName", response.data.userName);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error during login:", error);
          const errorMessage =
            error.response?.data?.msg || "Invalid username or password";
          setLoginError(errorMessage);
        });
    } catch (error) {
      console.error("Login error:", error);
    }
    setSubmitting(false);
  };

  const pageBg = "transparent"; // Background blobs in index.css handle the page aesthetic

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        background: pageBg,
        transition: "background 0.3s ease-in-out",
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
          initialValues={{ phone: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
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
                  Enter your credentials to access the atmosphere.
                </Typography>

                {loginError && (
                  <Box
                    sx={{
                      width: "100%",
                      p: 1.5,
                      borderRadius: "14px",
                      bgcolor: darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(254, 226, 226, 0.4)",
                      border: `1px solid ${darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      color="error"
                      sx={{ fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      {loginError}
                    </Typography>
                  </Box>
                )}

                <TextField
                  name="phone"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
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

                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
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

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
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
                  {isSubmitting ? "Logging in..." : "Log in"}
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
                    Not a member?
                  </Typography>

                  <Button
                    variant="text"
                    sx={{
                      textTransform: "none",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: darkMode ? "#60a5fa" : "#2563eb",
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      }
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
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

export default Login;
