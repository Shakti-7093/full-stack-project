import { Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { strongPassword, useToast } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../redux/slice/auth.slice";
import { useAppDispatch } from "../../../redux/store";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .test("strong", "Password is not strong enough", (value) =>
      value ? strongPassword(value) : false
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

type Props = {
  userType: "Admin" | "Customer";
};

export default function RegisterForm({ userType }: Props) {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={registerSchema}
      onSubmit={(values) => {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role_id: userType,
        };
        dispatch(registerUser(payload)).then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            showToast(response.payload);
            navigation("/otp");
          }
          if (response.meta.requestStatus === "rejected") {
            showToast(response.payload);
          }
        });
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box display="flex" flexDirection="column" gap={2}>
            <Field
              name="firstName"
              as={TextField}
              label="First Name"
              error={touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
            />
            <Field
              name="lastName"
              as={TextField}
              label="Last Name"
              error={touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
            />
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
              type="password"
              label="Password"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Field
              name="confirmPassword"
              as={TextField}
              type="password"
              label="Confirm Password"
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
