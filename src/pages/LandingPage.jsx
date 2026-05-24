import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, MapPin, Sparkles, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
import './LandingPage.css';
import { useLanguage } from '../LanguageContext';
import SplineScene from '../components/SplineScene';

// ─── Public Spline scene: AI robot / smart-city orb ──────────────────────────
// Replace this URL with your own Spline scene link anytime
const SPLINE_SCENE_URL =
  'https://prod.spline.design/31VIZdegQnugXSDa/scene.splinecode';

// ── Public Utilities Data ────────────────────────────────────────────────────
const UTILITIES = [
  {
    id: 'electricity',
    icon: '⚡',
    label: 'Electricity',
    labelMr: 'वीज',
    labelHi: 'विद्युत',
    count: 5,
    color: '#3b82f6',
    items: [
      { name: 'Mahavitaran Camp', detail: 'Mahavitaran Camp, Amravati – 444602', phone: '0721-2662467' },
      { name: 'Mahavitaran Cotton Market Road', detail: 'Mahavitaran Cotton Market Road, Amravati – 444601', phone: '' },
      { name: 'Mahavitaran Gadgenagar', detail: 'Mahavitaran Gadgenagar, Amravati – 444603', phone: '0721-2661699' },
      { name: 'Mahavitaran Jawahar Gate', detail: 'Mahavitaran Jawahar Gate, Amravati – 444601', phone: '' },
      { name: 'Mahavitaran Rajapeth', detail: 'Mahavitaran Rajapeth, Rajapeth, Amravati – 444601', phone: '' },
    ],
  },
  {
    id: 'post',
    icon: '📮',
    label: 'Post',
    labelMr: 'टपाल',
    labelHi: 'डाकघर',
    count: 14,
    color: '#ef4444',
    items: [
      { name: 'Achalpur', detail: 'Pin Code – 444806', phone: '' },
      { name: 'Amravati', detail: 'Pin Code – 444601', phone: '' },
      { name: 'Anjangaon Surji', detail: 'Pin Code – 444705', phone: '' },
      { name: 'Bhatkuli', detail: 'Pin Code – 444602', phone: '' },
      { name: 'Chandur Railway', detail: 'Pin Code – 444904', phone: '' },
      { name: 'Chandurbazar', detail: 'Pin Code – 444704', phone: '' },
      { name: 'Chikhaldara', detail: 'Pin Code – 444807', phone: '' },
      { name: 'Daryapur', detail: 'Pin Code – 444803', phone: '' },
      { name: 'Dhamangaon Railway', detail: 'Pin Code – 444709', phone: '' },
      { name: 'Dharni', detail: 'Pin Code – 444702', phone: '' },
      { name: 'Morshi', detail: 'Pin Code – 444905', phone: '' },
      { name: 'Nandgaon-Khandeshwar', detail: 'Pin Code – 444708', phone: '' },
      { name: 'Tiosa', detail: 'Pin Code – 444903', phone: '' },
      { name: 'Warud', detail: 'Pin Code – 444906', phone: '' },
    ],
  },
  {
    id: 'municipalities',
    icon: '🏙️',
    label: 'Municipalities',
    labelMr: 'नगरपालिका',
    labelHi: 'नगरपालिका',
    count: 15,
    color: '#f97316',
    items: [
      { name: 'Municipal Corporation, Amravati', detail: 'Amravati – 444601', phone: '0721-2561569' },
      { name: 'Municipal Council Achalpur', detail: 'Achalpur – 444806', phone: '07223-222448' },
      { name: 'Municipal Council Anjangaon Surji', detail: 'Anjangaon Surji – 444705', phone: '07224-242042' },
      { name: 'Municipal Council Chandur Railway', detail: 'Chandur Railway – 444904', phone: '07222-254058' },
      { name: 'Municipal Council Chandurbazar', detail: 'Chandurbazar – 444704', phone: '07227-243211' },
      { name: 'Municipal Council Chikhaldara', detail: 'Chikhaldara – 444807', phone: '07220-230248' },
      { name: 'Municipal Council Daryapur', detail: 'Daryapur – 444803', phone: '07224-234237' },
      { name: 'Municipal Council Dhamangaon Railway', detail: 'Dhamangaon Railway – 444709', phone: '07222-237050' },
      { name: 'Municipal Council Morshi', detail: 'Morshi – 444702', phone: '07228-222249' },
      { name: 'Municipal Council Shendurjana Ghat', detail: 'Shendurjana Ghat – 444907', phone: '07229-238121' },
      { name: 'Municipal Council Warud', detail: 'Warud – 444906', phone: '07229-232020' },
      { name: 'Municipal Panchayat Bhatkuli', detail: 'Bhatkuli – 444602', phone: '' },
      { name: 'Municipal Panchayat Dharni', detail: 'Dharni – 444702', phone: '' },
      { name: 'Municipal Panchayat Nandgaon-Khandeshwar', detail: 'Nandgaon-Khandeshwar – 444708', phone: '' },
      { name: 'Municipal Panchayat Teosa', detail: 'Teosa – 444903', phone: '' },
    ],
  },
  {
    id: 'banks',
    icon: '🏦',
    label: 'Banks',
    labelMr: 'बँका',
    labelHi: 'बैंक',
    count: 10,
    color: '#6b7280',
    items: [
      { name: 'Axis Bank', detail: 'Gulshan Tower, Mofussil Plots, Near Panchsheel Talkies, NH No. 6, Near Jaistambh Chowk', phone: '' },
      { name: 'Bank of India', detail: 'Jaistambh Chowk, Amravati – 444601', phone: '' },
      { name: 'Bank of Maharashtra', detail: 'Smt M Kastures Bldg, Rukmini Nagar Square Rd, Amravati 444602', phone: '' },
      { name: 'Central Bank of India (Sahakar Bhavan)', detail: 'Sahakar Bhavan, Morshi Road, Amravati', phone: '' },
      { name: 'Central Bank of India (Cotton Market)', detail: 'Kakani Oil Mill Compound, Dharamdya Cotton Mkt. Road', phone: '' },
      { name: 'HDFC Bank', detail: 'Rasik Plaza, Jai Stambh Square, Morshi Road, Amravati', phone: '' },
      { name: 'ICICI Bank', detail: 'Ground Floor, Vimaco Towers, Bus Stand Road, Amravati', phone: '' },
      { name: 'State Bank of India (Tapowan)', detail: 'Old Biyani College Road, Tapowan Road, Distt Amravati', phone: '' },
      { name: 'State Bank of India (Shyam Talkies)', detail: 'Nr. Shyam Talkies, Amravati', phone: '' },
      { name: 'Union Bank of India', detail: 'Tank Complex, 1st Floor, Rajkamal Square, PB No. 7, Amravati', phone: '' },
    ],
  },
];

export default function LandingPage({ darkMode, setDarkMode }) {
  const { language, changeLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeUtility, setActiveUtility] = useState(null);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">🤖</span>
          <span className="landing-logo-text">Ai Sathi</span>
        </div>
        <div className="landing-nav-actions">
          <div className="lang-dropdown-container">
            <button
              className="landing-icon-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
            >
              <Globe size={20} />
            </button>
            {langDropdownOpen && (
              <div className="lang-dropdown-menu mobile-lang-dropdown">
                <button onClick={() => { changeLanguage('en'); setLangDropdownOpen(false); }} className={language === 'en' ? 'active' : ''}>English</button>
                <button onClick={() => { changeLanguage('hi'); setLangDropdownOpen(false); }} className={language === 'hi' ? 'active' : ''}>हिन्दी</button>
                <button onClick={() => { changeLanguage('mr'); setLangDropdownOpen(false); }} className={language === 'mr' ? 'active' : ''}>मराठी</button>
              </div>
            )}
          </div>
          <button className="landing-icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="landing-hero">
        {/* Left Content */}
        <div className="landing-content">
          <div className="landing-pill animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <Sparkles size={14} />
            {language === 'mr' ? 'स्मार्ट शहरांचे भविष्य' : language === 'hi' ? 'स्मार्ट शहरों का भविष्य' : 'Future of Smart Cities'}
          </div>

          <h1 className="landing-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {language === 'mr' ? 'स्मार्ट अमरावतीचे भविष्य' : language === 'hi' ? 'स्मार्ट अमरावती का भविष्य' : 'Future of Smart Amravati'} <br />
            <span className="text-gradient">
              {language === 'mr' ? 'येथून सुरू होते' : language === 'hi' ? 'यहाँ से शुरू होता है' : 'Starts Here'}
            </span>
          </h1>

          <p className="landing-subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {language === 'mr'
              ? 'सार्वजनिक सेवा, नेव्हिगेशन, स्थानिक व्यवसाय आणि बरेच काही यासाठी रिअल-टाइम AI-सक्षम स्मार्ट सिटी असिस्टंट प्लॅटफॉर्म.'
              : language === 'hi'
              ? 'सार्वजनिक सेवाओं, नेविगेशन, स्थानीय व्यवसायों और बहुत कुछ के लिए एक वास्तविक समय एआई-संचालित स्मार्ट सिटी सहायक मंच।'
              : 'A real-time AI-powered smart city assistant platform for public services, navigation, local businesses, and more.'}
          </p>

          <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard" className="landing-btn primary">
              {language === 'mr' ? 'सुरुवात करा' : language === 'hi' ? 'शुरू करें' : 'Get Started'} <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="landing-btn secondary">
              {language === 'mr' ? 'AI शी बोला' : language === 'hi' ? 'एआई से बात करें' : 'Talk to AI'}
            </Link>
          </div>
        </div>

        {/* Right Visuals — Spline 3D + floating cards overlay */}
        <div className="landing-visuals animate-fade-in-up" style={{ animationDelay: '400ms' }}>

          {/* Glowing background orange orb */}
          <div className="glowing-orb"></div>

          {/* ── 3D Spline Scene ── */}
          <div className="spline-hero-container">
            <SplineScene scene={SPLINE_SCENE_URL} />
          </div>

          {/* ── Floating Glass Cards (overlaid on top of Spline) ── */}
          <div className="cards-group cards-group--overlay">
            {/* Chat card */}
            <div className="floating-card chat-card">
              <div className="card-header-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="chat-bubble bot">
                {language === 'mr' ? 'नमस्कार! मी तुम्हाला कशी मदत करू शकेन?' : language === 'hi' ? 'नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?' : 'Hello! How can I help you today?'}
              </div>
              <div className="chat-bubble user">
                {language === 'mr' ? 'जवळचे रुग्णालये शोधा' : language === 'hi' ? 'निकटतम अस्पताल खोजें' : 'Find nearby hospitals'}
              </div>
            </div>

            {/* Mic card */}
            <div className="floating-card mic-card">
              <Mic size={24} color="#ff6d00" />
              <div className="voice-waves">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            {/* Location card */}
            <div className="floating-card location-card">
              <div className="loc-icon">
                <MapPin size={24} color="#ff6d00" />
              </div>
              <div className="loc-info">
                <h4>
                  {language === 'mr' ? 'इर्विन हॉस्पिटल' : language === 'hi' ? 'इरविन अस्पताल' : 'Irwin Hospital'}
                </h4>
                <p>
                  {language === 'mr' ? '२.४ किमी दूर' : language === 'hi' ? '२.४ किमी दूर' : '2.4 km away'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Government Officials Section ── */}
      <section className="officials-section animate-fade-in-up">
        <div className="officials-header">
          <div className="officials-badge">
            🏛️ {language === 'mr' ? 'शासकीय संस्था' : language === 'hi' ? 'सरकारी निकाय' : 'Government Bodies'}
          </div>
          <h2 className="officials-title">
            {language === 'mr'
              ? 'अमरावतीचे सरकारी अधिकारी'
              : language === 'hi'
              ? 'अमरावती के सरकारी अधिकारी'
              : 'Government Bodies & Officials of Amravati'}
          </h2>
          <p className="officials-subtitle">
            {language === 'mr'
              ? 'जिल्ह्यातील प्रमुख लोकप्रतिनिधी व प्रशासकीय अधिकारी'
              : language === 'hi'
              ? 'जिले के प्रमुख जनप्रतिनिधि एवं प्रशासनिक अधिकारी'
              : 'Key elected representatives and administrative officers of the district'}
          </p>
        </div>

        <div className="officials-table-wrap">
          <table className="officials-table">
            <thead>
              <tr>
                <th className="col-sr">#</th>
                <th className="col-name">{language === 'mr' ? 'नाव' : language === 'hi' ? 'नाम' : 'Name'}</th>
                <th className="col-desig">{language === 'mr' ? 'पदनाम' : language === 'hi' ? 'पदनाम' : 'Designation'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1,  name: 'Chandrashekhar Bawankule',       desig: 'Guardian Minister' },
                { id: 2,  name: 'Balwant Baswant Wankhade',        desig: 'MP (Khasdar)' },
                { id: 3,  name: 'Smt. Sulbha Sanjay Khodke',       desig: 'MLA (Amdar)' },
                { id: 4,  name: 'Shrichand Tejwani',                desig: 'Mayor (Mahapaur)' },
                { id: 5,  name: 'Sachin Bhende',                    desig: 'Deputy Mayor' },
                { id: 6,  name: 'Shri. Ashish Yerekar, IAS',       desig: 'Collector, Amravati' },
                { id: 7,  name: 'Shri. Govinda Pandurang Danej',   desig: 'Additional Collector' },
                { id: 8,  name: 'Shri. Santosh Kakde',             desig: 'Resident Deputy Collector' },
                { id: 9,  name: 'Shri. Shivaji Shinde',            desig: 'Dy. Collector, Election' },
                { id: 10, name: 'Sh. Rakesh Ola, IPS',             desig: 'Commissioner of Police, Amravati City' },
                { id: 11, name: 'Shri. Niketan Kadam (IPS)',        desig: 'Superintendent of Police, Amravati (Rural)' },
                { id: 12, name: 'Shri. Satyam Gandhi (IAS)',        desig: 'Chief Executive Officer, ZP, Amravati' },
                { id: 13, name: 'Smt. Shraddha Udavant',           desig: 'District Resettlement Officer' },
                { id: 14, name: 'Smt. Sushma Chaudhary',           desig: 'Dy. Collector, L.A.O. MIW' },
                { id: 15, name: 'Shri. Vivek Jadhav',              desig: 'Dy. Collector, Revenue' },
                { id: 16, name: 'Smt. Durga Devre',                desig: 'Dy. Collector, L.A.O. 2' },
                { id: 17, name: 'Shri. Prasannajit Chavan',        desig: 'Dy. Collector, L.A.O. 4' },
                { id: 18, name: 'Shri. Ninad Lande',               desig: 'District Supply Officer' },
                { id: 19, name: 'Shri. Dnyaneshwar Ghyar',         desig: 'Dy. Collector, E.G.S' },
                { id: 20, name: 'Shri. P.O. Raut',                 desig: 'Food Distribution Officer' },
                { id: 21, name: 'Shri. Nilesh Khatke',             desig: 'Superintendent' },
                { id: 22, name: 'Smt. Bhagyshree Deshmukh',        desig: 'Tehsildar Nazul' },
                { id: 23, name: 'Smt. Pranita Chaple',             desig: 'District Mining Officer' },
                { id: 24, name: 'Shri. Vikas Khandare',            desig: 'Joint Commissioner, Urban Development Dept.' },
                { id: 25, name: 'Shri. Ravindra Thakre',           desig: 'State Information Commissioner' },
                { id: 26, name: 'Shri. Narendra Bohara',           desig: 'Law Officer' },
                { id: 27, name: 'Shri. Sahaberao Dutode',          desig: 'Deputy Inspector General of Registration' },
                { id: 28, name: 'Dr. Narukullarambabu',            desig: 'Commissioner, State Public Service Rights Commission, Amravati' },
                { id: 29, name: 'Smt. Priya Tilakunthe',           desig: 'Joint Director Accounts and Treasury' },
                { id: 30, name: 'Smt. Shilpa Pawar',               desig: 'District Treasury Officer / Asst. District Treasury Officer' },
                { id: 31, name: 'Shri. Goswami',                   desig: 'District Project Manager' },
              ].map((row) => (
                <tr key={row.id} className="officials-row">
                  <td className="col-sr">{row.id}</td>
                  <td className="col-name">
                    <div className="official-name-cell">
                      <div className="official-avatar">{row.name.trim()[0]}</div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="col-desig">
                    <span className="desig-badge">{row.desig}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="officials-footer-note">
          {language === 'mr'
            ? '* माहिती शासनाच्या अधिकृत नोंदीनुसार आहे'
            : language === 'hi'
            ? '* जानकारी सरकारी आधिकारिक अभिलेखों के अनुसार है'
            : '* Information as per official government records'}
        </p>
      </section>

      {/* ── Public Utilities Section ── */}
      <section className="utilities-section animate-fade-in-up">
        <div className="utilities-header">
          <h2 className="utilities-main-title">
            {language === 'mr' ? 'सार्वजनिक सुविधा' : language === 'hi' ? 'सार्वजनिक उपयोगिताएँ' : 'PUBLIC UTILITIES'}
          </h2>
        </div>

        <div className="utilities-grid">
          {UTILITIES.map((util) => (
            <button
              key={util.id}
              className={`utility-row ${activeUtility === util.id ? 'active' : ''}`}
              onClick={() => setActiveUtility(activeUtility === util.id ? null : util.id)}
              style={{ '--util-color': util.color }}
            >
              <span className="utility-label">
                {util.icon}&nbsp;
                {language === 'mr' ? util.labelMr : language === 'hi' ? util.labelHi : util.label}
              </span>
              <span className="utility-line" />
              <span className="utility-count" style={{ background: util.color }}>
                {util.count}
              </span>
            </button>
          ))}
        </div>

        {/* Expanded Detail Panel */}
        {activeUtility && (() => {
          const util = UTILITIES.find(u => u.id === activeUtility);
          return (
            <div className="utility-detail-panel" style={{ '--util-color': util.color }}>
              <div className="udp-header">
                <span className="udp-icon">{util.icon}</span>
                <div>
                  <h3 className="udp-title">
                    {language === 'mr' ? util.labelMr : language === 'hi' ? util.labelHi : util.label}
                  </h3>
                  <span className="udp-count-pill" style={{ background: util.color }}>
                    {util.count} {language === 'mr' ? 'एकूण' : language === 'hi' ? 'कुल' : 'Total'}
                  </span>
                </div>
                <button className="udp-close" onClick={() => setActiveUtility(null)}>✕</button>
              </div>
              <div className="udp-items">
                {util.items.map((item, idx) => (
                  <div key={idx} className="udp-item">
                    <div className="udp-item-num" style={{ background: util.color }}>{idx + 1}</div>
                    <div className="udp-item-info">
                      <strong>{item.name}</strong>
                      <span>{item.detail}</span>
                      {item.phone && (
                        <a href={`tel:${item.phone}`} className="udp-phone">📞 {item.phone}</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Background Elements */}
      <div className="landing-bg-grid"></div>
    </div>
  );
}
