import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Tag, X, Phone, IndianRupee, Share2, CheckCircle, User, Smartphone, ChevronRight } from 'lucide-react';
import { events } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
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

// Extra contact & details per event
const eventDetails = {
  1: { contact: '+91 9823100001', organizer: 'SGBAU Tech Club', fee: 'Free', maxPeople: 4 },
  2: { contact: '+91 9823100002', organizer: 'HVPM Garba Committee', fee: '₹200 per person', maxPeople: 6 },
  3: { contact: '0721 2662200', organizer: 'Collectorate Office', fee: 'Free', maxPeople: 1 },
  4: { contact: '+91 9823100004', organizer: 'VCA Sports Committee', fee: 'Free', maxPeople: 15 },
  5: { contact: '+91 9823100005', organizer: 'Govt Polytechnic', fee: 'Free', maxPeople: 2 },
  6: { contact: '+91 9823100006', organizer: 'Sahitya Parishad', fee: '₹100 per person', maxPeople: 4 },
  7: { contact: '+91 9823100007', organizer: 'Amravati Medical Club', fee: 'Free', maxPeople: 1 },
  8: { contact: '+91 9823100008', organizer: 'Wellness Foundation', fee: 'Free', maxPeople: 2 },
  9: { contact: '+91 9823100009', organizer: 'Shivaji Jayanti Samiti', fee: 'Free', maxPeople: 10 },
};

export default function Events() {
  const { language } = useLanguage();
  const { requireAuth } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalStep, setModalStep] = useState('detail'); // 'detail' | 'form' | 'success'
  const [form, setForm] = useState({ name: '', mobile: '', email: '', people: 1, notes: '' });
  const [formErrors, setFormErrors] = useState({});
  const [shareToast, setShareToast] = useState('');

  const filtered = events.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.titleMarathi.includes(searchQuery) || e.category.includes(q);
    return matchCat && matchSearch;
  });

  // Open event modal
  const openEvent = (evt) => {
    setSelectedEvent(evt);
    setModalStep('detail');
    setForm({ name: '', mobile: '', email: '', people: 1, notes: '' });
    setFormErrors({});
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalStep('detail');
  };

  // Validate form
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Enter valid 10-digit mobile number';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (form.people < 1) errs.people = 'At least 1 person required';
    return errs;
  };

  // Submit registration
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    requireAuth(() => {
      // Save registration to local storage
      const registrations = JSON.parse(localStorage.getItem('ai_sathi_event_registrations') || '[]');
      const newReg = {
        id: 'reg_' + Date.now(),
        userName: form.name,
        userEmail: form.email || 'N/A',
        userPhone: form.mobile,
        eventTitle: language === 'mr' ? selectedEvent.titleMarathi : selectedEvent.title,
        people: form.people,
        notes: form.notes || 'N/A',
        registeredAt: new Date().toLocaleDateString()
      };
      registrations.unshift(newReg);
      localStorage.setItem('ai_sathi_event_registrations', JSON.stringify(registrations));

      setModalStep('success');
    });
  };

  // Share event
  const handleShare = (evt, e) => {
    if (e) e.stopPropagation();
    const text = `🎉 ${evt.title}\n📅 ${new Date(evt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at ${evt.time}\n📍 ${evt.location}\n💰 ${evt.price}\n\nShared via Ai Sathi App`;
    
    if (navigator.share) {
      navigator.share({ title: evt.title, text }).catch(() => {});
    } else if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setShareToast(`"${evt.title}" copied to clipboard!`);
        setTimeout(() => setShareToast(''), 3000);
      }).catch(() => {});
    } else {
      // Fallback for non-HTTPS local network testing
      try {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShareToast(`"${evt.title}" copied to clipboard!`);
        setTimeout(() => setShareToast(''), 3000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
    }
  };

  const detail = selectedEvent ? (eventDetails[selectedEvent.id] || { contact: '+91 9800000000', organizer: 'Event Committee', fee: selectedEvent.price, maxPeople: 5 }) : null;

  return (
    <div className="page-container events-page">
      {/* Toast */}
      {shareToast && (
        <div className="share-toast animate-fade-in-up">
          <Share2 size={14} /> {shareToast}
        </div>
      )}

      <div className="events-header animate-fade-in-down">
        <div>
          <h1>{language === 'mr' ? 'कार्यक्रम आणि उपक्रम' : 'Events & Activities'}</h1>
        </div>
        <div className="events-header-badge badge badge-accent">
          <Calendar size={14} />
          {filtered.length} {language === 'mr' ? 'कार्यक्रम' : 'Events'}
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
              <h3 className="event-title">{language === 'mr' ? evt.titleMarathi : evt.title}</h3>
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
                  <span>{evt.attendees}+ {language === 'mr' ? 'उपस्थित' : 'Attendees'}</span>
                </div>
              </div>
            </div>
            <div className="event-card-footer">
              <button className="btn btn-accent btn-sm" style={{ flex: 1 }} onClick={() => openEvent(evt)}>
                {language === 'mr' ? 'नोंदणी करा' : 'Register Now'}
              </button>
              <button className="btn btn-outline btn-sm event-share-btn" onClick={(e) => handleShare(evt, e)}>
                <Share2 size={14} />
                {language === 'mr' ? 'शेअर' : 'Share'}
              </button>
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

      {/* ── Event Modal ── */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={closeModal}>
          <div className="event-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="event-modal-header">
              <div className="event-modal-icon">{selectedEvent.image}</div>
              <div className="event-modal-header-info">
                <span className={`event-price ${selectedEvent.price === 'Free' ? 'free' : 'paid'}`}>{selectedEvent.price}</span>
                <h2 className="event-modal-title">{language === 'mr' ? selectedEvent.titleMarathi : selectedEvent.title}</h2>
                <span className="badge badge-primary">
                  <Tag size={10} /> {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                </span>
              </div>
              <button className="event-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            {/* Step: Detail */}
            {modalStep === 'detail' && (
              <div className="event-modal-body">
                <p className="event-modal-desc">{selectedEvent.description}</p>

                <div className="event-modal-info-grid">
                  <div className="event-info-item">
                    <Calendar size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'तारीख' : 'Date'}</span>
                      <span className="info-value">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Clock size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'वेळ' : 'Time'}</span>
                      <span className="info-value">{selectedEvent.time}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <MapPin size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'ठिकाण' : 'Venue'}</span>
                      <span className="info-value">{selectedEvent.location}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Users size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'उपस्थित' : 'Expected Attendees'}</span>
                      <span className="info-value">{selectedEvent.attendees}+ People</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <IndianRupee size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'प्रवेश शुल्क' : 'Entry Fee'}</span>
                      <span className="info-value">{detail.fee}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Phone size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'संपर्क' : 'Contact'}</span>
                      <a className="info-value info-link" href={`tel:${detail.contact}`}>{detail.contact}</a>
                    </div>
                  </div>
                </div>

                <div className="event-organizer-tag">
                  🏢 {language === 'mr' ? 'आयोजक:' : 'Organized by:'} <strong>{detail.organizer}</strong>
                </div>

                <div className="event-modal-actions">
                  <button className="btn btn-outline btn-sm" onClick={(e) => handleShare(selectedEvent, e)}>
                    <Share2 size={16} /> {language === 'mr' ? 'शेअर करा' : 'Share Event'}
                  </button>
                  <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => setModalStep('form')}>
                    {language === 'mr' ? 'नोंदणी करा' : 'Register Now'} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step: Registration Form */}
            {modalStep === 'form' && (
              <div className="event-modal-body">
                <h3 className="form-section-title">
                  📝 {language === 'mr' ? 'नोंदणी फॉर्म' : 'Registration Form'}
                </h3>
                <form onSubmit={handleSubmit} className="event-reg-form" noValidate>
                  <div className="form-group">
                    <label><User size={14} /> {language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}</label>
                    <input
                      type="text"
                      placeholder={language === 'mr' ? 'तुमचे पूर्ण नाव' : 'Enter your full name'}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={formErrors.name ? 'input-error' : ''}
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label><Smartphone size={14} /> {language === 'mr' ? 'मोबाईल नंबर *' : 'Mobile Number *'}</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      maxLength={10}
                      onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                      className={formErrors.mobile ? 'input-error' : ''}
                    />
                    {formErrors.mobile && <span className="field-error">{formErrors.mobile}</span>}
                  </div>

                  <div className="form-group">
                    <label>📧 {language === 'mr' ? 'ईमेल (पर्यायी)' : 'Email (Optional)'}</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={formErrors.email ? 'input-error' : ''}
                    />
                    {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label><Users size={14} /> {language === 'mr' ? 'किती जण येणार? *' : 'Number of People *'}</label>
                    <div className="people-counter">
                      <button type="button" onClick={() => setForm(f => ({ ...f, people: Math.max(1, f.people - 1) }))}>−</button>
                      <span>{form.people}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, people: Math.min(detail.maxPeople, f.people + 1) }))}>+</button>
                    </div>
                    <span className="field-hint">Max {detail.maxPeople} people per registration</span>
                  </div>

                  <div className="form-group">
                    <label>📝 {language === 'mr' ? 'टीप (पर्यायी)' : 'Special Notes (Optional)'}</label>
                    <textarea
                      placeholder={language === 'mr' ? 'कोणतीही विशेष माहिती...' : 'Any special requirements...'}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Fee Summary */}
                  <div className="fee-summary">
                    <span>{language === 'mr' ? 'एकूण शुल्क:' : 'Total Fee:'}</span>
                    <strong>
                      {selectedEvent.price === 'Free' ? '🎟️ Free' :
                        `₹${parseInt(selectedEvent.price.replace(/[^\d]/g, '')) * form.people}`}
                    </strong>
                  </div>

                  <div className="event-modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setModalStep('detail')}>
                      ← {language === 'mr' ? 'मागे' : 'Back'}
                    </button>
                    <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                      {language === 'mr' ? 'नोंदणी पूर्ण करा' : 'Confirm Registration'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step: Success */}
            {modalStep === 'success' && (
              <div className="event-modal-body event-success-body">
                <div className="success-icon-wrap">
                  <CheckCircle size={64} className="success-icon" />
                </div>
                <h3>{language === 'mr' ? '🎉 नोंदणी यशस्वी!' : '🎉 Registration Successful!'}</h3>
                <p className="success-sub">
                  {language === 'mr'
                    ? `${form.name}, तुमची नोंदणी "${selectedEvent.titleMarathi}" साठी झाली!`
                    : `${form.name}, you're registered for "${selectedEvent.title}"!`}
                </p>
                <div className="success-details">
                  <div>📅 {new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} · {selectedEvent.time}</div>
                  <div>📍 {selectedEvent.location}</div>
                  <div>👥 {form.people} {form.people === 1 ? 'Person' : 'People'}</div>
                  <div>📞 {form.mobile}</div>
                </div>
                <p className="success-hint">A confirmation will be sent to {form.mobile}</p>
                <button className="btn btn-accent" style={{ width: '100%', marginTop: '16px' }} onClick={closeModal}>
                  {language === 'mr' ? 'बंद करा' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
