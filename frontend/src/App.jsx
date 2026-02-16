import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Diabetes from './pages/Diabetes';
import Heart from './pages/Heart';
import Parkinsons from './pages/Parkinsons';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-900 text-gray-100 font-sans antialiased overflow-hidden selection:bg-blue-500/30">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto relative z-10 w-full">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/diabetes" element={<Diabetes />} />
                        <Route path="/heart" element={<Heart />} />
                        <Route path="/parkinsons" element={<Parkinsons />} />
                        <Route path="/history" element={<History />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
