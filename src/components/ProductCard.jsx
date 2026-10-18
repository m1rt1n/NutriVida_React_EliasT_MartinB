import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ producto, agregarAlCarrito }) => {
  // Asegurar que las propiedades existan para evitar errores de renderizado
  const { id, nombre, precio, categoria, imagen, descripcion } = producto;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0 transition-hover">
        {/* Imagen del producto con etiqueta de categoría */}
        <div className="position-relative">
          <img 
            src={imagen || 'https://via.placeholder.com/300x200?text=NutriVida'} 
            className="card-img-top" 
            alt={nombre}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <span className="position-absolute top-0 end-0 m-2 badge bg-success text-white shadow-sm">
            {categoria || 'Saludable'}
          </span>
        </div>

        {/* Cuerpo de la tarjeta */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold text-dark">{nombre}</h5>
          <p className="card-text text-muted small flex-grow-1">
            {descripcion ? (descripcion.length > 80 ? descripcion.substring(0, 80) + '...' : descripcion) : 'Producto natural y saludable seleccionado especialmente para tu bienestar.'}
          </p>
          <div className="mb-3">
            <span className="fs-5 fw-bold text-success">
              ${precio ? precio.toLocaleString('es-CL') : '0'}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success flex-grow-1 fw-bold shadow-sm"
              onClick={() => agregarAlCarrito(producto)}
            >
              🛒 Añadir
            </button>
            <Link 
              to={`/producto/${id}`} 
              className="btn btn-outline-secondary"
              title="Ver detalle"
            >
              🔍
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;