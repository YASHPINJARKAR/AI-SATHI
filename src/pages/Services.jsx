import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, MapPin, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { governmentServices } from '../data/mockData';
import './Services.css';

const serviceCategories = [
  { id: 'all', label: 'All Services', icon: '📋' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { id: 'women', label: 'Women', icon: '👩' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'food', label: 'Food & Supply', icon: '🍚' },
  { id: 'documents', label: 'Documents', icon: '📜' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'municipal', label: 'Municipal', icon: '🏢' },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = governmentServices.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.nameMarathi.includes(searchQuery) || s.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="page-container services-page">
      <div className="services-header animate-fade-in-down">
        <div>
          <h1>Government & Public Services</h1>
          <p className="marathi-text">सरकारी आणि सार्वजनिक सेवा • Amravati</p>
        </div>
      </div>

      {/* Search */}
      <div className="services-search animate-fade-in-up">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search schemes, services... / योजना शोधा..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="services-search"
        />
      </div>

      {/* Categories */}
      <div className="services-categories animate-fade-in-up stagger-1">
        {serviceCategories.map(cat => (
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

      {/* Service Cards */}
      <div className="services-list">
        {filtered.map((service, idx) => (
          <div
            key={service.id}
            className={`service-card card card-elevated animate-fade-in-up ${expandedId === service.id ? 'expanded' : ''}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="service-card-header" onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}>
              <div className="service-icon">{service.icon}</div>
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-name-marathi marathi-text">{service.nameMarathi}</p>
                <p className="service-desc">{service.description}</p>
              </div>
              <button className="service-expand-btn">
                {expandedId === service.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {expandedId === service.id && (
              <div className="service-details animate-fade-in-up">
                {/* Eligibility */}
                <div className="service-detail-section">
                  <h4><CheckCircle size={16} /> Eligibility / पात्रता</h4>
                  <p>{service.eligibility}</p>
                </div>

                {/* Documents */}
                <div className="service-detail-section">
                  <h4><FileText size={16} /> Required Documents / आवश्यक कागदपत्रे</h4>
                  <ul className="doc-list">
                    {service.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div className="service-detail-section">
                  <h4>📝 How to Apply / अर्ज कसा करावा</h4>
                  <ol className="steps-list">
                    {service.steps.map((step, i) => (
                      <li key={i}>
                        <span className="step-number">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Office & Timeline */}
                <div className="service-meta-row">
                  <div className="service-meta-card">
                    <MapPin size={16} />
                    <div>
                      <span className="meta-label">Office</span>
                      <span className="meta-value">{service.office}</span>
                    </div>
                  </div>
                  <div className="service-meta-card">
                    <Clock size={16} />
                    <div>
                      <span className="meta-label">Timeline</span>
                      <span className="meta-value">{service.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state animate-fade-in">
          <span className="empty-icon">🏛️</span>
          <h3>No services found</h3>
          <p>Try a different category or search term</p>
        </div>
      )}
    </div>
  );
}
