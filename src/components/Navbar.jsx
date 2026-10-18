import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, cerrarSesion } = useAuth();
  
  const esAdmin = usuario?.rol === "administrador";

  return (
    <header className="navbar navbar-expand-lg sticky-top py-2 header-nutrivida shadow-sm">
      <div className="container">

        {/* Marca / Logo - Arreglado con borde circular perfecto */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none m-0 py-1">
          <div className="bg-white shadow-sm d-flex align-items-center justify-content-center me-2" style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
            <img src="/LogoNutriVida.jpg" alt="Logotipo Clínica NutriVida" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            {/* Cambio de nombre: Equipo Nutricional */}
            <Link to="/equipo" className="nav-link link-menu">Equipo Nutricional</Link>
            <Link to="/dudas" className="nav-link link-menu">Dudas</Link>
            <Link to="/contacto" className="nav-link link-menu">Contacto</Link>
          </nav>

          <div className="d-flex flex-nowrap align-items-center gap-2 mt-2 mt-lg-0">
            
            {esAdmin && (
              <Link to="/admin" className="btn btn-light btn-sm fw-bold text-success text-nowrap shadow-sm">
                <i className="bi bi-gear-fill me-1"></i>Panel Admin
              </Link>
            )}

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