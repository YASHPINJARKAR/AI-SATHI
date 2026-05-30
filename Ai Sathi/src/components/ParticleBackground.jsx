import { useEffect, useRef } from 'react';
import './ParticleBackground.css';

export default function ParticleBackground({ isDarkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    let mouse = { x: null, y: null, radius: 180 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    });
    window.addEventListener('touchend', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y, size, color, velocityY, velocityX) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.color = color;
        this.baseX = x;
        this.baseY = y;
        this.velocityY = velocityY;
        this.velocityX = velocityX;
        this.density = (Math.random() * 20) + 2;
        this.pulse = Math.random() * Math.PI * 2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Futuristic Glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      update() {
        // Subtle pulsing size
        this.pulse += 0.05;
        this.size = this.baseSize + Math.sin(this.pulse) * 0.5;

        // Anti-gravity movement (drifting upwards smoothly)
        this.y -= this.velocityY;
        this.x += this.velocityX;

        // Wrap around seamlessly
        if (this.y < 0 - this.size * 2) {
          this.y = canvas.height + this.size * 2;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 - this.size * 2) {
          this.x = canvas.width + this.size;
        } else if (this.x > canvas.width + this.size * 2) {
          this.x = 0 - this.size;
        }

        // Mouse repulsion (Iron Man HUD feel)
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Smooth inertia back to base horizontal drift
            if (this.x !== this.baseX) {
              let dxBase = this.x - this.baseX;
              this.x -= dxBase / 50;
            }
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const densityMultiplier = window.innerWidth < 768 ? 8000 : 12000;
      const numParticles = Math.min((canvas.width * canvas.height) / densityMultiplier, 150); // Cap for performance
      
      // Adjust colors based on theme
      const colors = isDarkMode ? [
        'rgba(0, 255, 255, 0.7)', 
        'rgba(138, 43, 226, 0.7)', 
        'rgba(65, 105, 225, 0.7)',
        'rgba(255, 109, 0, 0.5)' // subtle accent orange
      ] : [
        'rgba(0, 150, 200, 0.6)', 
        'rgba(100, 43, 200, 0.6)', 
        'rgba(45, 80, 200, 0.6)',
        'rgba(220, 80, 0, 0.4)'
      ];

      for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * 2) + 0.8;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        // Zero gravity upward drift
        let velocityY = (Math.random() * 0.4) + 0.1; 
        let velocityX = (Math.random() * 0.3) - 0.15; 
        
        particles.push(new Particle(x, y, size, color, velocityY, velocityX));
      }
    };

    const connect = () => {
      let maxDistance = 140;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // Interaction lines with mouse
          if (mouse.x != null && mouse.y != null) {
            let mdx = particles[a].x - mouse.x;
            let mdy = particles[a].y - mouse.y;
            let mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if (mouseDistance < mouse.radius && distance < maxDistance) {
              let opacity = (1 - (distance / maxDistance)) * (isDarkMode ? 0.6 : 0.4);
              ctx.strokeStyle = isDarkMode ? `rgba(0, 255, 255, ${opacity})` : `rgba(0, 150, 200, ${opacity})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }

          // Ambient background connections
          if (distance < maxDistance * 0.7) {
            let opacity = (1 - (distance / (maxDistance * 0.7))) * (isDarkMode ? 0.15 : 0.08);
            ctx.strokeStyle = isDarkMode ? `rgba(138, 43, 226, ${opacity})` : `rgba(100, 43, 200, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();
    };

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <div className="particle-container">
      {isDarkMode && <div className="ambient-fog"></div>}
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
}
