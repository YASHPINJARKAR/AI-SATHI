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
      { 
        name: 'Mahavitaran Camp', 
        nameMr: 'महावितरण कॅम्प',
        nameHi: 'महावितरण कैंप',
        detail: 'Mahavitaran Camp, Amravati – 444602', 
        detailMr: 'महावितरण कॅम्प, अमरावती – ४४४६०२',
        detailHi: 'महावितरण कैंप, अमरावती – 444602',
        phone: '0721-2662467' 
      },
      { 
        name: 'Mahavitaran Cotton Market Road', 
        nameMr: 'महावितरण कॉटन मार्केट रोड',
        nameHi: 'महावितरण कॉटन मार्केट रोड',
        detail: 'Mahavitaran Cotton Market Road, Amravati – 444601', 
        detailMr: 'महावितरण कॉटन मार्केट रोड, अमरावती – ४४४६०१',
        detailHi: 'महावितरण कॉटन मार्केट रोड, अमरावती – 444601',
        phone: '' 
      },
      { 
        name: 'Mahavitaran Gadgenagar', 
        nameMr: 'महावितरण गाडगेनगर',
        nameHi: 'महावितरण गाडगेनगर',
        detail: 'Mahavitaran Gadgenagar, Amravati – 444603', 
        detailMr: 'महावितरण गाडगेनगर, अमरावती – ४४४६०३',
        detailHi: 'महावितरण गाडगेनगर, अमरावती – 444603',
        phone: '0721-2661699' 
      },
      { 
        name: 'Mahavitaran Jawahar Gate', 
        nameMr: 'महावितरण जवाहर गेट',
        nameHi: 'महावितरण जवाहर गेट',
        detail: 'Mahavitaran Jawahar Gate, Amravati – 444601', 
        detailMr: 'महावितरण जवाहर गेट, अमरावती – ४४४६०१',
        detailHi: 'महावितरण जवाहर गेट, अमरावती – 444601',
        phone: '' 
      },
      { 
        name: 'Mahavitaran Rajapeth', 
        nameMr: 'महावितरण राजापेठ',
        nameHi: 'महावितरण राजापेठ',
        detail: 'Mahavitaran Rajapeth, Rajapeth, Amravati – 444601', 
        detailMr: 'महावितरण राजापेठ, अमरावती – ४४४६०१',
        detailHi: 'महावितरण राजापेठ, अमरावती – 444601',
        phone: '' 
      },
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
      { name: 'Achalpur', nameMr: 'अचलपूर', nameHi: 'अचलपुर', detail: 'Pin Code – 444806', detailMr: 'पिन कोड – ४४४८०६', detailHi: 'पिन कोड – 444806', phone: '' },
      { name: 'Amravati', nameMr: 'अमरावती', nameHi: 'अमरावती', detail: 'Pin Code – 444601', detailMr: 'पिन कोड – ४४४६०१', detailHi: 'पिन कोड – 444601', phone: '' },
      { name: 'Anjangaon Surji', nameMr: 'अंजनगाव सुर्जी', nameHi: 'अंजनगांव सुर्जी', detail: 'Pin Code – 444705', detailMr: 'पिन कोड – ४४४७०५', detailHi: 'पिन कोड – 444705', phone: '' },
      { name: 'Bhatkuli', nameMr: 'भातकुली', nameHi: 'भातकुली', detail: 'Pin Code – 444602', detailMr: 'पिन कोड – ४४४६०२', detailHi: 'पिन कोड – 444602', phone: '' },
      { name: 'Chandur Railway', nameMr: 'चांदूर रेल्वे', nameHi: 'चांदूर रेलवे', detail: 'Pin Code – 444904', detailMr: 'पिन कोड – ४४४९०४', detailHi: 'पिन कोड – 444904', phone: '' },
      { name: 'Chandurbazar', nameMr: 'चांदूरबाजार', nameHi: 'चांदूरबाजार', detail: 'Pin Code – 444704', detailMr: 'पिन कोड – ४४४७०४', detailHi: 'पिन कोड – 444704', phone: '' },
      { name: 'Chikhaldara', nameMr: 'चिखलदरा', nameHi: 'चिखलदरा', detail: 'Pin Code – 444807', detailMr: 'पिन कोड – ४४४८०७', detailHi: 'पिन कोड – 444807', phone: '' },
      { name: 'Daryapur', nameMr: 'दर्यापूर', nameHi: 'दर्यापुर', detail: 'Pin Code – 444803', detailMr: 'पिन कोड – ४४४८०३', detailHi: 'पिन कोड – 444803', phone: '' },
      { name: 'Dhamangaon Railway', nameMr: 'धामणगाव रेल्वे', nameHi: 'धामनगांव रेलवे', detail: 'Pin Code – 444709', detailMr: 'पिन कोड – ४४४७०९', detailHi: 'पिन कोड – 444709', phone: '' },
      { name: 'Dharni', nameMr: 'धारणी', nameHi: 'धारणी', detail: 'Pin Code – 444702', detailMr: 'पिन कोड – ४४४७०२', detailHi: 'पिन कोड – 444702', phone: '' },
      { name: 'Morshi', nameMr: 'मोर्शी', nameHi: 'मोर्शी', detail: 'Pin Code – 444905', detailMr: 'पिन कोड – ४४४९०५', detailHi: 'पिन कोड – 444905', phone: '' },
      { name: 'Nandgaon-Khandeshwar', nameMr: 'नांदगाव-खंडेश्वर', nameHi: 'नांदगांव-खंडेश्वर', detail: 'Pin Code – 444708', detailMr: 'पिन कोड – ४४४७०८', detailHi: 'पिन कोड – 444708', phone: '' },
      { name: 'Tiosa', nameMr: 'तिवसा', nameHi: 'तिवसा', detail: 'Pin Code – 444903', detailMr: 'पिन कोड – ४४४९०३', detailHi: 'पिन कोड – 444903', phone: '' },
      { name: 'Warud', nameMr: 'वरुड', nameHi: 'वरुड', detail: 'Pin Code – 444906', detailMr: 'पिन कोड – ४४४९०६', detailHi: 'पिन कोड – 444906', phone: '' },
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
      { name: 'Municipal Corporation, Amravati', nameMr: 'अमरावती महानगरपालिका', nameHi: 'अमरावती नगर निगम', detail: 'Amravati – 444601', detailMr: 'अमरावती – ४४४६०१', detailHi: 'अमरावती – 444601', phone: '0721-2561569' },
      { name: 'Municipal Council Achalpur', nameMr: 'अचलपूर नगर परिषद', nameHi: 'अचलपुर नगर परिषद', detail: 'Achalpur – 444806', detailMr: 'अचलपूर – ४४४८०६', detailHi: 'अचलपुर – 444806', phone: '07223-222448' },
      { name: 'Municipal Council Anjangaon Surji', nameMr: 'अंजनगाव सुर्जी नगर परिषद', nameHi: 'अंजनगांव सुर्जी नगर परिषद', detail: 'Anjangaon Surji – 444705', detailMr: 'अंजनगाव सुर्जी – ४४४७०५', detailHi: 'अंजनगांव सुर्जी – 444705', phone: '07224-242042' },
      { name: 'Municipal Council Chandur Railway', nameMr: 'चांदूर रेल्वे नगर परिषद', nameHi: 'चांदूर रेलवे नगर परिषद', detail: 'Chandur Railway – 444904', detailMr: 'चांदूर रेल्वे – ४४४९०४', detailHi: 'चांदूर रेलवे – 444904', phone: '07222-254058' },
      { name: 'Municipal Council Chandurbazar', nameMr: 'चांदूरबाजार नगर परिषद', nameHi: 'चांदूरबाजार नगर परिषद', detail: 'Chandurbazar – 444704', detailMr: 'चांदूरबाजार – ४४४७०४', detailHi: 'चांदूरबाजार – 444704', phone: '07227-243211' },
      { name: 'Municipal Council Chikhaldara', nameMr: 'चिखलदरा नगर परिषद', nameHi: 'चिखलदरा नगर परिषद', detail: 'Chikhaldara – 444807', detailMr: 'चिखलदरा – ४४४८०७', detailHi: 'चikhaldara – 444807', phone: '07220-230248' },
      { name: 'Municipal Council Daryapur', nameMr: 'दर्यापूर नगर परिषद', nameHi: 'दर्यापुर नगर परिषद', detail: 'Daryapur – 444803', detailMr: 'दर्यापूर – ४४४८०३', detailHi: 'दर्यापुर – 444803', phone: '07224-234237' },
      { name: 'Municipal Council Dhamangaon Railway', nameMr: 'धामणगाव रेल्वे नगर परिषद', nameHi: 'धामनगांव रेलवे नगर परिषद', detail: 'Dhamangaon Railway – 444709', detailMr: 'धामणगाव रेल्वे – ४४४७०९', detailHi: 'धामनगांव रेलवे – 444709', phone: '07222-237050' },
      { name: 'Municipal Council Morshi', nameMr: 'मोर्शी नगर परिषद', nameHi: 'मोर्शी नगर परिषद', detail: 'Morshi – 444702', detailMr: 'मोर्शी – ४४४७०२', detailHi: 'मोर्शी – 444702', phone: '07228-222249' },
      { name: 'Municipal Council Shendurjana Ghat', nameMr: 'शेंदुरजना घाट नगर परिषद', nameHi: 'शेंदुरजना घाट नगर परिषद', detail: 'Shendurjana Ghat – 444907', detailMr: 'शेंदुरजना घाट – ४४४९०७', detailHi: 'शेंदुरजना घाट – 444907', phone: '07229-238121' },
      { name: 'Municipal Council Warud', nameMr: 'वरुड नगर परिषद', nameHi: 'वरुड नगर परिषद', detail: 'Warud – 444906', detailMr: 'वरुड – ४४४९०६', detailHi: 'वरुड – 444906', phone: '07229-232020' },
      { name: 'Municipal Panchayat Bhatkuli', nameMr: 'भातकुली नगर पंचायत', nameHi: 'भातकुली नगर पंचायत', detail: 'Bhatkuli – 444602', detailMr: 'भातकुली – ४४४६०२', detailHi: 'भातकुली – 444602', phone: '' },
      { name: 'Municipal Panchayat Dharni', nameMr: 'धारणी नगर पंचायत', nameHi: 'धारणी नगर पंचायत', detail: 'Dharni – 444702', detailMr: 'धारणी – ४४४७०२', detailHi: 'धारणी – 444702', phone: '' },
      { name: 'Municipal Panchayat Nandgaon-Khandeshwar', nameMr: 'नांदगाव-खंडेश्वर नगर पंचायत', nameHi: 'नांदगांव-खंडेश्वर नगर पंचायत', detail: 'Nandgaon-Khandeshwar – 444708', detailMr: 'नांदगाव-खंडेश्वर – ४४४७०८', detailHi: 'नांदगांव-खंडेश्वर – 444708', phone: '' },
      { name: 'Municipal Panchayat Teosa', nameMr: 'तिवसा नगर पंचायत', nameHi: 'तिवसा नगर पंचायत', detail: 'Teosa – 444903', detailMr: 'तिवसा – ४४४९०३', detailHi: 'तिवसा – 444903', phone: '' },
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
      { name: 'Axis Bank', nameMr: 'ॲक्सिस बँक', nameHi: 'एक्सिस बैंक', detail: 'Gulshan Tower, Mofussil Plots, Near Panchsheel Talkies, NH No. 6, Near Jaistambh Chowk', detailMr: 'गुलशन टॉवर, मोफ्युसिल प्लॉट्स, पंचशील टॉकीज जवळ, एनएच ६, जयस्तंभ चौक जवळ', detailHi: 'गुलशन टॉवर, मोफ्यूसिल प्लॉट्स, पंचशील टॉकीज के पास, एनएच 6, जयस्तंभ चौक के पास', phone: '' },
      { name: 'Bank of India', nameMr: 'बँक ऑफ इंडिया', nameHi: 'बैंक ऑफ इंडिया', detail: 'Jaistambh Chowk, Amravati – 444601', detailMr: 'जयस्तंभ चौक, अमरावती – ४४४६०१', detailHi: 'जयस्तंभ चौक, अमरावती – 444601', phone: '' },
      { name: 'Bank of Maharashtra', nameMr: 'बँक ऑफ महाराष्ट्र', nameHi: 'बैंक ऑफ महाराष्ट्र', detail: 'Smt M Kastures Bldg, Rukmini Nagar Square Rd, Amravati 444602', detailMr: 'श्रीमती एम कस्तुरे इमारत, रुक्मिणी नगर स्क्वेअर रोड, अमरावती ४४४६०२', detailHi: 'श्रीमती एम कस्तुरे बिल्डिंग, रुक्मिणी नगर स्क्वायर रोड, अमरावती 444602', phone: '' },
      { name: 'Central Bank of India (Sahakar Bhavan)', nameMr: 'सेंट्रल बँक ऑफ इंडिया (सहकार भवन)', nameHi: 'सेंट्रल बैंक ऑफ इंडिया (सहकार भवन)', detail: 'Sahakar Bhavan, Morshi Road, Amravati', detailMr: 'सहकार भवन, मोर्शी रोड, अमरावती', detailHi: 'सहकार भवन, मोर्शी रोड, अमरावती', phone: '' },
      { name: 'Central Bank of India (Cotton Market)', nameMr: 'सेंट्रल बँक ऑफ इंडिया (कॉटन मार्केट)', nameHi: 'सेंट्रल बैंक ऑफ इंडिया (कॉटन मार्केट)', detail: 'Kakani Oil Mill Compound, Dharamdya Cotton Mkt. Road', detailMr: 'काकाणी ऑईल मिल कंपाउंड, धरमद्या कॉटन मार्केट रोड', detailHi: 'काकानी ऑयल मिल कंपाउंड, धरमद्या कॉटन मार्केट रोड', phone: '' },
      { name: 'HDFC Bank', nameMr: 'एचडीएफसी बँक', nameHi: 'एचडीएफसी बैंक', detail: 'Rasik Plaza, Jai Stambh Square, Morshi Road, Amravati', detailMr: 'रसिक प्लाझा, जयस्तंभ चौक, मोर्शी रोड, अमरावती', detailHi: 'रसिक प्लाजा, जयस्तंभ स्क्वायर, मोर्शी रोड, अमरावती', phone: '' },
      { name: 'ICICI Bank', nameMr: 'आयसीआयसीआय बँक', nameHi: 'आईसीआईसीआई बैंक', detail: 'Ground Floor, Vimaco Towers, Bus Stand Road, Amravati', detailMr: 'पहिला मजला, विमाको टॉवर्स, बस स्टँड रोड, अमरावती', detailHi: 'ग्राउंड फ्लोर, विमाको टॉवर्स, बस स्टैंड रोड, अमरावती', phone: '' },
      { name: 'State Bank of India (Tapowan)', nameMr: 'स्टेट बँक ऑफ इंडिया (तपोवन)', nameHi: 'स्टेट बैंक ऑफ इंडिया (तपोवन)', detail: 'Old Biyani College Road, Tapowan Road, Distt Amravati', detailMr: 'ओल्ड बियाणी कॉलेज रोड, तपोवन रोड, अमरावती', detailHi: 'ओल्ड बियाणी कॉलेज रोड, तपोवन रोड, अमरावती', phone: '' },
      { name: 'State Bank of India (Shyam Talkies)', nameMr: 'स्टेट बँक ऑफ इंडिया (श्याम टॉकीज)', nameHi: 'स्टेट बैंक ऑफ इंडिया (श्याम टॉकीज)', detail: 'Nr. Shyam Talkies, Amravati', detailMr: 'श्याम टॉकीज जवळ, अमरावती', detailHi: 'श्याम टॉकीज के पास, अमरावती', phone: '' },
      { name: 'Union Bank of India', nameMr: 'युनियन बँक ऑफ इंडिया', nameHi: 'यूनियन बैंक ऑफ इंडिया', detail: 'Tank Complex, 1st Floor, Rajkamal Square, PB No. 7, Amravati', detailMr: 'टँक कॉम्प्लेक्स, पहिला मजला, राजकमल चौक, पीबी नं. ७, अमरावती', detailHi: 'टैंक कॉम्प्लेक्स, पहली मंजिल, राजकमल स्क्वायर, पीबी नंबर 7, अमरावती', phone: '' },
    ],
  },
];

export default function LandingPage({ darkMode, setDarkMode }) {
  const { language, changeLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeUtility, setActiveUtility] = useState(null);

  // ─── 3D Map Interactive States & Handlers ───
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  const [tiltEnabled, setTiltEnabled] = useState(true);

  // 3D Tilt Hover Effect
  const handleMouseMove = (e) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    // Calculate rotation angles (max 15 degrees)
    const rotateY = normalizedX * 20; 
    const rotateX = -normalizedY * 20; // Invert to tilt towards cursor

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
    setIsDragging(false);
  };

  // Drag to Pan
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Bound the pan based on zoom level to keep map in view bounds
    const maxPan = (zoom - 1) * 300;
    setPan({
      x: Math.max(-maxPan - 150, Math.min(maxPan + 150, newX)),
      y: Math.max(-maxPan - 150, Math.min(maxPan + 150, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor) => {
    setZoom(prev => Math.max(1, Math.min(4, prev * factor)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

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

      {/* ── Interactive 3D Map Section ── */}
      <section className="map-3d-section animate-fade-in-up">
        <div className="map-3d-header">
          <div className="map-3d-badge">
            🗺️ {language === 'mr' ? '३डी संवादात्मक नकाशा' : language === 'hi' ? '3डी इंटरैक्टिव मानचित्र' : '3D Interactive Map'}
          </div>
          <h2 className="map-3d-title">
            {language === 'mr'
              ? 'अमरावती ३डी शहर नकाशा'
              : language === 'hi'
              ? 'अमरावती 3डी शहर मानचित्र'
              : 'Amravati 3D Interactive Map'}
          </h2>
          <p className="map-3d-subtitle">
            {language === 'mr'
              ? '३डी मॉडेलप्रमाणे नकाशा फिरवा. फिरवण्यासाठी माऊस फिरवा, पॅन करण्यासाठी ड्रॅग करा आणि झूम करा.'
              : language === 'hi'
              ? '3डी मॉडल की तरह मानचित्र घुमाएँ। घुमाने के लिए माउस हिलाएं, पैन करने के लिए खींचें और ज़ूम करें।'
              : 'Interact with the map like a 3D model. Move cursor to tilt/rotate, drag to pan, and zoom to explore sectors.'}
          </p>
        </div>

        <div className="map-3d-container">
          <div 
            className={`map-3d-card ${tilt.active ? 'is-tilting' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onMouseMove={(e) => {
              if (isDragging) {
                handleDragMove(e);
              } else {
                handleMouseMove(e);
              }
            }}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
              transition: tilt.active || isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Holographic light reflect overlay */}
            <div 
              className="map-3d-glare"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)`,
                opacity: tilt.active ? 1 : 0,
                transition: tilt.active ? 'none' : 'opacity 0.5s ease'
              }}
            />

            {/* Inner Map viewport */}
            <div className="map-3d-viewport">
              <img 
                src="/amravati_map.png.png" 
                alt="Amravati 3D Map" 
                className="map-3d-image"
                draggable="false"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              />
            </div>

            {/* Futuristic Tech frame borders and details */}
            <div className="map-3d-frame-top-left"></div>
            <div className="map-3d-frame-top-right"></div>
            <div className="map-3d-frame-bottom-left"></div>
            <div className="map-3d-frame-bottom-right"></div>

            {/* Floating Markers / Sectors on top of the 3D surface */}
            <div className="map-3d-overlay-ui">
              <div className="map-hud-title">AMRAVATI SYS_MAP_v1.0</div>
              <div className="map-hud-coordinate">LAT: 20.9320° N | LON: 77.7523° E</div>
            </div>
          </div>

          {/* Interactive HUD Control Panel */}
          <div className="map-3d-controls">
            <button className="map-control-btn" onClick={() => handleZoom(1.2)} title="Zoom In">
              ➕ {language === 'mr' ? 'झूम वाढवा' : language === 'hi' ? 'ज़ूम बढ़ाएं' : 'Zoom In'}
            </button>
            <button className="map-control-btn" onClick={() => handleZoom(0.8)} title="Zoom Out">
              ➖ {language === 'mr' ? 'झूम कमी करा' : language === 'hi' ? 'ज़ूम कम करें' : 'Zoom Out'}
            </button>
            <button className={`map-control-btn ${tiltEnabled ? 'active' : ''}`} onClick={() => setTiltEnabled(!tiltEnabled)}>
              🕶️ {tiltEnabled ? (language === 'mr' ? '३डी सक्रिय' : language === 'hi' ? '3डी सक्रिय' : '3D Active') : (language === 'mr' ? '३डी बंद' : language === 'hi' ? '3डी बंद' : '3D Off')}
            </button>
            <button className="map-control-btn reset" onClick={handleReset}>
              🔄 {language === 'mr' ? 'रीसेट' : language === 'hi' ? 'रीसेट' : 'Reset'}
            </button>
          </div>
        </div>
      </section>

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
                { id: 1,  name: 'Chandrashekhar Bawankule', nameMr: 'चंद्रशेखर बावनकुळे', nameHi: 'चंद्रशेखर बावनकुले', desig: 'Guardian Minister', desigMr: 'पालकमंत्री', desigHi: 'संरक्षक मंत्री (पालक मंत्री)' },
                { id: 2,  name: 'Balwant Baswant Wankhade', nameMr: 'बळवंत बसवंत वानखडे', nameHi: 'बलवंत बसवंत वानखड़े', desig: 'MP (Khasdar)', desigMr: 'खासदार', desigHi: 'सांसद (खासदार)' },
                { id: 3,  name: 'Smt. Sulbha Sanjay Khodke', nameMr: 'श्रीमती सुलभा संजय खोडके', nameHi: 'श्रीमती सुलभा संजय खोडके', desig: 'MLA (Amdar)', desigMr: 'आमदार', desigHi: 'विधायक (आमदार)' },
                { id: 4,  name: 'Shrichand Tejwani', nameMr: 'श्रीचंद तेजवाणी', nameHi: 'श्रीचंद तेजवानी', desig: 'Mayor (Mahapaur)', desigMr: 'महापौर', desigHi: 'महापौर' },
                { id: 5,  name: 'Sachin Bhende', nameMr: 'सचिन भेंडे', nameHi: 'सचिन भेंडे', desig: 'Deputy Mayor', desigMr: 'उपमहापौर', desigHi: 'उपमहापौर' },
                { id: 6,  name: 'Shri. Ashish Yerekar, IAS', nameMr: 'श्री. आशिष येरेकर, आय.ए.एस.', nameHi: 'श्री आशीष येरेकर, आईएएस', desig: 'Collector, Amravati', desigMr: 'जिल्हाधिकारी, अमरावती', desigHi: 'जिलाधिकारी, अमरावती' },
                { id: 7,  name: 'Shri. Govinda Pandurang Danej', nameMr: 'श्री. गोविंद पांडुरंग दानेज', nameHi: 'श्री गोविंद पांडुरंग दानेज', desig: 'Additional Collector', desigMr: 'अप्पर जिल्हाधिकारी', desigHi: 'अतिरिक्त जिलाधिकारी' },
                { id: 8,  name: 'Shri. Santosh Kakde', nameMr: 'श्री. संतोष काकडे', nameHi: 'श्री संतोष काकडे', desig: 'Resident Deputy Collector', desigMr: 'निवासी उपजिल्हाधिकारी', desigHi: 'निवासी उपजिलाधिकारी' },
                { id: 9,  name: 'Shri. Shivaji Shinde', nameMr: 'श्री. शिवाजी शिंदे', nameHi: 'श्री शिवाजी शिंदे', desig: 'Dy. Collector, Election', desigMr: 'उपजिल्हाधिकारी, निवडणूक', desigHi: 'उपजिलाधिकारी, चुनाव' },
                { id: 10, name: 'Sh. Rakesh Ola, IPS', nameMr: 'श्री. राकेश ओला, आय.पी.एस.', nameHi: 'श्री राकेश ओला, आईपीएस', desig: 'Commissioner of Police, Amravati City', desigMr: 'पोलीस आयुक्त, अमरावती शहर', desigHi: 'पुलिस आयुक्त, अमरावती शहर' },
                { id: 11, name: 'Shri. Niketan Kadam (IPS)', nameMr: 'श्री. निकेतन कदम (आय.पी.एस.)', nameHi: 'श्री निकेतन कदम (आईपीएस)', desig: 'Superintendent of Police, Amravati (Rural)', desigMr: 'पोलीस अधीक्षक, अमरावती (ग्रामीण)', desigHi: 'पुलिस अधीक्षक, अमरावती (ग्रामीण)' },
                { id: 12, name: 'Shri. Satyam Gandhi (IAS)', nameMr: 'श्री. सत्यम गांधी (आय.ए.एस.)', nameHi: 'श्री सत्यम गांधी (आईएएस)', desig: 'Chief Executive Officer, ZP, Amravati', desigMr: 'मुख्य कार्यकारी अधिकारी, जि. प. अमरावती', desigHi: 'मुख्य कार्यकारी अधिकारी, जि. प. अमरावती' },
                { id: 13, name: 'Smt. Shraddha Udavant', nameMr: 'श्रीमती श्रद्धा उदवंत', nameHi: 'श्रीमती श्रद्धा उदवंत', desig: 'District Resettlement Officer', desigMr: 'जिल्हा पुनर्वसन अधिकारी', desigHi: 'जिला पुनर्वास अधिकारी' },
                { id: 14, name: 'Smt. Sushma Chaudhary', nameMr: 'श्रीमती सुषमा चौधरी', nameHi: 'श्रीमती सुषमा चौधरी', desig: 'Dy. Collector, L.A.O. MIW', desigMr: 'उपजिल्हाधिकारी, भूसंपादन लघुसिंचन', desigHi: 'उपजिलाधिकारी, भूमि अधिग्रहण लघु सिंचाई' },
                { id: 15, name: 'Shri. Vivek Jadhav', nameMr: 'श्री. विवेक जाधव', nameHi: 'श्री विवेक जाधव', desig: 'Dy. Collector, Revenue', desigMr: 'उपजिल्हाधिकारी, महसूल', desigHi: 'उपजिलाधिकारी, राजस्व' },
                { id: 16, name: 'Smt. Durga Devre', nameMr: 'श्रीमती दुर्गा देवरे', nameHi: 'श्रीमती दुर्गा देवरे', desig: 'Dy. Collector, L.A.O. 2', desigMr: 'उपजिल्हाधिकारी, भूसंपादन २', desigHi: 'उपजिलाधिकारी, भूमि अधिग्रहण २' },
                { id: 17, name: 'Shri. Prasannajit Chavan', nameMr: 'श्री. प्रसन्नजित चव्हाण', nameHi: 'श्री प्रसन्नजीत चव्हाण', desig: 'Dy. Collector, L.A.O. 4', desigMr: 'उपजिल्हाधिकारी, भूसंपादन ४', desigHi: 'उपजिलाधिकारी, भूमि अधिग्रहण ४' },
                { id: 18, name: 'Shri. Ninad Lande', nameMr: 'श्री. निनाद लांडे', nameHi: 'श्री निनाद लांडे', desig: 'District Supply Officer', desigMr: 'जिल्हा पुरवठा अधिकारी', desigHi: 'जिला आपूर्ति अधिकारी' },
                { id: 19, name: 'Shri. Dnyaneshwar Ghyar', nameMr: 'श्री. ज्ञानेश्वर घ्यार', nameHi: 'श्री ज्ञानेश्वर घ्यार', desig: 'Dy. Collector, E.G.S', desigMr: 'उपजिल्हाधिकारी, रोहयो', desigHi: 'उपजिलाधिकारी, मनरेगा (EGS)' },
                { id: 20, name: 'Shri. P.O. Raut', nameMr: 'श्री. पी. ओ. राऊत', nameHi: 'श्री पी. ओ. राउत', desig: 'Food Distribution Officer', desigMr: 'अन्न धान्य वितरण अधिकारी', desigHi: 'खाद्य वितरण अधिकारी' },
                { id: 21, name: 'Shri. Nilesh Khatke', nameMr: 'श्री. निलेश खटके', nameHi: 'श्री नीलेश खटके', desig: 'Superintendent', desigMr: 'अधीक्षक', desigHi: 'अधीक्षक' },
                { id: 22, name: 'Smt. Bhagyshree Deshmukh', nameMr: 'श्रीमती भाग्यश्री देशमुख', nameHi: 'श्रीमती भाग्यश्री देशमुख', desig: 'Tehsildar Nazul', desigMr: 'तहसीलदार नझुल', desigHi: 'तहसीलदार नजूल' },
                { id: 23, name: 'Smt. Pranita Chaple', nameMr: 'श्रीमती प्रणिता चापले', nameHi: 'श्रीमती प्रणिता चापले', desig: 'District Mining Officer', desigMr: 'जिल्हा खनिकर्म अधिकारी', desigHi: 'जिला खनन अधिकारी' },
                { id: 24, name: 'Shri. Vikas Khandare', nameMr: 'श्री. विकास खंदारे', nameHi: 'श्री विकास खंदारे', desig: 'Joint Commissioner, Urban Development Dept.', desigMr: 'सह आयुक्त, नगर विकास विभाग', desigHi: 'संयुक्त आयुक्त, नगर विकास विभाग' },
                { id: 25, name: 'Shri. Ravindra Thakre', nameMr: 'श्री. रवींद्र ठाकरे', nameHi: 'श्री रवींद्र ठाकरे', desig: 'State Information Commissioner', desigMr: 'राज्य माहिती आयुक्त', desigHi: 'राज्य सूचना आयुक्त' },
                { id: 26, name: 'Shri. Narendra Bohara', nameMr: 'श्री. नरेंद्र बोहरा', nameHi: 'श्री नरेंद्र बोहरा', desig: 'Law Officer', desigMr: 'विधी अधिकारी', desigHi: 'विधि अधिकारी' },
                { id: 27, name: 'Shri. Sahaberao Dutode', nameMr: 'श्री. सहाबेराव दुतोडे', nameHi: 'श्री सहाबेराव दुतोडे', desig: 'Deputy Inspector General of Registration', desigMr: 'नोंदणी उपमहानिरीक्षक', desigHi: 'पंजीकरण उपमहानिरीक्षक' },
                { id: 28, name: 'Dr. Narukullarambabu', nameMr: 'डॉ. नारुकुल्लारामबाबू', nameHi: 'डॉ. नारुकुल्लारामबाबू', desig: 'Commissioner, State Public Service Rights Commission, Amravati', desigMr: 'आयुक्त, राज्य सेवा हक्क आयोग, अमरावती', desigHi: 'आयुक्त, राज्य सेवा अधिकार आयोग, अमरावती' },
                { id: 29, name: 'Smt. Priya Tilakunthe', nameMr: 'श्रीमती प्रिया टिळकउंठे', nameHi: 'श्रीमती प्रिया तिलकउंठे', desig: 'Joint Director Accounts and Treasury', desigMr: 'सह संचालक लेखा व कोषागार', desigHi: 'संयुक्त निदेशक लेखा एवं कोषागार' },
                { id: 30, name: 'Smt. Shilpa Pawar', nameMr: 'श्रीमती शिल्पा पवार', nameHi: 'श्रीमती शिल्पा पवार', desig: 'District Treasury Officer / Asst. District Treasury Officer', desigMr: 'जिल्हा कोषागार अधिकारी / सहाय्यक जिल्हा कोषागार अधिकारी', desigHi: 'जिला कोष अधिकारी / सहायक जिला कोष अधिकारी' },
                { id: 31, name: 'Shri. Goswami', nameMr: 'श्री. गोस्वामी', nameHi: 'श्री गोस्वामी', desig: 'District Project Manager', desigMr: 'जिल्हा प्रकल्प व्यवस्थापक', desigHi: 'जिला परियोजना प्रबंधक' },
              ].map((row) => {
                const activeName = language === 'mr' && row.nameMr ? row.nameMr : language === 'hi' && row.nameHi ? row.nameHi : row.name;
                const activeDesig = language === 'mr' && row.desigMr ? row.desigMr : language === 'hi' && row.desigHi ? row.desigHi : row.desig;
                return (
                  <tr key={row.id} className="officials-row">
                    <td className="col-sr">{row.id}</td>
                    <td className="col-name">
                      <div className="official-name-cell">
                        <div className="official-avatar">{activeName.trim()[0]}</div>
                        <span>{activeName}</span>
                      </div>
                    </td>
                    <td className="col-desig">
                      <span className="desig-badge">{activeDesig}</span>
                    </td>
                  </tr>
                );
              })}
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
                {util.items.map((item, idx) => {
                  const activeName = language === 'mr' && item.nameMr ? item.nameMr : language === 'hi' && item.nameHi ? item.nameHi : item.name;
                  const activeDetail = language === 'mr' && item.detailMr ? item.detailMr : language === 'hi' && item.detailHi ? item.detailHi : item.detail;
                  return (
                    <div key={idx} className="udp-item">
                      <div className="udp-item-num" style={{ background: util.color }}>{idx + 1}</div>
                      <div className="udp-item-info">
                        <strong>{activeName}</strong>
                        <span>{activeDetail}</span>
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="udp-phone">📞 {item.phone}</a>
                        )}
                      </div>
                    </div>
                  );
                })}
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
