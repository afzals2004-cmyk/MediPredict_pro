import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Lazy load route components for better performance
const Home = lazy(() => import('./pages/Home'));
const Diabetes = lazy(() => import('./pages/Diabetes'));
const Heart = lazy(() => import('./pages/Heart'));
const Parkinsons = lazy(() => import('./pages/Parkinsons'));
const History = lazy(() => import('./pages/History'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Loading component for Suspense fallback
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="spinner mb-4 mx-auto"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
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
                      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                        <Suspense fallback={<LoadingScreen />}>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/diabetes" element={<Diabetes />} />
                            <Route path="/heart" element={<Heart />} />
                            <Route path="/parkinsons" element={<Parkinsons />} />
                            <Route path="/history" element={<History />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Suspense>
                      </div>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
