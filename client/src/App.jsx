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
import CreateProject from './pages/CreateProject';
import ViewProject from './pages/ViewProject/ViewProject';
import AddMember from './pages/AddMember';
import StudentLeadForSupervisor from './pages/StudentLead/OneStudentLeadForSupervisor';
import LandingPage from './components/LandingPage/LandingPage';
import Blog from './components/LandingPage/Blog';
import Services from './components/LandingPage/Services';
import About from './components/LandingPage/About';
import Chat from './pages/Chat/Chat';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/create_project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
            <Route path="/add_member" element={<PrivateRoute><AddMember /></PrivateRoute>} />
            <Route path="/view_project/:user_id" element={<PrivateRoute><ViewProject /></PrivateRoute>} />
            <Route path="/onestudentleadforsupervisor/:user_id" element={<PrivateRoute><StudentLeadForSupervisor /></PrivateRoute>} />
            <Route path="/onestudentlead/:user_id">
              <Route index element={<PrivateRoute><OneStudentLead /></PrivateRoute>} />
              <Route path="view_project/:user_id" element={<PrivateRoute><ViewProject /></PrivateRoute>} />
            </Route>
            <Route path="/supervisorone/:user_id" element={<PrivateRoute><OneSupervisor /></PrivateRoute>} />
            {/* chat */}
            <Route path="/chat/:user_id" element={<PrivateRoute><Chat /></PrivateRoute>} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;