// ==========================================================================
// db.js — "Base de datos" simulada de NutriVida
// --------------------------------------------------------------------------
// La evaluación pide un archivo JS que actúe como fuente de datos simulada
// (similar a una base de datos) y funciones CRUD (Crear, Leer, Actualizar,
// Eliminar) sobre esos datos. Acá se simula con un arreglo en memoria que se
// sincroniza con localStorage, para que los cambios del panel admin
// sobrevivan a un refresco de la página (persistencia en el navegador).
// ==========================================================================

const CLAVE_SERVICIOS = "nutrivida_servicios";

// Catálogo inicial, migrado 1:1 desde el Excel de catálogo del proyecto
// (DSY1104 - Forma D - Catalogo Clinica NutriVida.xlsx)
const serviciosIniciales = [
  { codigo: "CN001", categoria: "consulta", nombre: "Primera consulta nutricional", duracion: "50 min", modalidad: "Presencial", precio: 35000, stock: null, stockCritico: null, descripcion: "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio." },
  { codigo: "CN002", categoria: "consulta", nombre: "Control nutricional (seguimiento)", duracion: "30 min", modalidad: "Presencial", precio: 25000, stock: null, stockCritico: null, descripcion: "Seguimiento mensual: medición de indicadores y ajuste del plan vigente." },
  { codigo: "CN003", categoria: "consulta", nombre: "Control nutricional quincenal", duracion: "30 min", modalidad: "Presencial", precio: 22000, stock: null, stockCritico: null, descripcion: "Seguimiento intensivo cada 15 días. Recomendado en los primeros 2 meses." },
  { codigo: "CN004", categoria: "teleconsulta", nombre: "Teleconsulta nutricional", duracion: "30 min", modalidad: "Online (video)", precio: 20000, stock: null, stockCritico: null, descripcion: "Consulta de seguimiento vía videollamada. Requiere contar con consulta presencial previa." },
  { codigo: "CN005", categoria: "consulta", nombre: "Consulta de urgencia / reagendada", duracion: "30 min", modalidad: "Presencial", precio: 28000, stock: null, stockCritico: null, descripcion: "Para pacientes que requieren atención fuera de su control habitual." },
  { codigo: "PL001", categoria: "plan", nombre: "Plan pérdida de peso (1 mes)", duracion: "1 mes", modalidad: "Presencial", precio: 65000, stock: 10, stockCritico: 2, descripcion: "Incluye primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp." },
  { codigo: "PL002", categoria: "plan", nombre: "Plan pérdida de peso (3 meses)", duracion: "3 meses", modalidad: "Presencial", precio: 170000, stock: 8, stockCritico: 2, descripcion: "Incluye primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo." },
  { codigo: "PL003", categoria: "plan", nombre: "Plan nutrición deportiva (1 mes)", duracion: "1 mes", modalidad: "Presencial", precio: 70000, stock: 12, stockCritico: 3, descripcion: "Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos energéticos y proteicos." },
  { codigo: "PL004", categoria: "plan", nombre: "Plan control diabetes / hipertensión", duracion: "1 mes", modalidad: "Presencial", precio: 75000, stock: 6, stockCritico: 2, descripcion: "Plan adaptado para patologías metabólicas. Coordinación con médico tratante si aplica." },
  { codigo: "PL005", categoria: "plan", nombre: "Plan alimentación vegetariana/vegana", duracion: "1 mes", modalidad: "Presencial", precio: 68000, stock: 9, stockCritico: 2, descripcion: "Diseñado para garantizar aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales." },
  { codigo: "PL006", categoria: "plan", nombre: "Plan alimentación infantil (2-12 años)", duracion: "1 mes", modalidad: "Presencial", precio: 65000, stock: 7, stockCritico: 2, descripcion: "Evaluación nutricional pediátrica y diseño de plan adaptado a la etapa de desarrollo del niño." },
  { codigo: "EV001", categoria: "evaluacion", nombre: "Antropometría completa", duracion: "20 min", modalidad: "Presencial", precio: 18000, stock: null, stockCritico: null, descripcion: "Peso, talla, IMC, circunferencia de cintura, cadera, brazo y % de grasa corporal con bioimpedanciometría." },
  { codigo: "EV002", categoria: "evaluacion", nombre: "Bioimpedanciometría", duracion: "15 min", modalidad: "Presencial", precio: 12000, stock: null, stockCritico: null, descripcion: "Medición de composición corporal: masa grasa, masa muscular, agua corporal y edad metabólica." },
  { codigo: "EV003", categoria: "evaluacion", nombre: "Encuesta de hábitos alimentarios", duracion: "20 min", modalidad: "Presencial", precio: 10000, stock: null, stockCritico: null, descripcion: "Análisis del patrón alimentario actual. Identificación de déficit y excesos nutricionales." },
  { codigo: "EV004", categoria: "evaluacion", nombre: "Análisis de exámenes de laboratorio", duracion: "20 min", modalidad: "Presencial", precio: 15000, stock: null, stockCritico: null, descripcion: "Interpretación de hemograma, perfil bioquímico y lipídico en contexto nutricional." },
  { codigo: "TG001", categoria: "taller", nombre: "Taller de alimentación saludable", duracion: "90 min", modalidad: "Presencial (grupo)", precio: 15000, stock: 10, stockCritico: 2, descripcion: "Máx. 10 personas. Conceptos básicos de alimentación equilibrada y lectura de etiquetas." },
  { codigo: "TG002", categoria: "taller", nombre: "Taller de cocina nutritiva", duracion: "120 min", modalidad: "Presencial (grupo)", precio: 20000, stock: 8, stockCritico: 2, descripcion: "Preparación de recetas saludables. Incluye degustación. Máx. 8 personas." },
  { codigo: "TG003", categoria: "taller", nombre: "Taller nutrición para deportistas", duracion: "90 min", modalidad: "Presencial (grupo)", precio: 18000, stock: 12, stockCritico: 3, descripcion: "Hidratación, nutrición pre y post entrenamiento, suplementación básica. Máx. 12 personas." },
];

export const categorias = [
  { id: "consulta", nombre: "Consultas" },
  { id: "teleconsulta", nombre: "Teleconsultas" },
  { id: "plan", nombre: "Planes especializados" },
  { id: "evaluacion", nombre: "Evaluaciones" },
  { id: "taller", nombre: "Talleres grupales" },
];

export const nutricionistas = [
  { codigo: "NUT001", nombre: "Nut. Carolina Fuentes M.", especialidad: "Obesidad y síndrome metabólico", dias: "Lunes, Miércoles y Viernes", horario: "09:00 – 17:00 hrs" },
  { codigo: "NUT002", nombre: "Nut. Rodrigo Sepúlveda A.", especialidad: "Nutrición deportiva y rendimiento", dias: "Martes, Jueves y Sábado", horario: "09:00 – 14:00 hrs" },
  { codigo: "NUT003", nombre: "Nut. Daniela Morales C.", especialidad: "Alimentación vegetariana, vegana y trastornos alimentarios", dias: "Lunes a Viernes", horario: "08:00 – 13:00 hrs" },
  { codigo: "NUT004", nombre: "Nut. Felipe Araya R.", especialidad: "Nutrición pediátrica y familiar", dias: "Martes a Viernes", horario: "14:00 – 19:00 hrs" },
];

// --------------------------------------------------------------------------
// Persistencia: cargamos desde localStorage si ya existe algo guardado
// (por ejemplo, porque el admin ya creó/editó/eliminó servicios antes).
// Si no hay nada, partimos desde el catálogo inicial de arriba.
// --------------------------------------------------------------------------
function cargarServicios() {
  try {
    const guardado = localStorage.getItem(CLAVE_SERVICIOS);
    return guardado ? JSON.parse(guardado) : [...serviciosIniciales];
  } catch {
    return [...serviciosIniciales];
  }
}

function guardarServicios(lista) {
  localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(lista));
}

let servicios = cargarServicios();

// ============================== CRUD =======================================

// CREATE — agrega un nuevo servicio. Devuelve el servicio creado.
export function crearServicio(servicio) {
  servicios = [...servicios, servicio];
  guardarServicios(servicios);
  return servicio;
}

// READ (todos) — opcionalmente filtrados por categoría
export function obtenerServicios(categoria) {
  if (!categoria || categoria === "todas") return [...servicios];
  return servicios.filter((s) => s.categoria === categoria);
}

// READ (uno) — por código
export function obtenerServicioPorCodigo(codigo) {
  return servicios.find((s) => s.codigo === codigo) || null;
}

// UPDATE — reemplaza los datos de un servicio existente por su código
export function actualizarServicio(codigo, cambios) {
  servicios = servicios.map((s) => (s.codigo === codigo ? { ...s, ...cambios } : s));
  guardarServicios(servicios);
  return obtenerServicioPorCodigo(codigo);
}

// DELETE — elimina un servicio por código
export function eliminarServicio(codigo) {
  servicios = servicios.filter((s) => s.codigo !== codigo);
  guardarServicios(servicios);
}

// Restablece el catálogo a su estado inicial (útil para pruebas / demo)
export function restablecerServicios() {
  servicios = [...serviciosIniciales];
  guardarServicios(servicios);
  return servicios;
}
