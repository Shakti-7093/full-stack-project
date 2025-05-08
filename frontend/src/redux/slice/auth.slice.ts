import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosService } from "../../utils";

interface AuthState {
  loading: boolean;
  user: any;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosService.post("/auth/login", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosService.post("/auth/register", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const OtpVerify = createAsyncThunk(
  "auth/otpVerification",
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axiosService.post("/auth/verify-otp", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const optReSend = createAsyncThunk(
  "auth/otpReSend",
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const res = await axiosService.post("/auth/resend-otp", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = [action.payload.data.user];
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Register failed";
      })
      .addCase(OtpVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OtpVerify.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(OtpVerify.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })
      .addCase(optReSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optReSend.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(optReSend.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Resend OTP failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
