import { Routes, Route } from 'react-router-dom';
import HomePage from './features/home/components/HomePage';
import LoginPage from './features/login/components/login-page';
import RegisterPage from './features/register/components/register-page';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
