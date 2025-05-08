import { Box, Button, Modal, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../redux/store";
import { loginUser, optReSend } from "../../../redux/slice/auth.slice";
import { useToast } from "../../../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const emailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

type Props = {
  userType: "Admin" | "Customer";
};

export default function LoginForm({ userType }: Props) {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  return (
    <Box>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          const payload = {
            email: values.email,
            password: values.password,
            role_id: userType,
          };
          dispatch(loginUser(payload)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
              showToast(response.payload);
            }
            if (response.meta.requestStatus === "rejected") {
              showToast(response.payload);
              if (
                response.payload.message === "Please verify your email first"
              ) {
                setVerifyEmail(true);
              }
            }
          });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Box display="flex" flexDirection="column" gap={2}>
              <Field
                name="email"
                as={TextField}
                label="Email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                name="password"
                as={TextField}
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <Button type="submit" variant="contained">
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Modal open={verifyEmail} onClose={() => setVerifyEmail(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            width: 500,
            margin: "auto",
            marginTop: "20%",
          }}
        >
          <h2>Email Verification</h2>
          <Formik
            initialValues={{ email: tempEmail }}
            validationSchema={emailSchema}
            onSubmit={(values) => {
              dispatch(optReSend({ email: values.email })).then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                  if (response.payload.message === 'OTP resent successfully') {
                    showToast({ success: true, message: 'OTP send please check the email!' });
                  }
                  navigation("/otp", { state: { email: values.email } });
                }
                if (response.meta.requestStatus === "rejected") {
                  showToast(response.payload);
                }
              });
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Verify Email
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
}
