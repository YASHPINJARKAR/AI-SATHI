import { useState, useMemo } from 'react';
import { Search, Star, MapPin, Clock, Phone, Filter, ChevronDown, Navigation, ExternalLink } from 'lucide-react';
import { businesses, categories } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Directory.css';

export default function Directory() {
  const { language } = useLanguage();
  const { requireAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(b => b.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.nameMarathi.includes(searchQuery) ||
        b.category.includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'distance') {
      filtered = [...filtered].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
    }
    return filtered;
  }, [searchQuery, activeCategory, sortBy]);

  const openDirections = (business) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`;
    window.open(url, '_blank');
  };

  const handleCall = (phone) => {
    requireAuth(() => {
      window.open(`tel:${phone}`, '_self');
    });
  };

  return (
    <div className="page-container directory-page">
      {/* Header */}
      <div className="directory-header animate-fade-in-down">
        <div>
          <h1>{language === 'mr' ? 'व्यवसाय डिरेक्टरी' : 'Business Directory'}</h1>
          <p className="marathi-text">
            {filteredBusinesses.length} {language === 'mr' ? 'निकाल' : 'results'}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="directory-controls animate-fade-in-up stagger-1">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={language === 'mr' ? "व्यवसाय, रुग्णालये, रेस्टॉरंट्स शोधा..." : "Search businesses, hospitals, restaurants..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="directory-search"
          />
        </div>

        <div className="filter-row">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{language === 'mr' ? cat.labelMarathi || cat.label : cat.label}</span>
              </button>
            ))}
          </div>

          <div className="sort-select-wrapper">
            <Filter size={14} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="distance">{language === 'mr' ? 'सर्वात जवळचे' : 'Nearest First'}</option>
              <option value="rating">{language === 'mr' ? 'सर्वाधिक रेट केलेले' : 'Highest Rated'}</option>
              <option value="reviews">{language === 'mr' ? 'सर्वाधिक पुनरावलोकने' : 'Most Reviewed'}</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Business Cards */}
      <div className="business-grid">
        {filteredBusinesses.map((biz, idx) => (
          <div
            key={biz.id}
            className="business-card card card-elevated card-interactive animate-fade-in-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="biz-card-header">
              <div className="biz-icon">{biz.image}</div>
              <div className="biz-info">
                <h3 className="biz-name">{language === 'mr' ? biz.nameMarathi : biz.name}</h3>
              </div>
              <span className={`biz-status ${biz.isOpen ? 'open' : 'closed'}`}>
                {biz.isOpen 
                  ? (language === 'mr' ? 'उघडे आहे' : 'Open') 
                  : (language === 'mr' ? 'बंद आहे' : 'Closed')}
              </span>
            </div>

            <div className="biz-meta">
              <span className="biz-rating">
                <Star size={14} fill="currentColor" />
                {biz.rating}
                <span className="biz-reviews">({biz.reviews})</span>
              </span>
              <span className="biz-distance">
                <MapPin size={14} />
                {biz.distance}
              </span>
            </div>

            <div className="biz-details">
              <p className="biz-address">
                <MapPin size={13} />
                {biz.address}
              </p>
              <p className="biz-hours">
                <Clock size={13} />
                {biz.hours}
              </p>
              {biz.phone && (
                <p className="biz-phone">
                  <Phone size={13} />
                  {biz.phone}
                </p>
              )}
            </div>

            <div className="biz-tags">
              {biz.tags.map((tag, i) => (
                <span key={i} className="biz-tag">{tag}</span>
              ))}
            </div>

            <div className="biz-actions">
              <button className="btn btn-accent btn-sm" onClick={() => openDirections(biz)}>
                <Navigation size={14} />
                Get Directions
              </button>
              {biz.phone && (
                <button className="btn btn-outline btn-sm" onClick={() => handleCall(biz.phone)}>
                  <Phone size={14} />
                  Call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="empty-state animate-fade-in">
          <span className="empty-icon">🔍</span>
          <h3>No results found</h3>
          <p>Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
