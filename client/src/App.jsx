

// https://project-pms-kyu.vercel.app/
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Profile from './pages/Profile';
import OneStudentLead from './pages/OneStudentLead';
import OneSupervisor from './pages/OneSupervisor';
// import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/onestudentlead: user_id" element={<PrivateRoute><OneStudentLead /></PrivateRoute>} />
            <Route path="/supervisorone: user_id" element={<PrivateRoute><OneSupervisor /></PrivateRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
