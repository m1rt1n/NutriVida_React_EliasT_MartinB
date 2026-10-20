import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { obtenerServicios } from "../data/db";

function Home() {
  const seguros = obtenerServicios("consulta") || [];
  const destacados = [
    seguros.length > 0 ? seguros[0] : null,
    seguros.length > 1 ? seguros[1] : null,
    seguros.length > 2 ? seguros[2] : null,
  ].filter(Boolean);

  return (
    <>
      {/* Carrusel Deslizable Interactivo */}
      <div id="heroCarousel" className="carousel slide carousel-fade mb-4 shadow-sm" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        
        <div className="carousel-inner">
          {/* Slide 1: Asesoría Nutricional Personalizada */}
          <div className="carousel-item active hero-banner text-center text-white" style={{ padding: '6rem 0 8rem 0' }}>
            <div className="container">
              <h1 className="display-5 fw-bold mb-3">Asesoría Nutricional Personalizada</h1>
              <p className="fs-5 mx-auto hero-texto" style={{ maxWidth: '700px' }}>
                Planes nutricionales a tu medida: pérdida de peso, rendimiento deportivo y alimentación vegetariana/vegana.
              </p>
            </div>
          </div>
          
          {/* Slide 2: Nutrición Deportiva Avanzada (/pexels-ogutomacedo-13013778.jpg) */}
          <div
            className="carousel-item text-center text-white"
            style={{
              backgroundImage: "linear-gradient(90deg, rgba(18, 53, 30, 0.65) 0%, rgba(30, 86, 49, 0.50) 50%, rgba(0, 0, 0, 0.55) 100%), url('/pexels-ogutomacedo-13013778.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 55%',
              padding: '6rem 0 8rem 0',
            }}
          >
            <div className="container">
              <h1 className="display-5 fw-bold mb-3" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.65)' }}>
                Nutrición Deportiva Avanzada
              </h1>
              <p className="fs-5 mx-auto hero-texto" style={{ maxWidth: '700px' }}>
                Mejora tu rendimiento físico, aumenta masa muscular y optimiza tu recuperación con nuestros especialistas.
              </p>
            </div>
          </div>
          
          {/* Slide 3: Evaluación de Composición Corporal (/pexels-karola-g-5714308.jpg)
              Se usa backgroundPosition: 'center 70%' para encuadrar directamente el bíceps,
              la cinta métrica y las manos, ya que la foto original es vertical (682x1024). */}
          <div
            className="carousel-item text-center text-white"
            style={{
              backgroundImage: "linear-gradient(90deg, rgba(18, 53, 30, 0.52) 0%, rgba(30, 86, 49, 0.42) 50%, rgba(0, 0, 0, 0.45) 100%), url('/pexels-karola-g-5714308.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 70%',
              padding: '6rem 0 8rem 0',
            }}
          >
            <div className="container">
              <h1 className="display-5 fw-bold mb-3" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.65)' }}>
                Evaluación de Composición Corporal
              </h1>
              <p className="fs-5 mx-auto hero-texto" style={{ maxWidth: '700px' }}>
                Conoce tu porcentaje exacto de masa grasa y muscular a través de nuestros exámenes especializados.
              </p>
            </div>
          </div>
        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4 tarjetas-acceso-rapido mb-5" style={{ marginTop: '-4.5rem' }}>
          <div className="col">
            <Link to="/catalogo" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo bg-white">
                <i className="bi bi-clipboard2-pulse fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Aranceles y Planes</h5>
                <p className="text-muted small mb-0">Revisa precios y agenda tu primera consulta.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/equipo" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo bg-white">
                <i className="bi bi-people fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Equipo Nutricional</h5>
                <p className="text-muted small mb-0">Conoce a nuestras nutricionistas y sus especialidades.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/contacto" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm border-0 text-center p-3 tarjeta-atajo bg-white">
                <i className="bi bi-chat-dots fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">Contacto</h5>
                <p className="text-muted small mb-0">¿Dudas? Escríbenos y te respondemos a la brevedad.</p>
              </div>
            </Link>
          </div>
        </div>

        <section className="mb-5 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h3 className="fw-bold text-success m-0">Servicios Destacados</h3>
            <Link to="/catalogo" className="btn btn-sm btn-outline-success rounded-pill px-3">Ver todo el catálogo</Link>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {destacados.map((servicio, index) => (
              <ProductCard key={servicio.codigo || index} servicio={servicio} index={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;