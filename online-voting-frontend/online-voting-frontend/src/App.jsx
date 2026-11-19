import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import VoterDashboard from './pages/VoterDashboard.jsx'
import CandidateList from './pages/CandidateList.jsx'
import VotePage from './pages/VotePage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidates" element={<CandidateList />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="/voter" element={
          <ProtectedRoute allowedRole="VOTER"><VoterDashboard /></ProtectedRoute>
        } />

        <Route path="/vote" element={
          <ProtectedRoute allowedRole="VOTER"><VotePage /></ProtectedRoute>
        } />

        <Route path="/results" element={
          <ProtectedRoute><ResultPage /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
