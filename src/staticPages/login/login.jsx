import React, { useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { login } from "../../service/userApi";
import "@fontsource/playfair-display";

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
   const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogin = async (values, { setSubmitting }) => {
    console.log("Logging in with values:", values);
    try {
      login({
        phoneNumber: values.phone,
        password: values.password,
      })
        .then((response) => {
          console.log(response.data);
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

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "20px", paddingTop: 14, borderRadius: "19px" }}
    >
      {!isXs ? (
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          height: { md: 316 },
          padding: "20px",
          boxShadow: 1,
          backgroundColor: "#d8d8d8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ alignSelf: "center" }}>
          <Typography
            sx={{
              fontStyle: "italic",
              alignSelf: "center",
              fontSize: 24,
              mb: 2,
            }}
          >
            <span style={{ color: "blue" }}>APP</span>mosphere!
          </Typography>
        </Box>
        <Typography
          sx={{
            fontStyle: "italic",
            textAlign: "center",
            fontSize: 14,
            color: "#454444",
          }}
        >
          <span style={{ color: "blue", marginRight: 3 }}>Log in</span>to
          continue sharing your moments and stay connected with your world.
        </Typography>
      </Box>
      ) : null}
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: 1,
          gap: 3,
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
                gap={1}
              >
                <Box sx={{ alignSelf: "flex-start", width: "100%" }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 300,
                      pb: 2,
                    }}
                  >
                    Welcome Back
                  </Typography>
                </Box>
                <Box sx={{ alignSelf: "flex-start" }}>
                  <Typography
                    fontStyle={"italic"}
                    sx={{ mb: 2, fontSize: "0.85rem" }}
                  >
                    Please enter your details to login.
                  </Typography>
                </Box>

                {loginError && (
                  <Typography
                    color="error"
                    fontSize="0.9rem"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    {loginError}
                  </Typography>
                )}

                <TextField
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />

                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <Grid2 sx={{ paddingTop: "20px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "8px",
                      width: "250px",
                      backgroundColor: "#8e8e8e",
                    }}
                    disabled={isSubmitting}
                  >
                    Log in
                  </Button>
                </Grid2>

                <Typography
                  variant="body2"
                  fontStyle="oblique"
                  paddingBottom="20px"
                  sx={{ pb: 0 }}
                >
                  Not a member? Please signup
                </Typography>

                <Button
                  variant="outlined"
                  sx={{
                    pt: 0,
                    width: "250px",
                    border: "#8e8e8e",
                    color: "#8e8e8e",
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </Grid2>
            </Form>
          )}
        </Formik>
      </Box>
    </Grid2>
  );
}

export default Login;
