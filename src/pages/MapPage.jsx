import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, Star, MapPin, Phone, Clock, Layers } from 'lucide-react';
import { businesses, categories } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
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

export default function MapPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  const amravatiCenter = [20.9320, 77.7523];

  const filtered = useMemo(() => {
    let list = businesses;
    if (activeCategory !== 'all') {
      list = list.filter(b => b.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.nameMarathi.includes(searchQuery) ||
        b.category.includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleBizClick = (biz) => {
    setSelectedBiz(biz);
    setFlyTo([biz.lat, biz.lng]);
  };

  const openDirections = (biz) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${biz.lat},${biz.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-container map-page">
      <div className="map-layout">
        {/* Sidebar Panel */}
        <div className="map-panel">
          <div className="map-panel-header">
            <h2>{language === 'mr' ? 'अमरावती नकाशा' : 'Explore Amravati'}</h2>
          </div>

          <div className="map-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={language === 'mr' ? "ठिकाणे शोधा..." : "Search places..."}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="map-search"
            />
          </div>

          <div className="map-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`map-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{language === 'mr' ? cat.labelMarathi || cat.label : cat.label}</span>
              </button>
            ))}
          </div>

          <div className="map-results">
            <p className="map-results-count">{filtered.length} {language === 'mr' ? 'ठिकाणे सापडली' : 'places found'}</p>
            {filtered.map(biz => (
              <div
                key={biz.id}
                className={`map-result-item ${selectedBiz?.id === biz.id ? 'selected' : ''}`}
                onClick={() => handleBizClick(biz)}
              >
                <div className="map-result-icon">{biz.image}</div>
                <div className="map-result-info">
                  <h4>{language === 'mr' ? biz.nameMarathi : biz.name}</h4>
                  <div className="map-result-meta">
                    <span><Star size={11} fill="currentColor" /> {biz.rating}</span>
                    <span><MapPin size={11} /> {biz.distance}</span>
                    <span className={`status-dot ${biz.isOpen ? 'open' : 'closed'}`}>
                      {biz.isOpen ? (language === 'mr' ? 'उघडे आहे' : 'Open') : (language === 'mr' ? 'बंद आहे' : 'Closed')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            {filtered.map(biz => (
              <Marker key={biz.id} position={[biz.lat, biz.lng]}>
                <Popup>
                  <div className="map-popup">
                    <h4>{biz.image} {language === 'mr' ? biz.nameMarathi : biz.name}</h4>
                    <p>⭐ {biz.rating} • {biz.distance} • {biz.isOpen ? '🟢 ' + (language === 'mr' ? 'उघडे आहे' : 'Open') : '🔴 ' + (language === 'mr' ? 'बंद आहे' : 'Closed')}</p>
                    <p>📍 {biz.address}</p>
                    {biz.phone && <p>📞 {biz.phone}</p>}
                    <button
                      className="popup-directions-btn"
                      onClick={() => openDirections(biz)}
                    >
                      🧭 {language === 'mr' ? 'दिशा मिळवा' : 'Get Directions'}
                    </button>
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
