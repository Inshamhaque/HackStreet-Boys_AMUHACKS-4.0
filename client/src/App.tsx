import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Chat from "./pages/Chat";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
