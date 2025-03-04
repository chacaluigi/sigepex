import React, { useState } from 'react';
import './proceso.css';

export default function Proceso() {
  const [loading, setLoading] = useState(false);
  const startAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/proceso', {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('❌ Error al procesar noticias:', error);
    }
    setLoading(false);
  };

  return (
    <div className="table-container">
      <div className="main-content">
        <section className="kpi-container">
          <div className="kpi-card">
            📰 <span id="total-news">345</span>
            <p>Total noticias</p>
          </div>
          <div className="kpi-card">
            📢 <span id="new-news">25</span>
            <p>Nuevas noticias</p>
          </div>
          <div className="kpi-card">
            🔥 <span id="relevant-news">7</span>
            <p>Noticias relevantes</p>
          </div>
          <div className="kpi-card">
            ⏳ <span id="freq-news">15/hora</span>
            <p>Frecuencia</p>
          </div>
        </section>

        <section className="search-section">
          <h2>🔍 Buscar y Analizar Posts</h2>
          <p>Presiona el botón para comenzar el análisis en tiempo real.</p>
          <button
            id="start-analysis"
            onClick={startAnalysis}
            disabled={loading}
          >
            📡 Buscar Posts
          </button>
        </section>

        <section className="loading-section">
          <h2>⏳ Procesando Datos...</h2>
          <div className="loading-bar">
            <span>📡 Extrayendo Posts...</span>
            <div className="progress" id="progress-extract"></div>
          </div>
          <div className="loading-bar">
            <span>🧹 Limpiando Datos...</span>
            <div className="progress" id="progress-clean"></div>
          </div>
          <div className="loading-bar">
            <span>📊 Analizando Posts...</span>
            <div className="progress" id="progress-analyze"></div>
          </div>
          <div className="loading-bar">
            <span>📝 Generando Reporte...</span>
            <div className="progress" id="progress-report"></div>
          </div>
        </section>
      </div>
    </div>
  ); // Se muestra brevemente antes de la redirección
}
