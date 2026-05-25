import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, Star, MapPin, Phone, Clock, Layers } from 'lucide-react';
import { businesses, categories } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useLocation } from 'react-router-dom';
import './MapPage.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

function RouteFitter({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map]);
  return null;
}

// Custom Icon for User Location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Icon for Destination
const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapPage() {
  const { language } = useLanguage();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  // Parse category and search parameters from URL on mount/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);
  
  // New State for Live Location, Global Search, and Routing
  const [userLocation, setUserLocation] = useState(null);
  const [externalResults, setExternalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [routeCoords, setRouteCoords] = useState(null);

  const [locationError, setLocationError] = useState('');

  const amravatiCenter = [20.9320, 77.7523];

  const requestLocation = () => {
    setLocationError('');
    const handleLocationFallback = () => {
      // Mock location for local HTTP testing
      const mockLocation = [20.9320, 77.7523];
      setUserLocation(mockLocation);
      setFlyTo(mockLocation);
      setLocationError(
        language === 'mr' 
          ? 'असुरक्षित नेटवर्कमुळे लोकेशन सिमुलेट केले आहे (Mocked).' 
          : language === 'hi' 
          ? 'असुरक्षित नेटवर्क के कारण स्थान सिम्युलेट किया गया है।' 
          : 'GPS blocked on local Wi-Fi. Using mock location.'
      );
    };

    if (navigator.geolocation && (window.isSecureContext || window.location.hostname === 'localhost')) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setFlyTo([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error('Location access denied or failed.', err);
          handleLocationFallback();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
      
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Watch error', err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      // Fallback for insecure network testing (e.g. 10.79.x.x)
      handleLocationFallback();
    }
  };

  // Auto-request location on mount
  useEffect(() => {
    const cleanup = requestLocation();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  // Fetch from Nominatim for global search - single clean query with Amravati viewbox
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const q = searchQuery.trim();
          // Amravati bounding box: 77.65,20.85 to 77.90,21.05
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' Amravati')}&format=json&limit=10&countrycodes=in&addressdetails=1`;
          const res = await fetch(url, { headers: { 'Accept-Language': 'en,mr,hi' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          if (data && data.length > 0) {
            const mapped = data.map(item => ({
              id: `ext-${item.place_id}`,
              name: item.display_name.split(',')[0],
              nameMarathi: item.display_name.split(',')[0],
              nameHindi: item.display_name.split(',')[0],
              address: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              category: 'external',
              rating: '-',
              isOpen: true,
              image: '📍',
              tags: []
            }));
            setExternalResults(mapped);
          } else {
            setExternalResults([]);
          }
        } catch (e) {
          console.error('Search failed:', e);
          setExternalResults([]);
        }
        setIsSearching(false);
      } else {
        setExternalResults([]);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let list = businesses;
    if (activeCategory !== 'all') {
      if (activeCategory === 'education') {
        list = list.filter(b => b.category === 'school' || b.category === 'college');
      } else {
        list = list.filter(b => b.category === activeCategory);
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.nameMarathi.includes(searchQuery) ||
        (b.nameHindi && b.nameHindi.includes(searchQuery)) ||
        b.category.includes(q)
      );
    }
    // Combine with external global search results
    return [...list, ...externalResults];
  }, [activeCategory, searchQuery, externalResults]);

  const handleBizClick = (biz) => {
    setSelectedBiz(biz);
    if (biz.lat && biz.lng && !isNaN(biz.lat) && !isNaN(biz.lng)) {
      setFlyTo([biz.lat, biz.lng]);
    }
    setRouteCoords(null);
  };

  const calculateRoute = async (biz) => {
    if (!userLocation) {
      alert(
        language === 'mr' 
          ? "मार्ग शोधण्यासाठी कृपया तुमचे लोकेशन चालू करा." 
          : language === 'hi' 
          ? "मार्ग देखने के लिए कृपया अपना स्थान चालू करें।" 
          : "Please enable location to find a route."
      );
      return;
    }

    let destLat = biz.lat;
    let destLng = biz.lng;

    // 1. Geocoding Fallback: If destination has no lat/lng (e.g. mock businesses)
    if (!destLat || !destLng || isNaN(destLat) || isNaN(destLng)) {
      try {
        const query = `${biz.name}, ${biz.address}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data[0]) {
          destLat = parseFloat(data[0].lat);
          destLng = parseFloat(data[0].lon);
          // Cache it on the object
          biz.lat = destLat;
          biz.lng = destLng;
        } else {
          // Fallback to name + Amravati
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(biz.name + ' Amravati')}&format=json&limit=1`;
          const fallbackRes = await fetch(fallbackUrl);
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData[0]) {
            destLat = parseFloat(fallbackData[0].lat);
            destLng = parseFloat(fallbackData[0].lon);
            biz.lat = destLat;
            biz.lng = destLng;
          }
        }
      } catch (err) {
        console.error("Geocoding failed for routing:", err);
      }
    }

    if (!destLat || !destLng || isNaN(destLat) || isNaN(destLng)) {
      alert(
        language === 'mr' 
          ? "या ठिकाणाचे स्थान शोधता आले नाही." 
          : language === 'hi' 
          ? "इस स्थान का स्थान नहीं मिला।" 
          : "Could not find coordinates for this destination."
      );
      return;
    }

    // 2. Fetch routing using OpenStreetMap Germany router (faster & more reliable)
    // with a fallback to the main OSRM demo router.
    const routers = [
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${userLocation[1]},${userLocation[0]};${destLng},${destLat}?overview=full&geometries=geojson`,
      `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${destLng},${destLat}?overview=full&geometries=geojson`
    ];

    let routeFetched = false;
    for (const url of routers) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoords(coords);
          setSelectedBiz({ ...biz, lat: destLat, lng: destLng });
          routeFetched = true;
          break;
        }
      } catch (e) {
        console.warn(`Routing failed on ${url}:`, e);
      }
    }

    // 3. Straight Line Fallback (if both routers fail or return no route)
    if (!routeFetched) {
      console.log("OSRM/OSM routing failed. Drawing straight line fallback.");
      const straightLine = [[userLocation[0], userLocation[1]], [destLat, destLng]];
      setRouteCoords(straightLine);
      setSelectedBiz({ ...biz, lat: destLat, lng: destLng });
      alert(
        language === 'mr'
          ? "नकाशावर थेट दिशा दाखवली आहे (रस्ता मार्ग उपलब्ध नाही)."
          : language === 'hi'
          ? "नक्शे पर सीधी दिशा दिखाई गई है (सड़क मार्ग उपलब्ध नहीं है)।"
          : "Showing direct line on map (road routing temporarily unavailable)."
      );
    }
  };

  const openDirections = (biz) => {
    // If biz has coordinates, use them; otherwise search by name/address in Google Maps
    const dest = (biz.lat && biz.lng)
      ? `${biz.lat},${biz.lng}`
      : `${biz.name}, ${biz.address}`;
    
    // Omit origin to let Google Maps automatically use the user's real live device GPS location
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    window.open(url, '_blank');
  };


  // Automatically select and route to the nearest item if redirecting from Chat with category/search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasCategory = params.get('category');
    const hasSearch = params.get('search');

    if ((hasCategory || hasSearch) && userLocation && filtered.length > 0 && !selectedBiz && !routeCoords) {
      let nearestBiz = null;
      let minDistance = Infinity;

      const candidates = filtered.filter(b => b.lat && b.lng && !isNaN(b.lat) && !isNaN(b.lng));

      if (candidates.length > 0) {
        candidates.forEach(biz => {
          const dist = Math.pow(biz.lat - userLocation[0], 2) + Math.pow(biz.lng - userLocation[1], 2);
          if (dist < minDistance) {
            minDistance = dist;
            nearestBiz = biz;
          }
        });
      } else if (filtered.length > 0) {
        nearestBiz = filtered[0];
      }

      if (nearestBiz) {
        console.log("Auto-selecting nearest business for routing:", nearestBiz);
        handleBizClick(nearestBiz);
        setTimeout(() => {
          calculateRoute(nearestBiz);
        }, 800);
      }
    }
  }, [location.search, userLocation, filtered, selectedBiz, routeCoords]);

  return (
    <div className="page-container map-page">
      <div className="map-layout">
        {/* Sidebar Panel */}
        <div className="map-panel">
          <div className="map-panel-header">
            <h2>
              {language === 'mr' ? 'अमरावती नकाशा' : language === 'hi' ? 'अमरावती नक्शा' : 'Explore Amravati'}
            </h2>
          </div>

          <div className="map-search" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search size={18} className="search-icon" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                placeholder={
                  language === 'mr' 
                    ? "ठिकाणे शोधा..." 
                    : language === 'hi' 
                    ? "स्थान खोजें..." 
                    : "Search places..."
                }
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="map-search"
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
            <button 
              onClick={requestLocation} 
              className="btn btn-primary btn-sm"
              title={
                language === 'mr' 
                  ? 'माझे लोकेशन शोधा' 
                  : language === 'hi' 
                  ? 'मेरा स्थान खोजें' 
                  : 'Find My Location'
              }
              style={{ padding: '8px 12px', flexShrink: 0 }}
            >
              <Navigation size={18} />
            </button>
          </div>
          {locationError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{locationError}</p>}
          {isSearching && <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '4px' }}>{language === 'mr' ? 'शोधत आहे...' : language === 'hi' ? 'खोज रहा है...' : 'Searching web...'}</p>}

          <div className="map-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`map-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>
                  {language === 'mr' 
                    ? cat.labelMarathi || cat.label 
                    : language === 'hi' 
                    ? cat.labelHindi || cat.label 
                    : cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="map-results">
            <p className="map-results-count">
              {filtered.length} {language === 'mr' ? 'ठिकाणे सापडली' : language === 'hi' ? 'स्थान मिले' : 'places found'}
            </p>
            {filtered.map((biz, idx) => {
              const isSelected = selectedBiz?.id === biz.id;
              return (
                <div
                  key={`${biz.category}-${biz.id}-${idx}`}
                  className={`map-result-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleBizClick(biz)}
                >
                  <div className="map-result-main">
                    <div className="map-result-icon">{biz.image}</div>
                    <div className="map-result-info">
                      <h4>
                        {language === 'mr' ? biz.nameMarathi : language === 'hi' ? (biz.nameHindi || biz.name) : biz.name}
                      </h4>
                      <div className="map-result-meta">
                        {biz.rating !== '-' && <span><Star size={11} fill="currentColor" /> {biz.rating}</span>}
                        <span className={`status-dot ${biz.isOpen ? 'open' : 'closed'}`}>
                          {biz.isOpen 
                            ? (language === 'mr' ? 'उघडे आहे' : language === 'hi' ? 'खुला है' : 'Open') 
                            : (language === 'mr' ? 'बंद आहे' : language === 'hi' ? 'बंद है' : 'Closed')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sidebar Action Panel when item is clicked */}
                  {isSelected && (
                    <div 
                      className="map-result-actions-panel"
                      onClick={(e) => e.stopPropagation()} // Prevent list item trigger
                    >
                      <p className="actions-panel-address">
                        <strong>📍 Address:</strong> {biz.address}
                      </p>
                      {biz.phone && (
                        <p className="actions-panel-phone">
                          <strong>📞 Phone:</strong> {biz.phone}
                        </p>
                      )}
                      <div className="actions-panel-buttons">
                        <button
                          className="popup-directions-btn btn-primary"
                          onClick={() => calculateRoute(biz)}
                        >
                          🛣️ {language === 'mr' ? 'मार्ग दाखवा' : language === 'hi' ? 'मार्ग दिखाएं' : 'Show Route'}
                        </button>
                        <button
                          className="popup-directions-btn btn-outline"
                          onClick={() => openDirections(biz)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-primary)',
                            marginTop: '8px'
                          }}
                        >
                          🧭 {language === 'mr' ? 'गुगल मॅप्स' : language === 'hi' ? 'गूगल मैप्स' : 'Google Maps'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <MapContainer
            center={amravatiCenter}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flyTo && <FlyToMarker position={flyTo} />}
            {/* Live Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  {language === 'mr' ? 'तुम्ही येथे आहात' : language === 'hi' ? 'आप यहाँ हैं' : 'You are here'}
                </Popup>
              </Marker>
            )}

            {/* In-App Route Polyline */}
            {routeCoords && (
              <>
                <Polyline positions={routeCoords} color="#2979ff" weight={5} opacity={0.8} />
                <RouteFitter routeCoords={routeCoords} />
              </>
            )}

            {filtered.filter(biz => biz.lat && biz.lng).map((biz, idx) => (
              <Marker key={`${biz.id}-${idx}`} position={[biz.lat, biz.lng]} icon={selectedBiz?.id === biz.id ? destIcon : new L.Icon.Default()}>
                <Popup>
                  <div className="map-popup">
                    <h4>
                      {biz.image} {language === 'mr' ? biz.nameMarathi : language === 'hi' ? (biz.nameHindi || biz.name) : biz.name}
                    </h4>
                    <p>
                      ⭐ {biz.rating} • {biz.distance} • {biz.isOpen ? '🟢 ' + (language === 'mr' ? 'उघडे आहे' : language === 'hi' ? 'खुला है' : 'Open') : '🔴 ' + (language === 'mr' ? 'बंद आहे' : language === 'hi' ? 'बंद है' : 'Closed')}
                    </p>
                    <p>📍 {biz.address.substring(0, 50)}{biz.address.length > 50 ? '...' : ''}</p>
                    {biz.phone && <p>📞 {biz.phone}</p>}
                    
                    <div className="popup-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        className="popup-directions-btn btn-primary"
                        onClick={() => calculateRoute(biz)}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}
                      >
                        🛣️ {language === 'mr' ? 'मार्ग दाखवा' : language === 'hi' ? 'मार्ग दिखाएं' : 'Show Route'}
                      </button>
                      <button
                        className="popup-directions-btn btn-outline"
                        onClick={() => openDirections(biz)}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                      >
                        🧭 {language === 'mr' ? 'गुगल मॅप्स' : language === 'hi' ? 'गूगल मैप्स' : 'Google Maps'}
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
