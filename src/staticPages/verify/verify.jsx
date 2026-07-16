import React, { useEffect, useState } from "react";
import { Grid2, Typography, TextField, Button, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { verify } from "../../service/userAPI";
import { useTheme as useCustomTheme } from "../../store/ThemeContext";

// Validation schema
const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP should be 6 digits")
    .required("OTP is required"),
});

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { darkMode } = useCustomTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      navigate("/verify");
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(""); // Clear previous errors

    try {
      const response = await verify({ otp: values.otp });

      localStorage.setItem("token", response.data); // Save token
      
      navigate("/login");
    } catch (error) {
      console.error("Error during OTP verification:", error);

      if (error.response?.status === 400) {
        setServerError(error.response.data.msg || "Invalid OTP");
      } else {
        setServerError("Verification failed. Please try again.");
      }
    }

    setSubmitting(false);
  };

  const pageBg = darkMode
    ? "radial-gradient(circle at 50% 0%, #0d1224 0%, #030712 100%)"
    : "radial-gradient(circle at 50% 0%, #eff6ff 0%, #f8fafc 100%)";

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
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
          initialValues={{ otp: "" }}
          validationSchema={OtpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid2
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap={3}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.6rem",
                    textAlign: "center",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Verify Your Account
                </Typography>
                <Typography
                  align="center"
                  variant="body2"
                  sx={{
                    color: darkMode ? "#94a3b8" : "#64748b",
                    lineHeight: 1.6,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Please enter the 6-digit verification code sent to your registered phone number.
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

                <Field
                  as={TextField}
                  name="otp"
                  label="Enter 6-Digit OTP"
                  variant="outlined"
                  fullWidth
                  error={touched.otp && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  InputProps={{
                    sx: {
                      borderRadius: "14px",
                      color: darkMode ? "#f8fafc" : "#0f172a",
                      backgroundColor: darkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.5)",
                      letterSpacing: "0.2em",
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                      }
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
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>
              </Grid2>
            </Form>
          )}
        </Formik>
      </Box>
    </Grid2>
  );
}

export default Verify;
