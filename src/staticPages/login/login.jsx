import React, { useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid2, TextField, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { login } from "../../service/userApi";

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
      gap={3}
      sx={{ padding: "20px" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 1,
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
                <Typography variant="h4" paddingBottom="20px" fontWeight={300}>
                  LOGIN
                </Typography>
                {loginError && (
                  <Typography color="error" fontSize="0.9rem" sx={{mt:2,mb:2}}>
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
                >
                  Not a member? Please signup
                </Typography>

                <Button
                  variant="outlined"
                  sx={{ width: "250px", border: "#8e8e8e", color: "#8e8e8e" }}
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
