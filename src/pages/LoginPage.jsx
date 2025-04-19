import React, { useContext, useState } from "react";
import {Eye,EyeOff} from "lucide-react"


import {DisasterContext} from "../DisasterContext"

export default function LoginPage() {
  
  const {email, setEmail,password, setPassword,logInUser}=useContext(DisasterContext)

    const [showPassword,setShowPassword]=useState(false)

  
  

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(180deg, rgb(28, 43, 109), rgb(75, 83, 117))",
  };

  const formContainerStyle = {
    background: "rgba(0, 0, 0, 0.6)",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)", 
    textAlign: "center",
    width: "500px",
    color: "white",
  };

  const inputStyle = {
    border: "1px solid #ced4da",
    boxShadow: "none",
    width: "100%",
    padding: "12px",
    marginTop: "20px", // Increased margin for better spacing
    marginBottom: "20px", 
    borderRadius: "5px",
    backgroundColor: "transparent",
    color: "white",
  };

  const buttonStyle = {
    padding: "12px 25px",
    fontSize: "1rem",
    borderRadius: "25px",
    margin: "10px",
    display: "inline-block",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  const linkStyle = { color: "lightblue", textDecoration: "none" };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter valid email"
          style={inputStyle}
        />


        <div style={{position:'relative',width:'100%'}}>
        <input
          type={showPassword?'text':'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={inputStyle}
          
        />
        <button
        type="button" 
        onClick={()=>setShowPassword(!showPassword)} 
        style={{
          position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      padding: 0,
      margin: 0,
      color: "white",
      cursor: "pointer",
        }}>
          {showPassword?<EyeOff size={20}/>:<Eye size={20}/>}
        </button>
        </div>
        
        {/* <div className="d-flex justify-content-between align-items-center">
          <div className="form-check mb-2">
            <input className="form-check-input me-2" type="checkbox" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe" style={{ color: "white" }}>
              Remember me
            </label>
          </div>
          <a href="#!" style={linkStyle}>Forgot password?</a>
        </div> */}

        <button type="button" style={buttonStyle} onClick={logInUser}>
          Login
        </button>

        <p className="small fw-bold mt-3">
          Don't have an account? <a href="/register" style={linkStyle}>Register</a>
        </p>
      </div>
    </div>
  );
}