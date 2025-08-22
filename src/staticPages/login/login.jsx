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
import { login } from "../../service/userApi";
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
      sx={{  height: "100vh" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "300px",
          height: { md: 500 },
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 1,
          backgroundColor: "white",
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
                <Typography
                  sx={{
                    fontSize: 24,
                    fontFamily: "'Pacifico', cursive",
                    paddingTop: 4,
                    paddingBottom: 4,
                    color: "#000", 
                  }}
                >
                  Appmo
                </Typography>

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

                <Grid2 sx={{ paddingTop: "30px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "8px",
                      width: "250px",
                    }}
                    disabled={isSubmitting}
                  >
                    Log in
                  </Button>
                </Grid2>
                <Divider
                  sx={{
                    width: "100%",
                    p: 0,
                    mt: { xs: 4, md: 5 },
                    backgroundColor: "#8e8e8e",
                  }}
                />

                <Grid2
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Typography
                    fontStyle="oblique"
                    sx={{
                      pr: 0,
                      fontSize: 12,
                      lineHeight: 1.2,
                      color: "#8e8e8e",
                    }}
                  >
                    Not a member? Please signup
                  </Typography>

                  <Button
                    variant="outlined"
                    sx={{
                      pt: 1,
                      width: "auto",
                      border: "#8e8e8e",
                      fontSize: 10,
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
