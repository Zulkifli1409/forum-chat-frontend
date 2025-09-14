// full src/src frontend/App.js

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ChatAdmin from "./pages/ChatAdmin";
import AdminPrivateChat from "./pages/AdminPrivateChat";
import AdminReports from "./pages/AdminReports";
import AdminOnline from "./pages/AdminOnline";
import AdminAnalytics from "./pages/AdminAnalytics";
import { useState } from "react";
import Sponsorship from "./pages/Sponsorship";
import AnnouncementBanner from "./components/AnnouncementBanner";

function App() {
    const [loading] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <AnnouncementBanner />
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/chat" element={<ProtectedRoute role={["user", "moderator", "admin", "super-admin"]}><Chat /></ProtectedRoute>} />
                        <Route path="/chat-admin" element={<ProtectedRoute role="user"><ChatAdmin /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute role={["moderator", "admin", "super-admin"]}><Admin /></ProtectedRoute>} />
                        <Route path="/admin-private" element={<ProtectedRoute role={["moderator", "admin", "super-admin"]}><AdminPrivateChat /></ProtectedRoute>} />
                        <Route path="/admin-reports" element={<ProtectedRoute role={["moderator", "admin", "super-admin"]}><AdminReports /></ProtectedRoute>} />
                        <Route path="/admin-online" element={<ProtectedRoute role={["moderator", "admin", "super-admin"]}><AdminOnline /></ProtectedRoute>} />
                        <Route path="/sponsorship" element={<Sponsorship />} />
                        <Route path="/admin-analytics" element={<ProtectedRoute role={["moderator", "admin", "super-admin"]}><AdminAnalytics /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/chat" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;