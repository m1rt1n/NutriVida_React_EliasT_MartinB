import { useCarrito } from "../context/CarritoContext";
import { formatoCLP } from "../utils/validaciones";

// Diccionario para mostrar nombres limpios de las categorías sin usar colores saturados
const CATEGORIAS_TEXTO = {
  consulta: "Consulta Presencial",
  teleconsulta: "Teleconsulta",
  plan: "Plan Especializado",
  evaluacion: "Evaluación",
  taller: "Taller Grupal",
};

function ProductCard({ servicio }) {
  const { agregarAlCarrito } = useCarrito();

  if (!servicio) return null;

  const textoCategoria = CATEGORIAS_TEXTO[servicio.categoria] || servicio.categoria;
  const stockCritico = servicio.stock !== null && servicio.stockCritico !== null && servicio.stock <= servicio.stockCritico;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift overflow-hidden" style={{ border: '1px solid #e2e8e4' }}>
        
        <div className="card-body p-4 d-flex flex-column bg-white text-center">
          
          {/* Etiqueta de categoría sutil y minimalista */}
          <div className="mb-3">
            <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill text-uppercase fw-semibold" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>
              {textoCategoria}
            </span>
          </div>

          <h5 className="card-title fw-bolder mb-3" style={{ color: '#12351e', lineHeight: '1.4' }}>
            {servicio.nombre}
          </h5>
          
          {/* Detalles técnicos (código y duración) limpios */}
          <div className="text-muted small mb-3 d-flex justify-content-center flex-wrap gap-2">
            <span><i className="bi bi-upc-scan me-1"></i>{servicio.codigo}</span>
            <span><i className="bi bi-clock me-1"></i>{servicio.duracion}</span>
          </div>
          
          {/* Alerta de stock crítico */}
          {stockCritico && (
            <div className="mb-3">
               <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill border border-danger border-opacity-25">
                 <i className="bi bi-exclamation-circle me-1"></i>Cupos limitados
               </span>
            </div>
          )}
          
          <p className="card-text text-secondary small flex-grow-1 px-2">
            {servicio.descripcion}
          </p>
          
          {/* Sección de Precio y Botón - Limpia y directa */}
          <div className="mt-3 pt-4 border-top">
            <span className="text-danger fw-bold small d-block mb-1">Desde:</span>
            
            {/* Precio destacado solo con tipografía y color institucional */}
            <div className="display-6 fw-bolder mb-4" style={{ color: '#1e5631' }}>
              {formatoCLP(servicio.precio)}
            </div>
            
            <button 
              type="button" 
              className="btn btn-outline-dark w-100 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 btn-transition" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvasCarrito"
              onClick={() => agregarAlCarrito(servicio)}
            >
              CONTRATA <i className="bi bi-arrow-right"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;