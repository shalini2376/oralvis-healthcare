import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import DentistDashboard from "./pages/DentistDashboard";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/technician" 
          element={
            <ProtectedRoute role="Technician"> 
                <TechnicianDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dentist"
          element={
            <ProtectedRoute role="Dentist">
              <DentistDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
