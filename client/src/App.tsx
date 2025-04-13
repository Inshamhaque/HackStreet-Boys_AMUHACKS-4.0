import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import ChatProvider from "./pages/UserChatprovider";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatProvider />} />
        <Route path="/dashboard" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
