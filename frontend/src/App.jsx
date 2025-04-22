import React, { useEffect} from 'react'
import Navbar from './components/navbar.jsx'
import {Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import useAuthStore  from "./store/useAuthStore";


const App = () => {
  const {checkAuth, authUser,} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // if (isCheckingAuth && !authUser)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader className="size-10 animate-spin" />
  //     </div>
  //   );

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        
      </Routes>


    </div>
  )
}

export default App
