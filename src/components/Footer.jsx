import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white pt-5 pb-4 mt-5" style={{ backgroundColor: "#12351e" }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold text-warning">NutriVida</h5>
            <p className="small text-white-50">
              Clínica nutricional fundada en 2016 en Temuco, Región de La Araucanía. Atención
              personalizada y preventiva.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold">Navegación</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-white-50 text-decoration-none">Inicio</Link></li>
              <li><Link to="/catalogo" className="text-white-50 text-decoration-none">Aranceles y Planes</Link></li>
              <li><Link to="/equipo" className="text-white-50 text-decoration-none">Equipo Médico</Link></li>
              <li><Link to="/contacto" className="text-white-50 text-decoration-none">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold">Contacto</h6>
            <ul className="list-unstyled small text-white-50">
              <li>Temuco, Región de La Araucanía</li>
              <li>contacto@nutrivida.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary mt-4 mb-3" />
        <p className="small text-white-50 mb-0 text-center">
          &copy; 2026 Clínica Nutricional NutriVida — Proyecto DSY1104 Duoc UC
        </p>
      </div>
    </footer>
  );
}

export default Footer;
