import React, { useEffect, useState,useContext } from "react";
import '../App.css'
import { DisasterContext } from "../DisasterContext";
const AdminPage = ()=>{

    const {navigate , logOutUser } = useContext(DisasterContext);
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const styles={
    
    btnMsg: {
      padding: "8px 15px",
      outline: "none",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    },
  }

  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Unauthorized access. Redirecting...");
      navigate("/login"); // or navigate to a 403 page
    }
    else{
      // fetch("http://localhost:5000/get_messages") // Replace with your API
      fetch("http://localhost:5000/get_messages_admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })   
    // .then((response) => response.json())
    .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
        .then((data) => setUsers(data))
        // .catch((error) => console.error("Error fetching users:", error));
        .catch((error) => {
            console.error("Error fetching users:", error);
            alert("Session expired or unauthorized. Redirecting...");
            navigate("/login");
          })
    }
  }, [token, role, navigate]);

        const handleDelete = (id) => {
            fetch(`http://localhost:5000/delete_message/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
          
                .then(() => setUsers(users.filter((user) => user.id !== id)))
                .catch((error) => console.error("Error deleting message:", error));
        };
        
    
        
    
        return (
            <div className="container">
                <div className="head-div">
                <h2>Admin Page</h2>
                
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Message</th>
                                <th className="hide-on-mobile">Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.message}</td>
                                    <td className="hide-on-mobile">{user.location}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

}

export default AdminPage