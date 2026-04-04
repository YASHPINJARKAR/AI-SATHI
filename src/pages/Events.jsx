import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Filter, Search, Tag } from 'lucide-react';
import { events } from '../data/mockData';
import './Events.css';

const eventCategories = [
  { id: 'all', label: 'All Events', icon: '📅' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'health', label: 'Health', icon: '🩺' },
  { id: 'government', label: 'Government', icon: '🏛️' },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = events.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.titleMarathi.includes(searchQuery) || e.category.includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="page-container events-page">
      <div className="events-header animate-fade-in-down">
        <div>
          <h1>Events & Activities</h1>
          <p className="marathi-text">कार्यक्रम आणि उपक्रम • Amravati</p>
        </div>
        <div className="events-header-badge badge badge-accent">
          <Calendar size={14} />
          {filtered.length} Events
        </div>
      </div>

      {/* Search */}
      <div className="events-search animate-fade-in-up">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search events... / कार्यक्रम शोधा..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="events-search"
        />
      </div>

      {/* Category Filter */}
      <div className="events-categories animate-fade-in-up stagger-1">
        {eventCategories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filtered.map((evt, idx) => (
          <div key={evt.id} className="event-card card card-elevated card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 70}ms` }}>
            <div className="event-card-top">
              <div className="event-icon-large">{evt.image}</div>
              <span className={`event-price ${evt.price === 'Free' ? 'free' : 'paid'}`}>{evt.price}</span>
            </div>
            <div className="event-card-body">
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                <Tag size={10} />
                {evt.category.charAt(0).toUpperCase() + evt.category.slice(1)}
              </span>
              <h3 className="event-title">{evt.title}</h3>
              <p className="event-title-marathi marathi-text">{evt.titleMarathi}</p>
              <p className="event-description">{evt.description}</p>
              <div className="event-meta-grid">
                <div className="event-meta-item">
                  <Calendar size={14} />
                  <span>{new Date(evt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="event-meta-item">
                  <Clock size={14} />
                  <span>{evt.time}</span>
                </div>
                <div className="event-meta-item">
                  <MapPin size={14} />
                  <span>{evt.location}</span>
                </div>
                <div className="event-meta-item">
                  <Users size={14} />
                  <span>{evt.attendees}+ Attendees</span>
                </div>
              </div>
            </div>
            <div className="event-card-footer">
              <button className="btn btn-accent btn-sm" style={{ flex: 1 }}>Register Now</button>
              <button className="btn btn-outline btn-sm">Share</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state animate-fade-in">
          <span className="empty-icon">📅</span>
          <h3>No events found</h3>
          <p>Try a different category or search</p>
        </div>
      )}
    </div>
  );
}
