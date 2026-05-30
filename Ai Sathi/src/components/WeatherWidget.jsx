import { useState, useEffect, useCallback } from 'react';
import { 
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, 
  CloudRain, CloudSnow, CloudLightning, Thermometer, 
  Droplets, Wind, RefreshCw, CloudRain as RainIcon, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './WeatherWidget.css';

// Coordinates for Amravati, Maharashtra
const LAT = '20.9320';
const LNG = '77.7523';

const weatherDetails = {
  en: {
    title: 'Live Weather in Amravati',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    rain: 'Precipitation',
    updated: 'Updated',
    retry: 'Retry',
    error: 'Failed to load live weather. Please check your connection.',
    forecast: 'Full Forecast'
  },
  mr: {
    title: 'अमरावतीचे लाईव्ह हवामान',
    feelsLike: 'वाटणारे तापमान',
    humidity: 'आद्रता',
    wind: 'वाऱ्याचा वेग',
    rain: 'पाऊस',
    updated: 'अद्ययावत',
    retry: 'पुन्हा प्रयत्न करा',
    error: 'हवामान माहिती लोड करण्यात अडचण आली. कृपया कनेक्शन तपासा.',
    forecast: 'पूर्वानुमान पहा'
  },
  hi: {
    title: 'अमरावती का लाइव मौसम',
    feelsLike: 'महसूस होने वाला',
    humidity: 'आर्द्रता',
    wind: 'हवा की गति',
    rain: 'बारिश',
    updated: 'अद्यतनित',
    retry: 'पुन्हा प्रयास करें',
    error: 'मौसम की जानकारी लोड करने में समस्या हुई। कृपया कनेक्शन जांचें.',
    forecast: 'पूर्वानुमान देखें'
  }
};

export default function WeatherWidget() {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(false);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m`
      );
      if (!response.ok) {
        throw new Error('Weather API error');
      }
      const result = await response.json();
      setData(result.current);
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Maps WMO code to Description & Lucide Icon
  const getWeatherInfo = (code) => {
    const mappings = {
      0: {
        icon: Sun,
        en: 'Clear Sky',
        mr: 'स्वच्छ आकाश',
        hi: 'साफ मौसम',
        color: '#ff6d00'
      },
      1: {
        icon: CloudSun,
        en: 'Mainly Clear',
        mr: 'अंशतः स्वच्छ',
        hi: 'मुख्यतः साफ',
        color: '#ff9e40'
      },
      2: {
        icon: CloudSun,
        en: 'Partly Cloudy',
        mr: 'अंशतः ढगाळ',
        hi: 'आंशिक रूप से बादल',
        color: '#3949ab'
      },
      3: {
        icon: Cloud,
        en: 'Cloudy',
        mr: 'ढगाळ हवामान',
        hi: 'घने बादल',
        color: '#8e95a9'
      },
      45: {
        icon: CloudFog,
        en: 'Foggy',
        mr: 'धुके',
        hi: 'कोहरा',
        color: '#a0a8c0'
      },
      48: {
        icon: CloudFog,
        en: 'Foggy',
        mr: 'धुके',
        hi: 'कोहरा',
        color: '#a0a8c0'
      },
      51: {
        icon: CloudDrizzle,
        en: 'Light Drizzle',
        mr: 'रिमझिम पाऊस',
        hi: 'हल्की बूंदाबांदी',
        color: '#2979ff'
      },
      53: {
        icon: CloudDrizzle,
        en: 'Moderate Drizzle',
        mr: 'रिमझिम पाऊस',
        hi: 'बूंदाबांदी',
        color: '#2979ff'
      },
      55: {
        icon: CloudDrizzle,
        en: 'Dense Drizzle',
        mr: 'सडकून पाऊस',
        hi: 'घनी बूंदाबांदी',
        color: '#1a237e'
      },
      61: {
        icon: CloudRain,
        en: 'Slight Rain',
        mr: 'सहल पाऊस',
        hi: 'हल्की बारिश',
        color: '#2979ff'
      },
      63: {
        icon: CloudRain,
        en: 'Moderate Rain',
        mr: 'मध्यम पाऊस',
        hi: 'बारिश',
        color: '#1a237e'
      },
      65: {
        icon: CloudRain,
        en: 'Heavy Rain',
        mr: 'मुसळधार पाऊस',
        hi: 'भारी बारिश',
        color: '#0d1452'
      },
      71: {
        icon: CloudSnow,
        en: 'Slight Snow',
        mr: 'बर्फवृष्टी',
        hi: 'हल्की बर्फबारी',
        color: '#a0a8c0'
      },
      73: {
        icon: CloudSnow,
        en: 'Moderate Snow',
        mr: 'मध्यम बर्फवृष्टी',
        hi: 'बर्फबारी',
        color: '#eef1f8'
      },
      75: {
        icon: CloudSnow,
        en: 'Heavy Snow',
        mr: 'मुसळधार बर्फवृष्टी',
        hi: 'भारी बर्फबारी',
        color: '#ffffff'
      },
      80: {
        icon: CloudRain,
        en: 'Slight Showers',
        mr: 'पावसाच्या सरी',
        hi: 'हल्की बौछारें',
        color: '#2979ff'
      },
      81: {
        icon: CloudRain,
        en: 'Moderate Showers',
        mr: 'पावसाच्या सरी',
        hi: 'बौछारें',
        color: '#1a237e'
      },
      82: {
        icon: CloudRain,
        en: 'Violent Showers',
        mr: 'जोरदार पावसाच्या सरी',
        hi: 'भारी बौछारें',
        color: '#0d1452'
      },
      95: {
        icon: CloudLightning,
        en: 'Thunderstorm',
        mr: 'वादळी पाऊस',
        hi: 'आंधी-तूफान',
        color: '#ffd600'
      },
      96: {
        icon: CloudLightning,
        en: 'Thunderstorm with Hail',
        mr: 'गारांसह वादळी पाऊस',
        hi: 'ओलों के साथ आंधी-तूफान',
        color: '#ffd600'
      },
      99: {
        icon: CloudLightning,
        en: 'Heavy Thunderstorm',
        mr: 'तीव्र वादळी पाऊस',
        hi: 'भारी आंधी-तूफान',
        color: '#ff1744'
      }
    };

    const defaultInfo = {
      icon: Sun,
      en: 'Clear Sky',
      mr: 'स्वच्छ आकाश',
      hi: 'साफ मौसम',
      color: '#ff6d00'
    };

    const mapped = mappings[code] || defaultInfo;
    return {
      Icon: mapped.icon,
      description: mapped[language] || mapped.en,
      color: mapped.color
    };
  };

  const t = weatherDetails[language] || weatherDetails.en;

  if (loading) {
    return (
      <div className="weather-widget-container">
        <div className="weather-skeleton">
          <div className="shimmer-line shimmer-header"></div>
          <div className="shimmer-body-grid">
            <div className="shimmer-left">
              <div className="shimmer-line shimmer-icon"></div>
              <div className="shimmer-line shimmer-temp"></div>
            </div>
            <div className="shimmer-details">
              <div className="shimmer-line shimmer-item"></div>
              <div className="shimmer-line shimmer-item"></div>
              <div className="shimmer-line shimmer-item"></div>
              <div className="shimmer-line shimmer-item"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget-container">
        <div className="weather-error animate-scale-in">
          <p>{t.error}</p>
          <button onClick={() => fetchWeather()} className="btn btn-outline btn-sm weather-error-btn">
            <RefreshCw size={14} style={{ marginRight: '6px' }} />
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const weatherInfo = getWeatherInfo(data.weather_code);
  const IconComponent = weatherInfo.Icon;

  return (
    <div className="weather-widget-container animate-fade-in">
      <div className="weather-card card">
        {/* Header */}
        <div className="weather-header">
          <div className="weather-title-group">
            <IconComponent size={22} style={{ color: weatherInfo.color }} />
            <h3>{t.title}</h3>
          </div>
          <div className="weather-actions">
            {lastUpdated && (
              <span className="weather-updated">
                {t.updated}: {lastUpdated}
              </span>
            )}
            <button 
              className={`weather-refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={() => fetchWeather(true)}
              disabled={refreshing}
              title="Refresh Weather"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Body Layout - Clickable to open weather app */}
        <a 
          className="weather-body weather-body-link"
          href="https://www.google.com/search?q=weather+amravati"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Main Primary Weather details */}
          <div className="weather-primary">
            <div className="weather-big-icon" style={{ background: `${weatherInfo.color}15`, color: weatherInfo.color }}>
              <IconComponent size={40} />
            </div>
            <div className="weather-temp-info">
              <span className="weather-current-temp">
                {Math.round(data.temperature_2m)}°C
              </span>
              <span className="weather-desc-text marathi-text">
                {weatherInfo.description}
              </span>
              <span className="weather-forecast-link">
                {t.forecast} <ExternalLink size={12} />
              </span>
            </div>
          </div>

          {/* Sub Grid for other specific points */}
          <div className="weather-details-grid">
            {/* Feels Like */}
            <div className="weather-detail-item">
              <div className="weather-detail-icon">
                <Thermometer size={16} />
              </div>
              <div className="weather-detail-meta">
                <span className="weather-detail-label marathi-text">{t.feelsLike}</span>
                <span className="weather-detail-value">{Math.round(data.apparent_temperature)}°C</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="weather-detail-item">
              <div className="weather-detail-icon">
                <Droplets size={16} />
              </div>
              <div className="weather-detail-meta">
                <span className="weather-detail-label marathi-text">{t.humidity}</span>
                <span className="weather-detail-value">{data.relative_humidity_2m}%</span>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-detail-item">
              <div className="weather-detail-icon" style={{ transform: `rotate(${data.wind_direction_10m || 0}deg)` }}>
                <Wind size={16} />
              </div>
              <div className="weather-detail-meta">
                <span className="weather-detail-label marathi-text">{t.wind}</span>
                <span className="weather-detail-value">{data.wind_speed_10m} km/h</span>
              </div>
            </div>

            {/* Rain */}
            <div className="weather-detail-item">
              <div className="weather-detail-icon">
                <RainIcon size={16} />
              </div>
              <div className="weather-detail-meta">
                <span className="weather-detail-label marathi-text">{t.rain}</span>
                <span className="weather-detail-value">{data.precipitation} mm</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
