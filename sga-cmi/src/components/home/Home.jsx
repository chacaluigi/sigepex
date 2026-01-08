import React from 'react';

import './sidebar.css';

const Home = () => {
  return (
    <main>
      <div className="dashboard-content">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>

      <div className="dashboard-container">
        <a href="/" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bxs-dashboard"></i>
          </div>
          <div className="dashboard-text">Inicio</div>
        </a>

        <a href="/" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bxs-user"></i>
          </div>
          <div className="dashboard-text">Gestión de Usuarios</div>
        </a>

        <a href="/" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bx-search-alt"></i>
          </div>
          <div className="dashboard-text">
            Gestión de Solicitudes de Análisis
          </div>
        </a>

        <a href="/" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bxs-analyse"></i>
          </div>
          <div className="dashboard-text">Análisis de Datos</div>
        </a>

        <a href="/" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bxs-report"></i>
          </div>
          <div className="dashboard-text">Gestión de Reportes</div>
        </a>
      </div>
    </main>
  );
};

export default Home;
