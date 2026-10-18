import React from 'react';
import { Link } from 'react-router-dom'; // tener react-router-dom configurado

const Carrito = ({ carrito = [], actualizarCantidad, eliminarProducto, vaciarCarrito }) => {
  // Cálculo del precio total de los productos en el carrito
  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  if (carrito.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="card shadow-sm p-5 border-0 bg-light">
          <h2 className="text-muted mb-3">Tu carrito de compras está vacío</h2>
          <p className="text-secondary mb-4">¡Explora nuestro catálogo y descubre productos saludables para ti en NutriVida!</p>
          <div>
            <Link to="/catalogo" className="btn btn-success btn-lg px-4">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-success">🛒 Carrito de Compras - NutriVida</h2>
      <div className="row">
        {/* Lista de Productos en el Carrito */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th className="text-center">Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((producto) => (
                      <tr key={producto.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={producto.imagen || 'https://via.placeholder.com/60'} 
                              alt={producto.nombre} 
                              className="rounded me-3"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-0 fw-bold">{producto.nombre}</h6>
                              <small className="text-muted">Categoría: {producto.categoria}</small>
                            </div>
                          </div>
                        </td>
                        <td>${producto.precio.toLocaleString('es-CL')}</td>
                        <td className="text-center" style={{ width: '140px' }}>
                          <div className="input-group input-group-sm">
                            <button 
                              className="btn btn-outline-secondary" 
                              onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                              disabled={producto.cantidad <= 1}
                            >
                              -
                            </button>
                            <span className="input-group-text bg-white px-3 fw-bold">{producto.cantidad}</span>
                            <button 
                              className="btn btn-outline-secondary" 
                              onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold text-success">
                          ${(producto.precio * producto.cantidad).toLocaleString('es-CL')}
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => eliminarProducto(producto.id)}
                            title="Eliminar producto"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-danger btn-sm" onClick={vaciarCarrito}>
                  Vaciar Carrito
                </button>
                <Link to="/catalogo" className="btn btn-outline-success btn-sm">
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de la Orden (Checkout Preview) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-4">Resumen del Pedido</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">${calcularTotal().toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Despacho</span>
                <span className="text-success fw-bold">Por calcular</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total</h5>
                <h5 className="fw-bold text-success">${calcularTotal().toLocaleString('es-CL')}</h5>
              </div>
              <Link to="/checkout" className="btn btn-success w-100 py-2 fw-bold shadow-sm">
                Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;