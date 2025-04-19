import React, { useContext, useState, useEffect, useRef } from 'react';
import { DisasterContext } from "../DisasterContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import classNames from 'classnames';

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(localizedFormat);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different types of emergencies
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});


const icons = {
  high: createCustomIcon('red'),
  medium: createCustomIcon('orange'),
  low: createCustomIcon('blue'),
  default: createCustomIcon('grey'),
  urgent: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  })
};

// Add a new component to handle map view changes
const MapViewChanger = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};




// Create a custom divIcon for markers with count
const createCountIcon = (count, isUrgent) => {
  const size = count > 9 ? 30 : 25;
  const fontSize = count > 9 ? 12 : 14;
  
  return L.divIcon({
    html: `<div style="background-color: ${isUrgent ? '#dc3545' : '#0d6efd'};
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${fontSize}px;
      box-shadow: 0 0 0 2px white;">${count}</div>`,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Replace the formatTimestamp function with a simpler one using dayjs
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';

  try {
    // Parse timestamp as UTC and convert to IST (Asia/Kolkata)
    const date = dayjs.utc(timestamp).tz('Asia/Kolkata');

    // Check if date is valid
    if (!date.isValid()) {
      return 'Invalid date';
    }

    // Format the date nicely
    return date.format('DD MMM YYYY, hh:mm A'); // e.g., "15 Apr 2025, 01:31 PM"
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Error formatting time';
  }
};

const AdminDashboard = () => {
  const { navigate } = useContext(DisasterContext);
  
      
      const [users, setUsers] = useState([]);
  
      const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)
  const [mapZoom, setMapZoom] = useState(5);
  
  const [filter, setFilter] = useState('all');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const mapRef = useRef(null);
  const messageRefs = useRef({});
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    urgentReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    reportsByType: {},
    reportsByLocation: {},
    recentReports: []
  });
  const [mapView, setMapView] = useState({ center: mapCenter, zoom: mapZoom });
  const [locationMarkers, setLocationMarkers] = useState([]);



  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Unauthorized access. Redirecting...");
      navigate("/login"); // or navigate to a 403 page
    }
    
  }, [token, role, navigate]);

  useEffect(() => {
    fetchMessages();
    // fetchDashboardStats();
  }, [token]);

  useEffect(() => {
    analyzeReports();
  }, [messages]);

  useEffect(() => {
    // Create location markers with counts
    const locationData = {};
    
    // Group messages by location
    messages
      .filter(msg => msg.location && msg.location.coordinates)
      .forEach(msg => {
        const [lng, lat] = msg.location.coordinates;
        const locationKey = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        if (!locationData[locationKey]) {
          locationData[locationKey] = {
            position: [lat, lng],
            count: 0,
            urgentCount: 0,
            messages: []
          };
        }
        
        locationData[locationKey].count++;
        if (isUrgent(msg)) {
          locationData[locationKey].urgentCount++;
        }
        locationData[locationKey].messages.push(msg);
      });
    
    // Convert to array of markers
    const markers = Object.entries(locationData).map(([key, data]) => ({
      position: data.position,
      count: data.count,
      urgentCount: data.urgentCount,
      messages: data.messages,
      isUrgent: data.urgentCount > 0
    }));
    
    setLocationMarkers(markers);
  }, [messages]);


  const geocodeLocation = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  };
  

  //pre process msg with location
  const preprocessMessages = async (messages) => {
    const processed = [];
  
    for (const msg of messages) {
      if (msg.location && typeof msg.location === 'string') {
        const coords = await geocodeLocation(msg.location);
        if (coords) {
          msg.location = {
            coordinates: [coords.lng, coords.lat],
            loc:msg.location
          };
          processed.push(msg);
        }
      }
    }
  
    return processed;
  };
  

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.reports) {
        console.log("Fetched messages:", response.data.reports);
        // setMessages(response.data.reports);
        const preparedMessages = await preprocessMessages(response.data.reports);
        setMessages(preparedMessages);
        console.log(preparedMessages)
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
      setLoading(false);
    }
  };

  const analyzeReports = () => {
    const analysis = {
      totalReports: messages.length,
      urgentReports: 0,
      resolvedReports: 0,
      pendingReports: 0,
      reportsByType: {},
      reportsByLocation: {},
      recentReports: messages.slice(0, 5)
    };

    messages.forEach(msg => {
      if (isUrgent(msg)) {
        analysis.urgentReports++;
      }

      if (msg.status === 'resolved') {
        analysis.resolvedReports++;
      } else {
        analysis.pendingReports++;
      }

      for(const key in msg.classification){
        analysis.reportsByType[key] = (analysis.reportsByType[key] || 0) + 1;
      }
//reports by location
      
          if (msg.location) {
            const locationKey = msg.location.loc;
          
            if (!analysis.reportsByLocation[locationKey]) {
              analysis.reportsByLocation[locationKey] = {
                count: 0,
                urgentCount: 0,
                location: locationKey,
                categories: {}
              };
            }
          
            analysis.reportsByLocation[locationKey].count++;
          
            if (isUrgent(msg)) {
              analysis.reportsByLocation[locationKey].urgentCount++;
            }
          
            // Count all categories in classification
            if (msg.classification) {
              Object.keys(msg.classification).forEach((type) => {
                analysis.reportsByLocation[locationKey].categories[type] =
                  (analysis.reportsByLocation[locationKey].categories[type] || 0) + 1;
              });
            }
          }
          
    });

    setAnalytics(analysis);
    
  };

  const isUrgent = (msg) => {
    if(msg.is_emergency){
    return true
    }
    return false
  }; 

   /* const determineEmergencyType = (message) => {
    if (!message) return 'Not Related';
  

    if (message.classification && message.classification.type) {
      return message.classification.type;
    }

    
    return 'Not Related';
  };  */

  // Function to fetch weather data from OpenWeather API
  // const fetchWeatherData = async (lat, lng) => {
  //   try {
  //     const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your actual API key
  //     const response = await axios.get(
  //       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching weather data:', error);
  //     return null;
  //   }
  // };

  // Chart data for emergency types
  const typeChartData = {
    labels: Object.keys(analytics.reportsByType),
    datasets: [{
      label: 'Number of Reports',
      data: Object.values(analytics.reportsByType),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',  // Communication
        'rgba(54, 162, 235, 0.5)',  // Electricity
        'rgba(255, 206, 86, 0.5)',  // Food
        'rgba(75, 192, 192, 0.5)',  // Infrastructure
        'rgba(153, 102, 255, 0.5)', // Medical
        'rgba(201, 203, 207, 0.5)', // Not Related
        'rgba(255, 159, 64, 0.5)',  // Rescue
        'rgba(255, 99, 132, 0.5)',  // Sanitation & Hygiene
        'rgba(54, 162, 235, 0.5)',  // Shelter
        'rgba(255, 206, 86, 0.5)',  // Transportation
        'rgba(75, 192, 192, 0.5)'   // Water
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reports by Category'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/admin/update-status/${messageId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        alert('Status updated successfully!');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };
/* 
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/admin/dashboard-stats', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const stats = response.data.statistics;
        setAnalytics(prev => ({
          ...prev,
          reportsByType: stats.classification_counts || {},
          totalReports: stats.total_messages || 0,
          pendingReports: stats.status_counts?.pending || 0,
          resolvedReports: stats.status_counts?.resolved || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };*/

  const handleMessageClick = (messageId, coordinates) => {
    setSelectedMessageId(messageId);
    
    // Pan to the marker on the map
    if (coordinates) {
      const [lng, lat] = coordinates;
      setMapView({ center: [lat, lng], zoom: 12 });
    }
    
    // Scroll to the message in the list
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }; 

  const handleMarkerClick = (messageId) => {
    setSelectedMessageId(messageId);
    
    // Scroll to the message in the list
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }
  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return isUrgent(msg);
    return msg.status === filter;
  });
  

  return (
    <div className="container-fluid p-4">
      

      {/* Analytics Dashboard */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Reports</h5>
              <h2>{analytics.totalReports}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Emergency</h5>
              <h2>{analytics.urgentReports}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Informed</h5>
              <h2>{analytics.resolvedReports}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <h2>{analytics.pendingReports}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3>Emergency Types Distribution</h3>
            </div>
            <div className="card-body">
              <Bar data={typeChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Location Reports Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Reports by Location</h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Total Reports</th>
                    <th>Emergency</th>
                    <th>Emergency Categories</th>
                    <th>Percentage of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.reportsByLocation)
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([location, data]) => (
                      <tr key={location}>
                        <td>{location}</td>
                        <td>{data.count}</td>
                        <td>{data.urgentCount}</td>
                        <td>
                          {Object.entries(data.categories)
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, count]) => (
                              <span key={category} className="badge bg-info me-1 mb-1">
                                {category}: {count}
                              </span>
                            ))}
                        </td>
                        <td>{((data.count / analytics.totalReports) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Map */} 
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3>Reports</h3>
              <select 
                className="form-select mt-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reports</option>
                <option value="urgent">Emergency</option>
                <option value="pending">Pending</option>
                <option value="resolved">Informed</option>
              </select>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredMessages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  ref={el => messageRefs.current[msg.id] = el}
                  className={`message-item mb-3 p-3 border rounded ${
                    isUrgent(msg) ? 'border-danger' : ''
                  } ${selectedMessageId === msg.id ? 'bg-light' : ''}`}
                  onClick={() => msg.location?.coordinates && handleMessageClick(msg.id, msg.location.coordinates)}
                  style={{ cursor: msg.location?.coordinates ? 'pointer' : 'default' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="mb-1">{msg.message}</p>
                      <small className="text-muted">
                        {formatTimestamp(msg.timestamp)}
                      </small>
                      {msg.location && (
                        <div className="mt-1">
                          <small className="text-info">
                            Location: {msg.location.coordinates ? 
                              `${msg.location.coordinates[1].toFixed(4)}, ${msg.location.coordinates[0].toFixed(4)}` : 
                              'Not available'}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Report Locations</h3>
              <div className="mt-2">
                <small className="text-muted">
                  {messages.filter(msg => msg.location && msg.location.coordinates).length} of {messages.length} reports have location data
                </small>
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: '600px' }}>
                <MapContainer
                  ref={mapRef}
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapViewChanger center={mapView.center} zoom={mapView.zoom} />
                  {locationMarkers.map((marker, index) => (
                    <Marker 
                      key={index}
                      position={marker.position}
                      icon={createCountIcon(marker.count, marker.isUrgent)}
                      eventHandlers={{
                        click: () => {
                          // When clicking a marker, pan to it and show the first message
                          if (marker.messages.length > 0) {
                            handleMarkerClick(marker.messages[0].id);
                          }
                        }
                      }}
                    >
                      <Popup maxWidth={300}>
  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
    <h6>Reports at this location: {marker.count}</h6>
    <p>Emergency reports: {marker.urgentCount}</p>
    <hr />
    {marker.messages.map((msg, i) => (
      <div key={i} className="mb-2">
        <p className="mb-1">{msg.message}</p>
        <small className="text-muted">
          {formatTimestamp(msg.timestamp)}
        </small>
        {msg.classification && (
          <div className="mt-1">
            <small>
              <strong>Classification:</strong>
              <ul className="mb-0">
                {Object.entries(msg.classification).map(([key, value]) => (
                  <li key={key}>
                    {key}
                  </li>
                ))}
              </ul>
            </small>
          </div>
        )}
      </div>
    ))}
  </div>
</Popup>

                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;