import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useToast } from "../../utils";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../redux/store";
import { optReSend, OtpVerify } from "../../redux/slice/auth.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export default function OtpVerification() {
  const navigation = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const reduxEmail = useSelector((state: RootState) => state.auth.user[0]?.email);
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const email = location.state?.email || reduxEmail;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResendOtp = () => {
    dispatch(optReSend({ email })).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        showToast(response.payload);
      }
      if (response.meta.requestStatus === "rejected") {
        showToast(response.payload);
      }
    });
    setTimer(120);
    setCanResend(false);
  };

  return (
    <Box width="100%" maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" align="center" gutterBottom>
        OTP Verification
      </Typography>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={(values) => {
          const payload = {
            otp: values.otp,
            email,
          };

          dispatch(OtpVerify(payload)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
              navigation("/");
              showToast(response.payload);
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
              name="otp"
              as={TextField}
              label="Enter 6-digit OTP"
              fullWidth
              margin="normal"
              error={touched.otp && Boolean(errors.otp)}
              helperText={touched.otp && errors.otp}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Verify OTP
            </Button>
          </Form>
        )}
      </Formik>

      <Box mt={2} textAlign="center">
        {!canResend ? (
          <Typography variant="body2" color="text.secondary">
            Resend OTP in {formatTime(timer)}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleResendOtp}
          >
            Resend OTP
          </Typography>
        )}
      </Box>
    </Box>
  );
}
