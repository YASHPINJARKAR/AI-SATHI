import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Tag, X, Phone, IndianRupee, Share2, CheckCircle, User, Smartphone, ChevronRight } from 'lucide-react';
import { events } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Events.css';

const eventCategories = [
  { id: 'all', label: 'All Events', labelMarathi: 'सर्व कार्यक्रम', labelHindi: 'सभी कार्यक्रम', icon: '📅' },
  { id: 'tech', label: 'Tech', labelMarathi: 'तंत्रज्ञान', labelHindi: 'तकनीकी', icon: '💻' },
  { id: 'culture', label: 'Culture', labelMarathi: 'संस्कृती', labelHindi: 'सांस्कृतिक', icon: '🎭' },
  { id: 'sports', label: 'Sports', labelMarathi: 'क्रीडा', labelHindi: 'खेल', icon: '⚽' },
  { id: 'education', label: 'Education', labelMarathi: 'शिक्षण', labelHindi: 'शिक्षा', icon: '🎓' },
  { id: 'health', label: 'Health', labelMarathi: 'आरोग्य', labelHindi: 'स्वास्थ्य', icon: '🩺' },
  { id: 'government', label: 'Government', labelMarathi: 'सरकारी', labelHindi: 'सरकारी', icon: '🏛️' },
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
    const matchSearch = !q || 
      e.title.toLowerCase().includes(q) || 
      e.titleMarathi.includes(searchQuery) || 
      (e.titleHindi && e.titleHindi.includes(searchQuery)) ||
      e.category.includes(q);
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
    if (!form.name.trim()) {
      errs.name = language === 'mr' ? 'नाव आवश्यक आहे' : language === 'hi' ? 'नाम आवश्यक है' : 'Name is required';
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      errs.mobile = language === 'mr' ? 'वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा' : language === 'hi' ? 'वैध 10-अंकीय मोबाइल नंबर दर्ज करें' : 'Enter valid 10-digit mobile number';
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = language === 'mr' ? 'अवैध ईमेल पत्ता' : language === 'hi' ? 'अमान्य ईमेल पता' : 'Invalid email address';
    }
    if (form.people < 1) {
      errs.people = language === 'mr' ? 'किमान १ व्यक्ती आवश्यक' : language === 'hi' ? 'कम से कम 1 व्यक्ति आवश्यक है' : 'At least 1 person required';
    }
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
        eventTitle: language === 'mr' ? selectedEvent.titleMarathi : language === 'hi' ? (selectedEvent.titleHindi || selectedEvent.title) : selectedEvent.title,
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
    const currentTitle = language === 'mr' ? evt.titleMarathi : language === 'hi' ? (evt.titleHindi || evt.title) : evt.title;
    const text = `🎉 ${currentTitle}\n📅 ${new Date(evt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at ${evt.time}\n📍 ${evt.location}\n💰 ${evt.price}\n\nShared via Ai Sathi App`;
    
    if (navigator.share) {
      navigator.share({ title: currentTitle, text }).catch(() => {});
    } else if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setShareToast(`"${currentTitle}" copied to clipboard!`);
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
        setShareToast(`"${currentTitle}" copied to clipboard!`);
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
          <h1>
            {language === 'mr' ? 'कार्यक्रम आणि उपक्रम' : language === 'hi' ? 'कार्यक्रम और गतिविधियाँ' : 'Events & Activities'}
          </h1>
        </div>
        <div className="events-header-badge badge badge-accent">
          <Calendar size={14} />
          {filtered.length} {language === 'mr' ? 'कार्यक्रम' : language === 'hi' ? 'कार्यक्रम' : 'Events'}
        </div>
      </div>

      {/* Search */}
      <div className="events-search animate-fade-in-up">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={
            language === 'mr' 
              ? "कार्यक्रम शोधा..." 
              : language === 'hi' 
              ? "कार्यक्रम खोजें..." 
              : "Search events..."
          }
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
            <span>
              {language === 'mr' 
                ? cat.labelMarathi 
                : language === 'hi' 
                ? cat.labelHindi 
                : cat.label}
            </span>
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
              <h3 className="event-title">
                {language === 'mr' ? evt.titleMarathi : language === 'hi' ? (evt.titleHindi || evt.title) : evt.title}
              </h3>
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
                  <span>
                    {evt.attendees}+ {language === 'mr' ? 'उपस्थित' : language === 'hi' ? 'उपस्थित' : 'Attendees'}
                  </span>
                </div>
              </div>
            </div>
            <div className="event-card-footer">
              <button className="btn btn-accent btn-sm" style={{ flex: 1 }} onClick={() => openEvent(evt)}>
                {language === 'mr' ? 'नोंदणी करा' : language === 'hi' ? 'पंजीकरण करें' : 'Register Now'}
              </button>
              <button className="btn btn-outline btn-sm event-share-btn" onClick={(e) => handleShare(evt, e)}>
                <Share2 size={14} />
                {language === 'mr' ? 'शेअर' : language === 'hi' ? 'शेयर' : 'Share'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state animate-fade-in">
          <span className="empty-icon">📅</span>
          <h3>
            {language === 'mr' ? 'कोणतेही कार्यक्रम आढळले नाहीत' : language === 'hi' ? 'कोई कार्यक्रम नहीं मिला' : 'No events found'}
          </h3>
          <p>
            {language === 'mr' ? 'दुसरी श्रेणी किंवा शोध वापरून पहा' : language === 'hi' ? 'दूसरी श्रेणी या खोज शब्द आज़माएं' : 'Try a different category or search'}
          </p>
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
                <h2 className="event-modal-title">
                  {language === 'mr' ? selectedEvent.titleMarathi : language === 'hi' ? (selectedEvent.titleHindi || selectedEvent.title) : selectedEvent.title}
                </h2>
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
                      <span className="info-label">{language === 'mr' ? 'तारीख' : language === 'hi' ? 'दिनांक' : 'Date'}</span>
                      <span className="info-value">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Clock size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'वेळ' : language === 'hi' ? 'समय' : 'Time'}</span>
                      <span className="info-value">{selectedEvent.time}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <MapPin size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'ठिकाण' : language === 'hi' ? 'स्थान' : 'Venue'}</span>
                      <span className="info-value">{selectedEvent.location}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Users size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'उपस्थित' : language === 'hi' ? 'अपेक्षित उपस्थिति' : 'Expected Attendees'}</span>
                      <span className="info-value">{selectedEvent.attendees}+ People</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <IndianRupee size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'प्रवेश शुल्क' : language === 'hi' ? 'प्रवेश शुल्क' : 'Entry Fee'}</span>
                      <span className="info-value">{detail.fee}</span>
                    </div>
                  </div>
                  <div className="event-info-item">
                    <Phone size={16} />
                    <div>
                      <span className="info-label">{language === 'mr' ? 'संपर्क' : language === 'hi' ? 'संपर्क' : 'Contact'}</span>
                      <a className="info-value info-link" href={`tel:${detail.contact}`}>{detail.contact}</a>
                    </div>
                  </div>
                </div>

                <div className="event-organizer-tag">
                  🏢 {language === 'mr' ? 'आयोजक:' : language === 'hi' ? 'आयोजक:' : 'Organized by:'} <strong>{detail.organizer}</strong>
                </div>

                <div className="event-modal-actions">
                  <button className="btn btn-outline btn-sm" onClick={(e) => handleShare(selectedEvent, e)}>
                    <Share2 size={16} /> {language === 'mr' ? 'शेअर करा' : language === 'hi' ? 'शेयर करें' : 'Share Event'}
                  </button>
                  <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => setModalStep('form')}>
                    {language === 'mr' ? 'नोंदणी करा' : language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step: Registration Form */}
            {modalStep === 'form' && (
              <div className="event-modal-body">
                <h3 className="form-section-title">
                  📝 {language === 'mr' ? 'नोंदणी फॉर्म' : language === 'hi' ? 'पंजीकरण फॉर्म' : 'Registration Form'}
                </h3>
                <form onSubmit={handleSubmit} className="event-reg-form" noValidate>
                  <div className="form-group">
                    <label><User size={14} /> {language === 'mr' ? 'पूर्ण नाव *' : language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</label>
                    <input
                      type="text"
                      placeholder={language === 'mr' ? 'तुमचे पूर्ण नाव' : language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={formErrors.name ? 'input-error' : ''}
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label><Smartphone size={14} /> {language === 'mr' ? 'मोबाईल नंबर *' : language === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}</label>
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
                    <label>📧 {language === 'mr' ? 'ईमेल (पर्यायी)' : language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}</label>
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
                    <label><Users size={14} /> {language === 'mr' ? 'किती जण येणार? *' : language === 'hi' ? 'लोगों की संख्या *' : 'Number of People *'}</label>
                    <div className="people-counter">
                      <button type="button" onClick={() => setForm(f => ({ ...f, people: Math.max(1, f.people - 1) }))}>−</button>
                      <span>{form.people}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, people: Math.min(detail.maxPeople, f.people + 1) }))}>+</button>
                    </div>
                    <span className="field-hint">
                      Max {detail.maxPeople} {language === 'mr' ? 'नोंदणी प्रति लोक' : language === 'hi' ? 'लोग प्रति पंजीकरण' : 'people per registration'}
                    </span>
                  </div>

                  <div className="form-group">
                    <label>📝 {language === 'mr' ? 'टीप (पर्यायी)' : language === 'hi' ? 'विशेष टिप्पणी (वैकल्पिक)' : 'Special Notes (Optional)'}</label>
                    <textarea
                      placeholder={language === 'mr' ? 'कोणतीही विशेष माहिती...' : language === 'hi' ? 'कोई विशेष निर्देश...' : 'Any special requirements...'}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Fee Summary */}
                  <div className="fee-summary">
                    <span>{language === 'mr' ? 'एकूण शुल्क:' : language === 'hi' ? 'कुल शुल्क:' : 'Total Fee:'}</span>
                    <strong>
                      {selectedEvent.price === 'Free' ? '🎟️ Free' :
                        `₹${parseInt(selectedEvent.price.replace(/[^\d]/g, '')) * form.people}`}
                    </strong>
                  </div>

                  <div className="event-modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setModalStep('detail')}>
                      ← {language === 'mr' ? 'मागे' : language === 'hi' ? 'पीछे' : 'Back'}
                    </button>
                    <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                      {language === 'mr' ? 'नोंदणी पूर्ण करा' : language === 'hi' ? 'पंजीकरण पूर्ण करें' : 'Confirm Registration'}
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
                <h3>{language === 'mr' ? '🎉 नोंदणी यशस्वी!' : language === 'hi' ? '🎉 पंजीकरण सफल!' : '🎉 Registration Successful!'}</h3>
                <p className="success-sub">
                  {language === 'mr'
                    ? `${form.name}, तुमची नोंदणी "${selectedEvent.titleMarathi}" साठी झाली!`
                    : language === 'hi'
                    ? `${form.name}, आपका पंजीकरण "${selectedEvent.titleHindi || selectedEvent.title}" के लिए सफल रहा!`
                    : `${form.name}, you're registered for "${selectedEvent.title}"!`}
                </p>
                <div className="success-details">
                  <div>📅 {new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} · {selectedEvent.time}</div>
                  <div>📍 {selectedEvent.location}</div>
                  <div>👥 {form.people} {form.people === 1 ? 'Person' : 'People'}</div>
                  <div>📞 {form.mobile}</div>
                </div>
                <p className="success-hint">
                  {language === 'mr' 
                    ? `एक पुष्टीकरण संदेश ${form.mobile} वर पाठविला जाईल` 
                    : language === 'hi' 
                    ? `एक पुष्टीकरण संदेश ${form.mobile} पर भेजा जाएगा` 
                    : `A confirmation will be sent to ${form.mobile}`}
                </p>
                <button className="btn btn-accent" style={{ width: '100%', marginTop: '16px' }} onClick={closeModal}>
                  {language === 'mr' ? 'बंद करा' : language === 'hi' ? 'हो गया' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
