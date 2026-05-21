import React, { Suspense, lazy, useState, useCallback, useRef } from 'react';
import './SplineScene.css';

// Lazy-load the heavy Spline component — only downloaded when needed
const Spline = lazy(() => import('@splinetool/react-spline'));

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SplineSkeleton() {
  return (
    <div className="spline-skeleton" aria-label="Loading 3D scene…">
      <div className="spline-skeleton-orb" />
      <div className="spline-skeleton-ring spline-skeleton-ring--1" />
      <div className="spline-skeleton-ring spline-skeleton-ring--2" />
      <div className="spline-skeleton-ring spline-skeleton-ring--3" />
      <div className="spline-skeleton-particles">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="spline-skeleton-particle" style={{ '--i': i }} />
        ))}
      </div>
      <p className="spline-skeleton-label">Loading 3D Scene…</p>
    </div>
  );
}

// ─── Error Fallback ───────────────────────────────────────────────────────────
function SplineErrorFallback() {
  return (
    <div className="spline-error">
      <div className="spline-error-orb" />
      <div className="spline-error-rings">
        <div className="spline-error-ring" />
        <div className="spline-error-ring" />
      </div>
    </div>
  );
}

// ─── Mobile Fallback (gradient orb, no WebGL) ─────────────────────────────────
function SplineMobileFallback() {
  return (
    <div className="spline-mobile-fallback">
      <div className="spline-mobile-orb" />
      <div className="spline-mobile-ring spline-mobile-ring--1" />
      <div className="spline-mobile-ring spline-mobile-ring--2" />
      <div className="spline-mobile-particles">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="spline-mobile-particle" style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SplineErrorFallback />;
    }
    return this.props.children;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SplineScene({
  scene,
  className = '',
  onLoad,
  style = {},
}) {
  const [loaded, setLoaded] = useState(false);
  const splineRef = useRef(null);
  const wrapperRef = useRef(null);

  // Detect mobile — skip WebGL on low-end devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Remove any "Built with Spline" watermark/logo from DOM using MutationObserver
  React.useEffect(() => {
    if (isMobile) return;

    const removeLogo = (root) => {
      // Anchors pointing to spline.design
      root.querySelectorAll('a[href*="spline"]').forEach((el) => el.remove());
      // Element with id="logo"
      root.querySelectorAll('#logo').forEach((el) => el.remove());
    };

    // Run once immediately
    removeLogo(document);

    // Watch for future DOM additions
    const observer = new MutationObserver(() => {
      removeLogo(document);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const handleLoad = useCallback(
    (splineApp) => {
      splineRef.current = splineApp;
      try {
        splineApp.setBackgroundColor('transparent');
      } catch (err) {
        console.warn('Could not set Spline background color programmatically:', err);
      }
      setLoaded(true);
      onLoad?.(splineApp);
    },
    [onLoad]
  );

  if (isMobile) {
    return (
      <div className={`spline-wrapper ${className}`} style={style}>
        <SplineMobileFallback />
      </div>
    );
  }

  return (
    <div className={`spline-wrapper ${className}`} style={style}>
      <SplineErrorBoundary>
        <Suspense fallback={<SplineSkeleton />}>
          {/* Dim skeleton until scene is ready */}
          {!loaded && <SplineSkeleton />}

          <div
            className="spline-canvas-wrap"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
          >
            <Spline scene={scene} onLoad={handleLoad} style={{ background: 'transparent' }} />
          </div>
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}
