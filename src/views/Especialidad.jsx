import { Link } from "react-router-dom";
import { categorias } from "../data/db";

function Especialidad() {
  return (
    <div className="container my-5">
      <header className="border-bottom pb-2 mb-4">
        <h3 className="fw-bold text-success m-0">Nuestras Áreas de Atención</h3>
        <p className="text-muted m-0">Elige el tipo de servicio que necesitas y revisa los planes disponibles.</p>
      </header>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {categorias.map((cat) => (
          <div className="col" key={cat.id}>
            <div className="card h-100 shadow-sm border-0 text-center p-4 tarjeta-atajo">
              <i className="bi bi-heart-pulse fs-1 text-success mb-3"></i>
              <h5 className="fw-bold">{cat.nombre}</h5>
              <Link to={`/catalogo?categoria=${cat.id}`} className="btn btn-sm btn-outline-success mt-2">
                Ver planes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Especialidad;
