import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto shadow-lg">
      <div className="container">
        <div className="row g-4">
          {/* Columna 1: Información de la marca */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-success fw-bold mb-3">🌱 NutriVida</h5>
            <p className="text-muted small">
              Tu tienda online de confianza especializada en productos saludables, suplementos y nutrición consciente para acompañarte en un estilo de vida equilibrado.
            </p>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} NutriVida SpA. Todos los derechos reservados.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3">Navegación</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none hover-white">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-muted text-decoration-none hover-white">Catálogo</Link>
              </li>
              <li className="mb-2">
                <Link to="/carrito" className="text-muted text-decoration-none hover-white">Carrito</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-muted text-decoration-none hover-white">Acceso / Registro</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte y Categorías */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3">Atención al Cliente</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">📧 contacto@nutrivida.cl</li>
              <li className="mb-2">📞 +56 9 1234 5678</li>
              <li className="mb-2">📍 Viña del Mar, Chile</li>
              <li className="mb-2">🕒 Lun - Vie: 9:00 - 18:00 hrs</li>
            </ul>
          </div>

          {/* Columna 4: Información académica / Proyecto */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3">Evaluación Duoc UC</h6>
            <p className="text-muted small">
              Desarrollo Fullstack II (DSY1104)[cite: 1, 13, 22]. Proyecto académico orientado a la creación de aplicaciones web modernas con React y Bootstrap[cite: 2, 14].
            </p>
            <span className="badge bg-success text-white">Versión 2.0</span>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        {/* Fila inferior */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <small className="text-muted">
              Elías Terán & Equipo — Duoc UC Viña del Mar[cite: 13, 22]
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-muted">
              Construido con React, Bootstrap y Node.js[cite: 2, 14]
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;