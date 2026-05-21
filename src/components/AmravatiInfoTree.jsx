import React, { useState } from 'react';
import { BookOpen, Map, Users, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import './AmravatiInfoTree.css';
import { useLanguage } from '../LanguageContext';

const historyData = [
  { year: "Ancient", desc: "Originally 'Udumbravati' (City of Audumber trees) -> 'Umbravati' -> 'Amravati'. Named after ancient Ambadevi temple." },
  { year: "1097", desc: "Stone carved inscription of Jain God Adinath Rhishabhnath statue found." },
  { year: "13th Century", desc: "Govind Maha Prabhu visited; under rule of Deogiri’s Yadav King." },
  { year: "14th Century", desc: "Famine caused population to migrate to Gujrat and Malva." },
  { year: "16th Century", desc: "Mager Aurangpura (Sabanpura) presented for Jumma Majseed by Badashah Aurangzeb." },
  { year: "1722", desc: "Chhatrapati Shahoo Maharaj presented Amravati & Badnera to Shri Ranoji Bhosle ('Bhosle ki Amravati')." },
  { year: "1803-1805", desc: "British conquered Gavilgad (1803). Sahukars saved city from Pendharies attack by paying 7 lakhs (1805)." },
  { year: "1859-1871", desc: "British built Railway Station, Commissioner bungalow, Courts, Tahsil office, Jail & Cotton market." },
  { year: "1897", desc: "13th Congress Conference held here by Dadasaheb Khaparde, Ranganath Pant Mudhodker & others." },
  { year: "1928-1930", desc: "Lokmanya Tilak & Gandhi visited (1928). Namak Satyagrah led by Vir Vamanrao Joshi (1930)." },
  { year: "1956-1960", desc: "Part of Bombay State (1956), then Maharashtra State (1960)." }
];

const demographyData = [
  { label: "Area", value: "12235 Sq Km" },
  { label: "Revenue Divisions", value: "7" },
  { label: "Taluks", value: "14" },
  { label: "Revenue Mandals", value: "89" },
  { label: "Mandal Praja Parishads", value: "517" },
  { label: "Gram Panchayats", value: "845" },
  { label: "Municipalities", value: "15" },
  { label: "Municipal Corporations", value: "1" },
  { label: "Villages", value: "2016" }
];

const helplineData = [
  { service: "Collector Office Control Room", num: "07212662025", display: "(0721) 2662025" },
  { service: "Collector Office Helpline", num: "1077", display: "1077" },
  { service: "Amravati Railway Station", num: "139", display: "139" },
  { service: "Badnera Railway Station", num: "1331", display: "1331" },
  { service: "Amravati Bus Stand", num: "1800221250", display: "1800 22 1250" },
  { service: "Badnera Bus Stand", num: "07212681222", display: "0721-2681222" },
  { service: "Police", num: "100", display: "100" },
  { service: "Fire", num: "101", display: "101" },
  { service: "Ambulance", num: "102", display: "102" },
  { service: "Women Helpline", num: "1091", display: "1091" },
  { service: "Emergency on National Highway", num: "1033", display: "1033" }
];

export default function AmravatiInfoTree() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('demography');

  return (
    <section className="section info-tree-section">
      <div className="section-header">
        <h2>
          {language === 'mr' ? 'अमरावती एक नजर' : language === 'hi' ? 'अमरावती एक नज़र में' : 'Amravati at a Glance'}
        </h2>
        <p>
          {language === 'mr' ? 'इतिहास, भूगोल, लोकसंख्याशास्त्र आणि हेल्पलाइन' : language === 'hi' ? 'इतिहास, भूगोल, जनसांख्यिकी और हेल्पलाइन' : 'History, Geography, Demography & Helplines'}
        </p>
      </div>

      <div className="tree-container">
        {/* Tree Root */}
        <div className="tree-root">
          <div className="root-circle">
            <h3>अमरावती</h3>
            <p>Amravati</p>
          </div>
        </div>

        {/* Tree Branches (Tabs) */}
        <div className="tree-branches">
          <div className="branch-line"></div>
          <div className="branch-nodes">
            <button className={`branch-node ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <div className="node-icon"><BookOpen size={20} /></div>
              <span>History</span>
            </button>
            <button className={`branch-node ${activeTab === 'geography' ? 'active' : ''}`} onClick={() => setActiveTab('geography')}>
              <div className="node-icon"><Map size={20} /></div>
              <span>Geography</span>
            </button>
            <button className={`branch-node ${activeTab === 'demography' ? 'active' : ''}`} onClick={() => setActiveTab('demography')}>
              <div className="node-icon"><Users size={20} /></div>
              <span>Demography</span>
            </button>
            <button className={`branch-node ${activeTab === 'helpline' ? 'active' : ''}`} onClick={() => setActiveTab('helpline')}>
              <div className="node-icon"><Phone size={20} /></div>
              <span>Helpline</span>
            </button>
          </div>
        </div>

        {/* Tree Content Box */}
        <div className="tree-content card animate-fade-in-up">
          {activeTab === 'history' && (
            <div className="content-panel history-panel">
              <h3 className="panel-title">History of Amravati</h3>
              <div className="timeline">
                {historyData.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'geography' && (
            <div className="content-panel geography-panel">
              <h3 className="panel-title">Geographical Facts</h3>
              <div className="geo-grid">
                <div className="geo-card">
                  <h4>Altitude</h4>
                  <p>340 m above sea level</p>
                  <p>Coordinates: 20° 56′ N, 77° 47′ E</p>
                </div>
                <div className="geo-card">
                  <h4>Hills</h4>
                  <p><strong>Pohara & Chirodi:</strong> Located in the east.</p>
                  <p><strong>Maltekdi:</strong> Inside the city (60m height) with the statue of Chhatrapati Shivaji Maharaj on top.</p>
                </div>
                <div className="geo-card">
                  <h4>Lakes & Connectivity</h4>
                  <p><strong>Lakes:</strong> Chhatri Talao & Wadali Talao (Eastern part).</p>
                  <p><strong>Location:</strong> Main centre of West Vidarbha, situated on the Mumbai-Calcutta highway.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demography' && (
            <div className="content-panel demography-panel">
              <h3 className="panel-title">District Demography</h3>
              <div className="demo-grid">
                {demographyData.map((item, idx) => (
                  <div key={idx} className="demo-item">
                    <span className="demo-label">{item.label}</span>
                    <span className="demo-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'helpline' && (
            <div className="content-panel helpline-panel">
              <h3 className="panel-title">Important Helplines</h3>
              <div className="helpline-grid">
                {helplineData.map((item, idx) => (
                  <div key={idx} className="helpline-item">
                    <span className="helpline-service">{item.service}</span>
                    <a href={`tel:${item.num}`} className="helpline-num">
                      <Phone size={14} style={{ marginRight: '6px' }} />
                      {item.display}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
