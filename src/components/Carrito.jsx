// ==========================================================================
// Carrito.jsx
// --------------------------------------------------------------------------
// CONTRATO: NO recibe props. Se conecta directo al CarritoContext con
// useCarrito(), igual que ProductCard. Es el panel lateral (offcanvas) que
// el botón "Reservas" del Navbar abre con data-bs-target="#offcanvasCarrito"
// — por eso el id de acá abajo tiene que calzar exacto con ese atributo.
// ==========================================================================

import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { formatoCLP } from "../utils/validaciones";

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasCarrito" aria-labelledby="offcanvasCarritoLabel">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold text-success" id="offcanvasCarritoLabel">
          🛒 Tu Carrito de Servicios
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        {carrito.length === 0 ? (
          <div className="text-center my-4">
            <p className="text-muted mb-3">Tu carrito de servicios está vacío.</p>
            <Link to="/catalogo" className="btn btn-success btn-sm" data-bs-dismiss="offcanvas">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <ul className="list-group mb-3">
            {carrito.map((item, index) => (
              <li key={`${item.codigo}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.nombre}</strong>
                  <span className="text-muted d-block small">{formatoCLP(item.precio)} CLP</span>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarDelCarrito(index)}>
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold">Total a Pagar:</span>
            <span className="fs-5 fw-bold text-success">{formatoCLP(total)} CLP</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger w-50" onClick={vaciarCarrito} disabled={carrito.length === 0}>
              Vaciar
            </button>
            <Link
              to="/checkout"
              className="btn btn-success w-50"
              data-bs-dismiss="offcanvas"
              aria-disabled={carrito.length === 0}
              onClick={(e) => carrito.length === 0 && e.preventDefault()}
            >
              Ir a pagar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
