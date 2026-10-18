// ==========================================================================
// Catalogo.jsx
// --------------------------------------------------------------------------
// Reemplaza la sección #servicios del HTML. La diferencia clave con la
// versión anterior: acá el catálogo NO está escrito a mano en el JSX, se
// LEE desde db.js con obtenerServicios(). Si el admin agrega/edita/borra un
// servicio en el panel, este catálogo se actualiza solo.
// ==========================================================================

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { obtenerServicios, categorias } from "../data/db";

function Catalogo() {
  const [parametros] = useSearchParams();
  const categoriaInicial = parametros.get("categoria") || "todas";
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const servicios = obtenerServicios(categoriaActiva);

  return (
    <div className="container my-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-2 gap-2">
        <h3 className="fw-bold text-success m-0">Nuestros Servicios y Planes</h3>
        <span className="badge bg-secondary">Precios en CLP</span>
      </header>

      {/* Pestañas de categoría, estilo "nav-pills" del sitio de referencia */}
      <ul className="nav nav-pills gap-2 mb-4 flex-wrap">
        <li className="nav-item">
          <button
            className={`nav-link ${categoriaActiva === "todas" ? "active" : ""}`}
            onClick={() => setCategoriaActiva("todas")}
          >
            Todas
          </button>
        </li>
        {categorias.map((cat) => (
          <li className="nav-item" key={cat.id}>
            <button
              className={`nav-link ${categoriaActiva === cat.id ? "active" : ""}`}
              onClick={() => setCategoriaActiva(cat.id)}
            >
              {cat.nombre}
            </button>
          </li>
        ))}
      </ul>

      {servicios.length === 0 ? (
        <p className="text-muted">No hay servicios en esta categoría por ahora.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {servicios.map((servicio) => (
            <ProductCard key={servicio.codigo} servicio={servicio} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
