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
  const [sortBy, setSortBy] = useState('rating');

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses;
    if (activeCategory !== 'all') {
      if (activeCategory === 'education') {
        filtered = filtered.filter(b => b.category === 'school' || b.category === 'college');
      } else {
        filtered = filtered.filter(b => b.category === activeCategory);
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.nameMarathi.includes(searchQuery) ||
        (b.nameHindi && b.nameHindi.includes(searchQuery)) ||
        b.category.includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
      filtered = [...filtered].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
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
          <h1>
            {language === 'mr' ? 'व्यवसाय डिरेक्टरी' : language === 'hi' ? 'व्यवसाय निर्देशिका' : 'Business Directory'}
          </h1>
          <p className="marathi-text">
            {filteredBusinesses.length} {language === 'mr' ? 'निकाल' : language === 'hi' ? 'परिणाम' : 'results'}
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
            placeholder={
              language === 'mr' 
                ? "व्यवसाय, रुग्णालये, रेस्टॉरंट्स शोधा..." 
                : language === 'hi' 
                ? "व्यवसाय, अस्पताल, रेस्तरां खोजें..." 
                : "Search businesses, hospitals, restaurants..."
            }
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

          <div className="sort-select-wrapper">
            <Filter size={14} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="rating">
                {language === 'mr' ? 'सर्वाधिक रेट केलेले' : language === 'hi' ? 'सर्वोच्च रेटेड' : 'Highest Rated'}
              </option>
              <option value="reviews">
                {language === 'mr' ? 'सर्वाधिक पुनरावलोकने' : language === 'hi' ? 'सर्वाधिक समीक्षाएं' : 'Most Reviewed'}
              </option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Business Cards */}
      <div className="business-grid">
        {filteredBusinesses.map((biz, idx) => (
          <div
            key={`${biz.category}-${biz.id}-${idx}`}
            className="business-card card card-elevated card-interactive animate-fade-in-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="biz-card-header">
              <div className="biz-icon">{biz.image}</div>
              <div className="biz-info">
                <h3 className="biz-name">
                  {language === 'mr' ? biz.nameMarathi : language === 'hi' ? (biz.nameHindi || biz.name) : biz.name}
                </h3>
              </div>
              <span className={`biz-status ${biz.isOpen ? 'open' : 'closed'}`}>
                {biz.isOpen 
                  ? (language === 'mr' ? 'उघडे आहे' : language === 'hi' ? 'खुला है' : 'Open') 
                  : (language === 'mr' ? 'बंद आहे' : language === 'hi' ? 'बंद है' : 'Closed')}
              </span>
            </div>

            <div className="biz-meta">
              <span className="biz-rating">
                <Star size={14} fill="currentColor" />
                {biz.rating}
                <span className="biz-reviews">({biz.reviews})</span>
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
                {language === 'mr' ? 'दिशा-निर्देश मिळवा' : language === 'hi' ? 'दिशा-निर्देश प्राप्त करें' : 'Get Directions'}
              </button>
              {biz.phone && (
                <button className="btn btn-outline btn-sm" onClick={() => handleCall(biz.phone)}>
                  <Phone size={14} />
                  {language === 'mr' ? 'कॉल करा' : language === 'hi' ? 'कॉल करें' : 'Call'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="empty-state animate-fade-in">
          <span className="empty-icon">🔍</span>
          <h3>
            {language === 'mr' ? 'कोणतेही निकाल आढळले नाहीत' : language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No results found'}
          </h3>
          <p>
            {language === 'mr' ? 'दुसरा शोध किंवा श्रेणी वापरून पहा' : language === 'hi' ? 'दूसरा खोज शब्द या श्रेणी आज़माएं' : 'Try a different search or category'}
          </p>
        </div>
      )}
    </div>
  );
}
