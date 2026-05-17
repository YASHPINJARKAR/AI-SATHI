import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the button on the chat page
  if (location.pathname === '/chat') {
    return null;
  }

  return (
    <button 
      className="floating-chat-button" 
      onClick={() => navigate('/chat')}
      aria-label="Ask a doubt"
    >
      <MessageCircle className="floating-chat-icon" strokeWidth={2.5} />
    </button>
  );
};

export default FloatingChatButton;
