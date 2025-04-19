import React, { useContext , useState,useRef,useEffect} from "react";
import { Link } from "react-router-dom";
import { DisasterContext } from "../DisasterContext";
import { FaUserCircle, FaMicrophone } from "react-icons/fa";

let recognition = null; // Global recognition instance
export default function LandingPage() {
  const {navigate, email, logOutUser, onSubmitHandler,message,setMessage,setAudioBlob,lang,setLang,isEmergency,setIsEmergency } = useContext(DisasterContext);
  let isLoggedIn = email !== "";

  const [isListening, setIsListening] = useState(false);
  
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "linear-gradient(180deg, rgb(28, 43, 109), rgb(75, 83, 117))",
      color: "white",
      fontFamily: "'Arial', sans-serif",
      margin: 0,
      padding: "20px", // Padding for better spacing on smaller screens
    },
    overlay: {
      position: "relative",
      background: "rgba(39, 38, 38, 0.6)",
      padding: "50px",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
      width: "90%",
      maxWidth: "600px", // Limits width on larger screens
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
      marginBottom: "15px",
    },
    text: {
      fontSize: "1rem",
      marginBottom: "15px",
    },
    button: {
      padding: "8px 20px",
      fontSize: "1rem",
      borderRadius: "10px",
      textDecoration: "none",
      margin: "5px",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
      backgroundColor: "white",
      color: "black",
      border: "none",
      cursor: "pointer",
    },
    userNav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: "15px",
    },
    userIcon: {
      fontSize: "2.5rem",
      color: "white",
      cursor: "pointer",
    },
    msgInputContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.8rem",
      flexWrap: "wrap",
      width: "100%",
    },
    msgInput: {
      border: "none",
      outline: "none",
      padding: "8px",
      width: "80%",
      maxWidth: "300px",
      borderRadius: "5px",
      textAlign: "center",
    },
    btnMsg: {
      padding: "8px 15px",
      outline: "none",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    linkContainer: {
      display: "flex",
      justifyContent:"space-between",
      alignItems: "center",
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f5f7fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: '4rem auto',
    },
    heading: {
      color: '#1F2D6D',
      marginBottom: '2rem',
      fontSize: '2rem',
    },
    adminbutton: {
      margin: '0.5rem 0',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      backgroundColor: '#1F2D6D',
      color: '#fff',
      transition: 'background-color 0.3s ease',
    },
    logoutButton: {
      backgroundColor: '#495175',
    },
  };

  const role=localStorage.getItem('role')
  if (role === 'admin') {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome Admin</h2>
        <button style={styles.adminbutton} onClick={() => navigate('/adminPage')}>Admin Page</button>
        <button style={styles.adminbutton} onClick={() => navigate('/dashboard')}>Admin Dashboard</button>
        <button
          style={{ ...styles.adminbutton, ...styles.logoutButton }}
          onClick={logOutUser}
        >
          Logout
        </button>
      </div>
    );
  }

  /* const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (!recognition) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // recognition.lang = "en-US";
      // Use the device's default language; this helps in capturing speech from different languages.
    recognition.lang = navigator.language || "en-US";

      recognition.onresult = (event) => {
        let speechText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          speechText += event.results[i][0].transcript + " ";
        }
        setMessage(speechText.trim());
      };

      recognition.onerror = (event) => console.error("Speech recognition error:", event);
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false); // Ensure UI updates when stopped
      };
    }

    if (isListening) {
      recognition.stop(); // Stop if already listening
      console.log("Stopped listening");
      onSubmitHandler();
    } else {
      recognition.start(); // Start if not listening
      console.log("Listening...");
    }

    setIsListening(!isListening); // Toggle state


  
  } */

    /* const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null); // At the top, alongside mediaRecorderRef
    let audioBlob=null;
    
    const startRecording = async () => {
      console.log("Starting recording...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream; // Save the stream
        const mediaRecorder = new MediaRecorder(stream);
        console.log("Created MediaRecorder:", mediaRecorder);
    
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
    
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          console.log("onstop fired");
          audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(audioBlob);
          setIsListening(false);
           // 🔴 Stop microphone stream here
          streamRef.current.getTracks().forEach((track) => track.stop());
          console.log("Microphone stopped.");
          onSubmitHandler();
        };
    
        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone", err);
      }
    };
    
  

    useEffect(() => {
      if (audioBlob) {
        console.log("🎙️ audioBlob is ready, calling submit...");
        onSubmitHandler();
      }
    }, [audioBlob]); // 👈 This runs only when audioBlob changes and is truthy

    const stopRecording = () => {
      console.log("Trying to stop recording...");
      console.log("mediaRecorderRef.current:", mediaRecorderRef.current);
      
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        console.log("Recording stopped!");
        
      } else {
        alert("Recorder is not active or not initialized.");
      }
    };
    
  
    const toggleSpeechRecognition = () => {
      const recorder = mediaRecorderRef.current;
      
      if (recorder && recorder.state === "recording") {
        stopRecording();
      } else {
        startRecording();
      }
    };
     */
    const toggleSpeechRecognition = () => {
      if (!("webkitSpeechRecognition" in window)) {
        alert("Your browser does not support speech recognition.");
        return;
      }
    
      if (!recognition) {
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
    
        recognition.lang = lang; // Use the selected Indian language
    
        recognition.onresult = (event) => {
          let speechText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            speechText += event.results[i][0].transcript + " ";
          }
          setMessage(speechText.trim());
        };
    
        recognition.onerror = (event) => console.error("Speech recognition error:", event);
        recognition.onend = () => {
          console.log("Speech recognition ended");
          setIsListening(false);
        };
      } else {
        recognition.lang = lang; // Update lang if already initialized
      }
    
      if (isListening) {
        recognition.stop();
        console.log("Stopped listening");
        onSubmitHandler(); // Process the result
      } else {
        recognition.start();
        console.log("Listening...");
      }
    
      setIsListening(!isListening);
    };
    





  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        {isLoggedIn ? (
          <div style={styles.userNav}>
            <FaUserCircle style={styles.userIcon} title="User Profile" />
            <button onClick={logOutUser} style={styles.button}>
              Logout
            </button>
          </div>
        ) : null}

        <h1 style={styles.title}>Disaster Response Management </h1>
        <p style={styles.text}>
          Stay informed and take action during emergencies. Join us in making
          communities safer.
        </p>

        {isLoggedIn && (
          <div style={styles.msgInputContainer}>
            <input type="text" style={styles.msgInput} placeholder="Enter message" value={message} // Controlled input
            onChange={(e) => setMessage(e.target.value)} />
            {/* <FaMicrophone size={20} color="white" style={{ cursor: "pointer" }} /> */}
            <div style={{ backgroundColor: "white", padding: "8px", borderRadius: "50%" }} onClick={toggleSpeechRecognition}>
      {/* <FaMicrophone style={{ color: "black", fontSize: "24px" }} /> */}
      <FaMicrophone style={{ color: isListening ? "red" : "black", fontSize: "24px" }} />
    </div>
    <select id="languageSelect" onChange={(e) => setLang(e.target.value)} value={lang}>
  <option value="en-IN">English (India)</option>
  <option value="hi-IN">Hindi (हिन्दी)</option>
  <option value="ta-IN">Tamil (தமிழ்)</option>
  <option value="te-IN">Telugu (తెలుగు)</option>
  <option value="bn-IN">Bengali (বাংলা)</option>
  <option value="gu-IN">Gujarati (ગુજરાતી)</option>
  <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
  <option value="ml-IN">Malayalam (മലയാളം)</option>
  <option value="mr-IN">Marathi (मराठी)</option>
  <option value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</option>
  <option value="ur-IN">Urdu (اردو)</option>
</select>
<label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />
        Emergency
      </label>

            <br/>
            <button style={styles.btnMsg} onClick={onSubmitHandler}>
              Submit
            </button>

          </div>
          
        )}

        {!isLoggedIn && (
          <div style={styles.linkContainer}>
            <Link to="/login" style={styles.button}>
              Login
            </Link>
            <Link to="/register" style={styles.button}>
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
