import './App.css'
// component imports
import React from 'react'
import Login from './components/Login.jsx'
import Tasks from './components/Tasks.jsx'
import Navbar from './components/Navbar.jsx'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './backend/authcontext.jsx'

function App() {

  return (
    <>
  <AuthProvider>
    <Router>
     <div className='h-[100vh] w-screen bg-gray-light flex overflow-x-hidden'>
       <div><Navbar/></div>
       <Routes>
          <Route path='/' element={<ProtectedRoute><Tasks/></ProtectedRoute>} />
          <Route path='/login' element={<Login/>} />
      </Routes>
     </div>
    </Router>
  </AuthProvider>
    </>
  )
}

export default App
