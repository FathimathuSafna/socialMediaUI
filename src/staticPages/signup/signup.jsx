import { useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../store/supabaseClient";
import Grid2 from "@mui/material/Grid2";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./signup.css";
import Axios from "axios";
import { signup } from "../../service/userApi";

// Validation schema
const SignupSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
  bio: Yup.string(),
  dob: Yup.date().required("Date of birth is required"),
});

function Signup() {
  const navigate = useNavigate();

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

    console.log(values);
    signup({
      userName: userName,
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      bio: bio,
      dob: dob,
    })
      .then((response) => {
        console.log(response);
        if (response.status == true) {
          alert("Signup successful! Please check your email for confirmation.");
          navigate("/verify", { state: { phoneNumber } });
        } else {
          alert("Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("There was an error signing up!", error);
      });
    setSubmitting(false);
  };
  // if (error) {
  //   alert(error.message);
  // } else {
  //   alert("Signup successful! Please check your email for confirmation.");
  //   navigate("/login");
  // }

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
            phoneNumberNumber: "",
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
                  variant="h4"
                  component="h1"
                  paddingBottom={"20px"}
                  fontWeight={600}
                  color={"#000000"}
                >
                  SIGNUP
                </Typography>
                <Typography
                  variant="h7"
                  fontStyle={"oblique"}
                  paddingBottom={"20px"}
                >
                  Signup and Explore to see more photos and videos
                </Typography>

                {[
                  { name: "userName", label: "Username" },
                  { name: "name", label: "Name" },
                  { name: "phoneNumber", label: "Phone No" },
                  { name: "email", label: "Email" },
                  { name: "password", label: "Password", type: "password" },
                  { name: "bio", label: "Bio" },
                  { name: "dob", label: "Date of Birth", type: "date" },
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

                <Grid2 sx={{ paddingTop: "20px" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ borderRadius: "8px", width: "100%" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Signup"}
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
