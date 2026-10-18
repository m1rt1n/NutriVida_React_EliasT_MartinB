// ==========================================================================
// validaciones.js
// --------------------------------------------------------------------------
// Mismas reglas de negocio que ya tenían en app.js (versión HTML), solo que
// ahora viven en un módulo aparte para que cualquier componente React pueda
// importarlas y reutilizarlas (login, registro, contacto, checkout).
// ==========================================================================

// Dominios de correo permitidos
export function validarDominioCorreo(correo) {
  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  return dominiosPermitidos.some((dominio) => correo.toLowerCase().endsWith(dominio));
}

// Algoritmo de validación de RUT chileno (módulo 11)
export function validarRutChileno(rutCompleto) {
  const limpio = rutCompleto.toUpperCase().replace(/\./g, "").replace(/-/g, "").trim();
  if (limpio.length < 7 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = "";
  if (dvEsperadoNum === 11) dvEsperado = "0";
  else if (dvEsperadoNum === 10) dvEsperado = "K";
  else dvEsperado = dvEsperadoNum.toString();

  return dv === dvEsperado;
}

// Comunas por región (mismo objeto que en app.js)
export const comunasPorRegion = {
  araucania: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
  metropolitana: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"],
  biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles"],
};

export function formatoCLP(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}
