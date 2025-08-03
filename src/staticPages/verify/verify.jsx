import React, { useEffect, useState } from "react";
import { Grid2, Typography, TextField, Button, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { verify } from "../../service/userApi";

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

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ paddingTop: "30px", height: "90vh" }}
    >
      <Box
        sx={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 1,
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
                gap={2}
              >
                <Typography variant="h5" component="h2">
                  OTP VERIFICATION
                </Typography>
                <Typography align="center" variant="body2">
                  Please enter the OTP (One Time Password) sent to your
                  registered phone number to complete verification.
                </Typography>

                {/* ✅ Show server error */}
                {serverError && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ textAlign: "center" }}
                  >
                    {serverError}
                  </Typography>
                )}

                <Field
                  as={TextField}
                  name="otp"
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  error={touched.otp && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: "8px", width: "100%" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Submit OTP"}
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
