import { createContext,useState , useEffect} from "react";

import {useNavigate} from "react-router-dom"

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export const DisasterContext = createContext();


const DisasterContextProvider = (props)=>{

      const [email, setEmail] = useState(localStorage.getItem("email")||'');
      const [token,setToken]= useState(localStorage.getItem('token') || '')
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [message, setMessage] = useState(""); // Store message input
      const navigate = useNavigate();
      const [predictions,setPredictions] = useState([]);
      const [audioBlob, setAudioBlob] = useState(null);
      const [lang, setLang] = useState("en-IN"); // defaulting to Hindi
      const [isEmergency, setIsEmergency] = useState(false);
      const isValidPassword = /^(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&(),.?":{}|<>]).+$/.test(password);

    
      const registerUser = () => {
        if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
          alert("All fields are required!");
        } else if (password !== confirmPassword) {
          alert("Passwords do not match!");
        } 
        else if(!isValidPassword ){
          alert(" Password is not valid,it must include lowercase, uppercase, and special character ");
        }
        else {
          axios.post('http://127.0.0.1:5000/register', { email, password })
            .then(response => {
              console.log(response);
              toast.success("Registered successfully,please login")
              navigate("/login");
            })
            .catch(error => {
              console.log(error, 'error');
              alert("Registration failed!");
            });
        }
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      };

      const logInUser = () => {
        if (!email) {
          alert("Email has been left blank!");
        } else if (!password) {
          alert("Password has been left blank!");
        } else {
          axios.post("http://127.0.0.1:5000/login", { email, password })
            .then(response => {
              /* console.log(response);
    
              // Store email & token only on successful login
              localStorage.setItem("email", email);
              localStorage.setItem("token", response.data.token); */
              const tokenFromServer = response.data.token; // ✅ Get token from response
        const emailFromServer = response.data.email;
        const roleFromServer = response.data.role;

        // ✅ Store token and email in localStorage
        localStorage.setItem("token", tokenFromServer);
        localStorage.setItem("email", emailFromServer);
        localStorage.setItem("role", roleFromServer);

        setEmail(emailFromServer); // Also update local state if needed
        setToken(tokenFromServer)

         // ✅ Navigate based on role
         toast.success("Login successful")
         
          navigate("/");
        
    
            })
            .catch(error => {
              console.log(error, "error");
              if (error.response && error.response.status === 401) {
                alert("Invalid credentials");
              }
            });
        }
        setEmail("")
        setPassword("")
      };
    
      useEffect(() => {
        // Check if user is already logged in (Persist login session)
        const storedEmail = localStorage.getItem("email");
        const storedToken=localStorage.getItem("token")
        const storedRole = localStorage.getItem("role");
        if (storedEmail) {
          setEmail(storedEmail);
          setToken(storedToken);
        }
      }, []);


      const logOutUser = () => {
        // Clear user state
        setEmail("");
        setToken("")
        // Remove email & token from localStorage
        localStorage.removeItem("email");
        localStorage.removeItem("token");
      
        // Redirect to login page
        
        navigate("/login");
      };
      

        const onSubmitHandler = () =>{
          if(audioBlob===null && message===""){
            alert('please enter message or record audio')
          }
          console.log("submitted")
          if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
          }
      
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // setLocation({ latitude, longitude });
              const formData = new FormData();
formData.append("email", email);
formData.append("latitude", latitude);
formData.append("longitude", longitude);
formData.append("message", message);
formData.append("audio", audioBlob);  // This is your Blob object
formData.append("emergency",isEmergency);
              // Send data to Flask backend
              fetch("http://127.0.0.1:5000/submitLocation", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,  // ❗ Do NOT set Content-Type here — browser will do it
                },
                body: formData,
              })
                // .then((response) => {console.log(response);response.json()})
                .then((response) => {
                  console.log(response);
                  return response.json(); // ✅ return the JSON promise
                })
                // .then((data) => alert(`Location sent: ${data.message}`))
                .then((data) => {
                  console.log("📦 Data from backend:", data); // 🔍 log full data
                  alert(`Location sent: ${data.message}`);
                  // If you want to use predicted_categories:
                  if(data.hasOwnProperty('error')){
                    alert(data.error)
                    return;
                  }
                  setPredictions(data.predicted_categories)
                  console.log("Predicted Categories:", data.predicted_categories);
                  navigate('/redirect')
                  // You can also store it in state or display it in the UI
                })
                // .catch((error) => alert("Error sending location"));
                .catch((error) => {
                  console.error("❌ Error:", error);
                  alert("Error sending location");
                });
            },
            (error) => {
              alert("Unable to retrieve location: " + error.message);
            }
          );
          setMessage("")
          setIsEmergency(false)
        }

        const value = {
          lang,setLang,isEmergency,setIsEmergency,
          onSubmitHandler,message,setMessage,token,setToken,predictions,setPredictions,audioBlob,setAudioBlob,
          logInUser,registerUser,password,setPassword,confirmPassword,setConfirmPassword,email,setEmail,logOutUser,navigate
        }

        return (
          <DisasterContext.Provider value={value}>
              {props.children}
          </DisasterContext.Provider>
      )
    

}

export default DisasterContextProvider;