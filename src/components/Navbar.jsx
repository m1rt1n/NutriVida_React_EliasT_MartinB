import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar navbar-expand-lg sticky-top py-2 header-nutrivida">
      <div className="container">
        
        {/* 1. Marca / Logo limpio tipo cápsula clínica */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none m-0 py-1">
          <div className="logo-wrapper me-2">
            {/* OJO: Asegúrate de que la imagen exista en public/img/LogoNutriVida.jpg */}
            <img src="/img/LogoNutriVida.jpg" alt="Logotipo Clínica NutriVida" className="logo-navbar" />
          </div>
          <div className="lh-1">
            <span className="fw-bold text-white fs-5 d-block tracking-tight">NutriVida</span>
            <small className="text-warning fw-semibold" style={{ fontSize: '0.7rem' }}>CLÍNICA NUTRICIONAL</small>
          </div>
        </Link>

        {/* Botón menú celular */}
        <button className="navbar-toggler border-light text-white" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion" aria-label="Abrir menú">
          <i className="bi bi-list fs-2"></i>
        </button>

        {/* 2. Enlaces en 1 sola línea y Botones alineados */}
        <div className="collapse navbar-collapse" id="menuNavegacion">
          <nav className="navbar-nav mx-auto gap-lg-1 my-2 my-lg-0 align-items-lg-center">
            {/* Como es una SPA, cambiamos todos los <a href="..."> por <Link to="..."> */}
            <Link to="/" className="nav-link link-menu">Inicio</Link>
            <Link to="/especialidad" className="nav-link link-menu">Especialidad</Link>
            <Link to="/catalogo" className="nav-link link-menu">Aranceles y Planes</Link>
            <Link to="/equipo" className="nav-link link-menu">Equipo Médico</Link>
            <Link to="/dudas" className="nav-link link-menu">Dudas</Link>
            <Link to="/contacto" className="nav-link link-menu">Contacto</Link>
          </nav>

          {/* 3. Botones compactos sin bajar de línea (flex-nowrap) */}
          <div className="d-flex flex-nowrap align-items-center gap-2 mt-2 mt-lg-0">
            <button id="btn-ver-admin" className="btn btn-outline-warning btn-sm fw-semibold text-nowrap d-none" type="button">
              <i className="bi bi-sliders me-1"></i>Admin
            </button>
            <button id="btn-ver-login" className="btn btn-acceso btn-sm fw-semibold text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#modalLogin">
              <i className="bi bi-person me-1"></i>Ingresar
            </button>
            <button id="btn-ver-registro" className="btn btn-outline-light btn-sm fw-semibold text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#modalRegistro">
              Crear Cuenta
            </button>
            <button id="btn-cerrar-sesion" className="btn btn-danger btn-sm fw-semibold text-nowrap d-none" type="button">
              Salir
            </button>
            <button className="btn btn-warning btn-sm fw-bold text-dark text-nowrap shadow-sm px-3 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito">
              <i className="bi bi-calendar2-check me-1"></i>Reservas (<span id="contador-productos">0</span>)
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;