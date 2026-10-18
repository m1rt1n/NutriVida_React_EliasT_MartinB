import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { obtenerServicios } from "../data/db";

function Home() {
  // Mostramos 3 servicios destacados (uno de cada categoría principal)
  const destacados = [
    obtenerServicios("consulta")[0],
    obtenerServicios("plan")[0],
    obtenerServicios("teleconsulta")[0],
  ];

  return (
    <>
      <section className="hero-banner text-center text-white mb-4">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Asesoría Nutricional Personalizada</h1>
          <p className="fs-5 mx-auto mb-4 hero-texto">
            Planes nutricionales a tu medida: pérdida de peso, rendimiento deportivo y
            alimentación vegetariana/vegana.
          </p>
          <Link to="/equipo" className="btn btn-warning btn-lg px-5 shadow fw-bold text-dark">
            Conocer Especialistas
          </Link>
        </div>
      </section>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4 tarjetas-acceso-rapido mb-5">
          <div className="col">
            <Link to="/catalogo" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo">
                <i className="bi bi-clipboard2-pulse fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Aranceles y Planes</h5>
                <p className="text-muted small mb-0">Revisa precios y agenda tu primera consulta.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/equipo" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo">
                <i className="bi bi-people fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Equipo Médico</h5>
                <p className="text-muted small mb-0">Conoce a nuestras nutricionistas y sus especialidades.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/contacto" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo">
                <i className="bi bi-chat-dots fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Contacto</h5>
                <p className="text-muted small mb-0">¿Dudas? Escríbenos y te respondemos a la brevedad.</p>
              </div>
            </Link>
          </div>
        </div>

        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h3 className="fw-bold text-success m-0">Servicios Destacados</h3>
            <Link to="/catalogo" className="btn btn-sm btn-outline-success">Ver todo el catálogo</Link>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {destacados.map((servicio) => (
              <ProductCard key={servicio.codigo} servicio={servicio} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
