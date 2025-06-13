import { useEffect, React } from "react";
import { Grid2, Typography, TextField, Button, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { verify } from "../../service/userApi";

// Validation schema
const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP should be 6 digits")
    .required("OTP is required"),
});

function Verify() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      navigate("/verify");
    }
  }, []);

  const location = useLocation();
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Verifying OTP:", values.otp);
    // Example Axios call (uncomment and modify as needed)
    try {
      verify({
        otp: values.otp
      })
        .then((response) => {
          console.log("respons",response.data);
          localStorage.setItem("token", response.data);
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error during OTP verification:", error);
        });
    } catch (error) {
      console.error(error);
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
