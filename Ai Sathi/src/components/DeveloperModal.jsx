import React from 'react';
import { X, Phone } from 'lucide-react';
import './DeveloperModal.css';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function DeveloperModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const developers = [
    {
      name: 'Bhakti Kaner',
      phone: '+91 8329046037',
      instagram: 'https://www.instagram.com/bhakti___46?igsh=OG92ZHZucHIwcWty',
      linkedin: 'https://www.linkedin.com/in/bhakti-kaner-b3a593336?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      photo: '/image copy.png'
    },
    {
      name: 'Yash Pinjarkar',
      phone: '+91 9405702530',
      instagram: 'https://www.instagram.com/mr_yash_pinjarkar?igsh=MW40dWZlMTQwZmpodw==',
      linkedin: 'https://www.linkedin.com/in/yash-pinjarkar-ab5576359?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      photo: '/image copy 2.png'
    },
    {
      name: 'Trisha Bobade',
      phone: '+91 8261936781',
      instagram: 'https://www.instagram.com/bobade_trisha_?igsh=MWRvYWM3d2ppZnE0Zg==',
      linkedin: 'https://www.linkedin.com/in/trisha-bobade-373a393b3?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      photo: '/image copy 3.png'
    },
    {
      name: 'Sanket Thakare',
      phone: '+91 7057953073',
      instagram: 'https://www.instagram.com/__sanket_thakare_patil__?igsh=MW5pZHhvNTh2bzgwdQ==',
      linkedin: 'https://www.linkedin.com/in/sanket-thakare-1b6b49329?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      // To add a real photo, place your image (e.g., sanket.jpg) in the 'public' folder and use: photo: '/sanket.jpg'
      photo: '/image.png'
    }
  ];

  return (
    <div className="dev-modal-overlay" onClick={onClose}>
      <div className="dev-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="dev-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="dev-modal-header">
          <h2>Team Drishti</h2>
          <p>Meet the developers behind Ai Sathi</p>
        </div>

        <div className="dev-list">
          {developers.map((dev, index) => (
            <div key={index} className="dev-card">
              <div className="dev-photo-wrapper">
                <img src={dev.photo} alt={dev.name} className="dev-photo" />
              </div>
              <div className="dev-info">
                <h3>{dev.name}</h3>
                <div className="dev-socials">
                  <a href={`tel:${dev.phone}`} className="dev-social-link" title="Contact">
                    <Phone size={16} />
                  </a>
                  <a href={dev.instagram} target="_blank" rel="noreferrer" className="dev-social-link" title="Instagram">
                    <InstagramIcon size={16} />
                  </a>
                  <a href={dev.linkedin} target="_blank" rel="noreferrer" className="dev-social-link" title="LinkedIn">
                    <LinkedinIcon size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
