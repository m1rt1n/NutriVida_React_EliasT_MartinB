// ==========================================================================
// Navbar.jsx
// ==========================================================================
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, cerrarSesion } = useAuth();
  
  // Condición de seguridad: Solo es true si el usuario actual es administrador
  const esAdmin = usuario?.rol === "administrador";

  return (
    <header className="navbar navbar-expand-lg sticky-top py-2 header-nutrivida shadow-sm">
      <div className="container">

        {/* Marca / Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none m-0 py-1">
          <div className="logo-wrapper me-2">
            <img src="/LogoNutriVida.jpg" alt="Logotipo Clínica NutriVida" className="logo-navbar" />
          </div>
          <div className="lh-1">
            <span className="fw-bold text-white fs-5 d-block tracking-tight">NutriVida</span>
            <small className="text-warning fw-semibold" style={{ fontSize: "0.7rem" }}>CLÍNICA NUTRICIONAL</small>
          </div>
        </Link>

        <button className="navbar-toggler border-light text-white" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion" aria-label="Abrir menú">
          <i className="bi bi-list fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="menuNavegacion">
          <nav className="navbar-nav mx-auto gap-lg-1 my-2 my-lg-0 align-items-lg-center">
            <Link to="/" className="nav-link link-menu">Inicio</Link>
            <Link to="/especialidad" className="nav-link link-menu">Especialidad</Link>
            <Link to="/catalogo" className="nav-link link-menu">Aranceles y Planes</Link>
            <Link to="/equipo" className="nav-link link-menu">Equipo Médico</Link>
            <Link to="/dudas" className="nav-link link-menu">Dudas</Link>
            <Link to="/contacto" className="nav-link link-menu">Contacto</Link>
          </nav>

          <div className="d-flex flex-nowrap align-items-center gap-2 mt-2 mt-lg-0">
            
            {/* BOTÓN MÁGICO: Solo visible si esAdmin es true */}
            {esAdmin && (
              <Link to="/admin" className="btn btn-light btn-sm fw-bold text-success text-nowrap shadow-sm">
                <i className="bi bi-gear-fill me-1"></i>Panel Admin
              </Link>
            )}

            {/* BOTONES DE SESIÓN */}
            {usuario ? (
              <button onClick={cerrarSesion} className="btn btn-danger btn-sm fw-semibold text-nowrap">
                Salir ({usuario.nombre})
              </button>
            ) : (
              <>
                <button className="btn btn-acceso btn-sm fw-semibold text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#modalLogin">
                  <i className="bi bi-person me-1"></i>Ingresar
                </button>
                <button className="btn btn-outline-light btn-sm fw-semibold text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#modalRegistro">
                  Crear Cuenta
                </button>
              </>
            )}

            {/* CARRITO / RESERVAS */}
            <button className="btn btn-warning btn-sm fw-bold text-dark text-nowrap shadow-sm px-3 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito">
              <i className="bi bi-calendar2-check me-1"></i>Reservas ({carrito.length})
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;