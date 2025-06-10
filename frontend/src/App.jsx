import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import MyDiary from './components/MyDiary';
import useAuthStore from './store/useAuthStore';
import Calendar from './components/Calendar';
import Chatbot from './components/ChatBot';
import Chronicles from './components/Chronicles';

function App() {
  const { user, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
 return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/diary"
          element={!user ? <Navigate to="/auth" replace /> : <MyDiary />}
        />
         <Route
          path="/chronicles"
          element={<Chronicles />}
        />
        <Route
          path="/calendar"
          element={!user ? <Navigate to="/auth" replace /> : <Calendar />}
        />
        <Route
          path="/chatbot"
          element={!user ? <Navigate to="/auth" replace /> : <Chatbot />}
        />
      </Routes>

      {/* Optional floating chatbot always present */}
      <div className="fixed bottom-4 right-4 z-50">
        {user && <Chatbot />}
      </div>
    </>
  );
}

export default App;