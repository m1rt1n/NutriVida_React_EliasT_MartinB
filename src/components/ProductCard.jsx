// ==========================================================================
// ProductCard.jsx
// --------------------------------------------------------------------------
// CONTRATO DE ESTE COMPONENTE: recibe una única prop llamada `servicio`,
// con la forma que define src/data/db.js (codigo, nombre, precio, categoria,
// descripcion, duracion, modalidad). NO recibe `agregarAlCarrito` por
// prop: lo toma directo del CarritoContext con useCarrito(), igual que
// hacen Home.jsx y Catalogo.jsx al usar <ProductCard servicio={s} />.
// ==========================================================================

import { useCarrito } from "../context/CarritoContext";
import { formatoCLP } from "../utils/validaciones";

const ETIQUETA_CATEGORIA = {
  consulta: { texto: "Consulta Presencial", clase: "bg-primary" },
  teleconsulta: { texto: "Teleconsulta", clase: "bg-info text-dark" },
  plan: { texto: "Plan Especializado", clase: "bg-warning text-dark" },
  evaluacion: { texto: "Evaluación", clase: "bg-secondary" },
  taller: { texto: "Taller Grupal", clase: "bg-success" },
};

function ProductCard({ servicio }) {
  const { agregarAlCarrito } = useCarrito();

  // Guarda de seguridad: si algún día esto se renderiza sin servicio
  // (por ejemplo, por un bug como el que acabamos de arreglar), mostramos
  // un aviso en vez de que la página entera se rompa en blanco.
  if (!servicio) {
    return (
      <div className="col">
        <div className="alert alert-warning small mb-0">Servicio no disponible.</div>
      </div>
    );
  }

  const etiqueta = ETIQUETA_CATEGORIA[servicio.categoria] || { texto: servicio.categoria, clase: "bg-secondary" };
  const stockCritico =
    servicio.stock !== null && servicio.stockCritico !== null && servicio.stock <= servicio.stockCritico;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 card-servicio">
        <div className="card-body pb-0 bg-transparent">
          <span className={`badge ${etiqueta.clase} mb-2`}>{etiqueta.texto}</span>
          <h4 className="card-title fw-bold h5">{servicio.nombre}</h4>
          <p className="text-muted small mb-1">
            Código: {servicio.codigo} · {servicio.duracion} · {servicio.modalidad}
          </p>
          {stockCritico && <p className="small text-danger fw-semibold mb-0">⚠️ Cupos limitados</p>}
        </div>
        <div className="card-body pt-2">
          <p className="card-text">{servicio.descripcion}</p>
          <span className="h5 text-success fw-bold d-block">{formatoCLP(servicio.precio)}</span>
        </div>
        <div className="card-footer bg-white border-0 pt-0">
          <button type="button" className="btn btn-outline-success w-100 fw-bold" onClick={() => agregarAlCarrito(servicio)}>
            🛒 Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
