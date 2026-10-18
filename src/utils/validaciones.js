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

// Comunas por región (Actualizado con listas completas para Valparaíso y Metropolitana)
export const comunasPorRegion = {
  valparaiso: [
    "Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Casablanca", 
    "Quintero", "Puchuncaví", "Quillota", "La Cruz", "Calera", "Nogales", "Hijuelas", 
    "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo", 
    "San Felipe", "Putaendo", "Santa María", "Panquehue", "Llaillay", "Catemu", 
    "Los Andes", "San Esteban", "Calle Larga", "Rinconada", "Petorca", "La Ligua", 
    "Cabildo", "Zapallar", "Papudo", "Limache", "Olmué", "Isla de Pascua", "Juan Fernández"
  ],
  metropolitana: [
    "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", 
    "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", 
    "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", 
    "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", 
    "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", 
    "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", 
    "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", 
    "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"
  ],
  araucania: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
  biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles"],
};

export function formatoCLP(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}