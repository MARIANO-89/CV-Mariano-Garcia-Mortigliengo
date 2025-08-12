import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ColorAnalyzerPage from './pages/ColorAnalyzerPage';
import BackgroundDesignerPage from './pages/BackgroundDesignerPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Styles
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/tools/color-analyzer" element={<ColorAnalyzerPage />} />
              <Route path="/tools/background-designer" element={<BackgroundDesignerPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;