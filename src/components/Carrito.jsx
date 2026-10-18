import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { formatoCLP } from "../utils/validaciones";

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();
  const navigate = useNavigate();

  // Esta función cierra el panel lateral forzadamente y luego te lleva al checkout
  const manejarIrAPagar = () => {
    const btnCerrar = document.querySelector('#offcanvasCarrito .btn-close');
    if (btnCerrar) btnCerrar.click();
    navigate("/checkout");
  };

  return (
    <div className="offcanvas offcanvas-end shadow" tabIndex="-1" id="offcanvasCarrito" aria-labelledby="offcanvasCarritoLabel">
      <div className="offcanvas-header bg-success text-white">
        <h5 className="offcanvas-title fw-bold" id="offcanvasCarritoLabel">
          <i className="bi bi-cart3 me-2"></i>Tus Reservas
        </h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      
      <div className="offcanvas-body d-flex flex-column bg-light p-0">
        {carrito.length === 0 ? (
          <div className="text-center my-5 p-4">
            <i className="bi bi-calendar-x display-1 text-muted opacity-25 mb-3 d-block"></i>
            <p className="text-muted fs-5 fw-semibold">No tienes reservas activas.</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush mb-3 flex-grow-1 overflow-auto">
            {carrito.map((item, index) => (
              <li key={`${item.codigo}-${index}`} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <strong className="text-dark d-block mb-1" style={{ fontSize: '0.95rem' }}>{item.nombre}</strong>
                  <span className="badge bg-success bg-opacity-10 text-success fs-6 px-2 py-1">{formatoCLP(item.precio)}</span>
                </div>
                {/* Botón eliminar arreglado */}
                <button className="btn btn-outline-danger border-0 rounded-circle shadow-sm" onClick={() => eliminarDelCarrito(index)} title="Quitar servicio">
                  <i className="bi bi-trash fs-5"></i>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto p-4 border-top bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-6 fw-bold text-muted text-uppercase">Total:</span>
            <span className="fs-3 fw-bolder text-success">{formatoCLP(total)}</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary w-50 rounded-pill fw-bold" onClick={vaciarCarrito} disabled={carrito.length === 0}>
              Vaciar
            </button>
            <button 
              className="btn btn-success w-50 rounded-pill fw-bold shadow-sm" 
              onClick={manejarIrAPagar} 
              disabled={carrito.length === 0}
            >
              Ir a pagar <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;