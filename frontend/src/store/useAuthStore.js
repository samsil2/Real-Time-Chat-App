import { create } from "zustand";
import {axiosInstance}from "../lib/axios.js";
import React from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth:async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      //socket connection
      get().connectSocket();

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  },


 signup: async (data) =>{
  set({ isSigningUp: true });
  try {const res = await axiosInstance.post("/auth/signup", data);
    set({ authUser: res.data });
    toast.success("Account created successfully");

    //socket connection
    get().connectSocket();
    
  } catch (error) {
    toast.error(error.response.data.message);
  } 

  finally {
    set({ isSigningUp: false });
  }
 },

 login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    set({ authUser: res.data });
    toast.success("Logged in successfully");

    //socket connection
    get().connectSocket();

   
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
    set({ isLoggingIn: false });
  }
},

 logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    toast.success("Logged out successfully");

    //disconnect socket
    get().disconnectSocket();
    
  } catch (error) {
    toast.error(error.response.data.message);
  }
},

updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
},

//socket
connectSocket: () =>{

  const { authUser } = get();
    if (!authUser || get().socket?.connected) return;


    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
  socket.connect();

  set({ socket: socket });

  socket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

},

//disconnect socket
disconnectSocket: () => {
  if (get().socket?.connected) get().socket.disconnect();
},




}));



export default useAuthStore;