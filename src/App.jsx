import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import MyNotes from "./components/MyNotes";
import NotesGenerator from "./pages/NotesGenerator";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/mynotes" element={<ProtectedRoute><MyNotes/></ProtectedRoute>}/>
        <Route path="/notes-generator" element={<ProtectedRoute><NotesGenerator/></ProtectedRoute>}/>



        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router> 
 
    </>
  );
}

export default App;
