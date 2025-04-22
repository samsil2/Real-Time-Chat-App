import { create } from "zustand";
import {axiosInstance} from "../lib/axios";
import React from "react";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth:async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  },


}));

export default useAuthStore;