// ==========================================================================
// CarritoContext.jsx
// --------------------------------------------------------------------------
// Es el equivalente en React al bloque "2. GESTIÓN DEL CARRITO Y LOCALSTORAGE"
// de app.js. En la versión HTML, el carrito era una variable global (`let
// carrito`) que cualquier parte del script podía tocar. En React no usamos
// variables globales: usamos un Context + useState, que vive "arriba" de
// toda la app (en App.jsx) y cualquier componente hijo puede leer o
// modificar llamando a los hooks que exportamos acá abajo.
// ==========================================================================

import { createContext, useContext, useEffect, useState } from "react";

const CLAVE_CARRITO = "carritoNutriVida";
const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  // Mismo patrón que antes: leer de localStorage al iniciar, o arreglo vacío
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  });

  // Cada vez que "carrito" cambia, se vuelve a guardar en localStorage.
  // Esto reemplaza el guardado manual que hacía actualizarCarritoHTML().
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  function agregarAlCarrito(servicio) {
    setCarrito((actual) => [
      ...actual,
      { codigo: servicio.codigo, nombre: servicio.nombre, precio: servicio.precio },
    ]);
  }

  function eliminarDelCarrito(indice) {
    setCarrito((actual) => actual.filter((_, i) => i !== indice));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  const valor = { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, total };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

// Hook de conveniencia: en vez de importar useContext + CarritoContext en
// cada componente, solo se llama useCarrito().
export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de un <CarritoProvider>");
  }
  return contexto;
}
