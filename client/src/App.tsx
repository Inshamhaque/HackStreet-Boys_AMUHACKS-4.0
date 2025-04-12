import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
