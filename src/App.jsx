import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import CreateArticle from '@/pages/CreateArticle';
import EditArticle from '@/pages/EditArticle';
import ArticleDetail from '@/pages/ArticleDetail';
import Statistics from '@/pages/Statistics';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-article"
                  element={
                    <ProtectedRoute>
                      <CreateArticle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-article/:id"
                  element={
                    <ProtectedRoute>
                      <EditArticle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <ProtectedRoute>
                      <Statistics />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;