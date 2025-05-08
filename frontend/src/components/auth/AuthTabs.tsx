import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import LoginForm from "./forms/login";
import RegisterForm from "./forms/register";
import { useNavigate } from "react-router-dom";

type Props = {
  type: "login" | "register";
};

export default function AuthTabs({ type }: Props) {
  const [tab, setTab] = useState<"Customer" | "Admin">("Customer");
  const isLogin = type === "login";
  const navigation = useNavigate();

  return (
    <Box width="100%" maxWidth={400} mx="auto" mt={4}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant={tab === "Customer" ? "contained" : "outlined"}
          onClick={() => setTab("Customer")}
        >
          Customer
        </Button>
        <Button
          variant={tab === "Admin" ? "contained" : "outlined"}
          onClick={() => setTab("Admin")}
          sx={{ ml: 2 }}
        >
          Admin
        </Button>
      </Box>

      <Typography variant="h6" align="center" gutterBottom>
        {isLogin ? `Login as ${tab}` : `Register as ${tab}`}
      </Typography>

      <Box>
        <Box>
          {isLogin ? (
            <LoginForm userType={tab} />
          ) : (
            <RegisterForm userType={tab} />
          )}
        </Box>
        <Typography variant="body2" align="center" color="textSecondary">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            onClick={() => {
              isLogin ? navigation("/register") : navigation("/login");
            }}
            color="primary"
          >
            {isLogin ? "Register" : "Login"}
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
