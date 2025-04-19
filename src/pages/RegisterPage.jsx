import React, { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { DisasterContext } from "../DisasterContext";

export default function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    registerUser,
  } = useContext(DisasterContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // NEW STATE

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
    height: "470px",
  };

  const inputStyle = {
    border: "1px solid #ced4da",
    boxShadow: "none",
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
    backgroundColor: "transparent",
    color: "white",
    paddingRight: "40px", // Extra space for the icon
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
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Register</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter valid email"
          style={inputStyle}
        />

        {/* Password Field */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            }}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="button" style={buttonStyle} onClick={registerUser}>
          Register
        </button>

        <p className="small fw-bold mt-3">
          Already have an account?{" "}
          <a href="/login" style={linkStyle}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
