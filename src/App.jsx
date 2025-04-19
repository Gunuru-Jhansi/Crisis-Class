//C:\react-js\myreactdev\src\App.js
import React, { } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
  
import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import './fixLeafletIcon';
import Redirect from './pages/Redirect';

function App() {
  return (
    <div className="vh-100 gradient-custom">
    <div className="container">
      {/* <h1 className="page-header text-center">React and Python Flask Login Register</h1> */}
      <ToastContainer />
     
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/adminPage' element={<AdminPage/>} />
            <Route path='/dashboard' element={<AdminDashboard/>} />
            <Route path='/redirect' element={<Redirect/>} />

        </Routes>
      
    </div>
    </div>
  );
}
   
export default App;