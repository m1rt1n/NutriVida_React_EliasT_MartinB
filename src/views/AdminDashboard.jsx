// ==========================================================================
// AdminDashboard.jsx
// ==========================================================================
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  categorias,
} from "../data/db";
import { formatoCLP } from "../utils/validaciones";

const vacioServicio = {
  codigo: "", nombre: "", precio: "", stock: "", stockCritico: "", categoria: "", descripcion: "", duracion: "", modalidad: "",
};

const vacioPaciente = {
  planActual: "", fechaCita: "", horaCita: ""
};

export default function AdminDashboard() {
  const { usuario, listaUsuarios, actualizarPaciente, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [vistaActiva, setVistaActiva] = useState("dashboard");

  // ================= ESTADOS Y FUNCIONES DE SERVICIOS =================
  const [servicios, setServicios] = useState(() => obtenerServicios());
  const [formServicio, setFormServicio] = useState(vacioServicio);
  const [editandoServicio, setEditandoServicio] = useState(null);
  const [erroresServicio, setErroresServicio] = useState({});

  function refrescarServicios() { setServicios(obtenerServicios()); }

  function cargarServicioParaEditar(servicio) {
    setEditandoServicio(servicio.codigo);
    setFormServicio({ ...servicio, stock: servicio.stock ?? "", stockCritico: servicio.stockCritico ?? "" });
    setVistaActiva("servicios"); // Cambia a la vista de servicios si se llama desde otro lado
  }

  function cancelarEdicionServicio() {
    setEditandoServicio(null);
    setFormServicio(vacioServicio);
    setErroresServicio({});
  }

  function manejarEliminarServicio(codigo) {
    if (window.confirm(`¿Eliminar el servicio ${codigo}? Esta acción no se puede deshacer.`)) {
      eliminarServicio(codigo);
      refrescarServicios();
    }
  }

  function manejarSubmitServicio(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formServicio.codigo.trim() || formServicio.codigo.trim().length < 3) nuevosErrores.codigo = "El código debe tener al menos 3 caracteres.";
    if (!formServicio.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";

    const precio = parseInt(formServicio.precio, 10);
    if (isNaN(precio) || precio < 0) nuevosErrores.precio = "Ingresa un precio válido (0 o superior).";

    const stock = formServicio.stock === "" ? null : parseInt(formServicio.stock, 10);
    const stockCritico = formServicio.stockCritico === "" ? null : parseInt(formServicio.stockCritico, 10);
    if (!formServicio.categoria) nuevosErrores.categoria = "Selecciona una categoría.";

    const yaExiste = servicios.some((s) => s.codigo === formServicio.codigo.trim() && s.codigo !== editandoServicio);
    if (yaExiste) nuevosErrores.codigo = "Ya existe un servicio con ese código.";

    setErroresServicio(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const datos = {
      ...formServicio, codigo: formServicio.codigo.trim(), nombre: formServicio.nombre.trim(),
      precio, stock, stockCritico, duracion: formServicio.duracion.trim() || "—", modalidad: formServicio.modalidad.trim() || "Presencial",
    };

    if (editandoServicio) actualizarServicio(editandoServicio, datos);
    else crearServicio(datos);

    refrescarServicios();
    cancelarEdicionServicio();
  }

  // ================= ESTADOS Y FUNCIONES DE PACIENTES =================
  const pacientes = listaUsuarios ? listaUsuarios().filter(u => u.rol === "cliente") : [];
  const [editandoRut, setEditandoRut] = useState(null);
  const [formPaciente, setFormPaciente] = useState(vacioPaciente);

  function cargarPacienteParaEditar(paciente) {
    setEditandoRut(paciente.rut);
    setFormPaciente({
      planActual: paciente.planActual || "",
      fechaCita: paciente.fechaCita || "",
      horaCita: paciente.horaCita || ""
    });
  }

  function cancelarEdicionPaciente() {
    setEditandoRut(null);
    setFormPaciente(vacioPaciente);
  }

  function manejarSubmitPaciente(e) {
    e.preventDefault();
    actualizarPaciente(editandoRut, {
      planActual: formPaciente.planActual.trim(),
      fechaCita: formPaciente.fechaCita,
      horaCita: formPaciente.horaCita
    });
    alert("Datos del paciente actualizados correctamente.");
    cancelarEdicionPaciente();
  }

  // ================= ACCIONES GLOBALES =================
  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/");
  };

  const irATienda = () => {
    navigate("/");
  };

  // Datos de las tarjetas del menú Dashboard adaptadas a tu sistema
  const tarjetasMenu = [
    { id: "dashboard", titulo: "Dashboard", icono: "bi-speedometer2", desc: "Visión general de las métricas clave." },
    { id: "pacientes", titulo: "Pacientes", icono: "bi-people", desc: "Gestión de cuentas y citas de pacientes." },
    { id: "servicios", titulo: "Servicios", icono: "bi-box-seam", desc: "Administrar el catálogo de servicios." },
    { id: "ordenes", titulo: "Órdenes", icono: "bi-cart3", desc: "Seguimiento de compras realizadas." },
    { id: "reportes", titulo: "Reportes", icono: "bi-bar-chart-line", desc: "Informes detallados del sistema." },
    { id: "perfil", titulo: "Perfil", icono: "bi-person", desc: "Configuraciones de tu cuenta." }
  ];

  // ================= SEGURIDAD DE ACCESO =================
  if (!usuario || usuario.rol !== "administrador") {
    return (
      <div className="container my-5 text-center">
        <div className="card border-danger mb-3 p-5 shadow-sm">
          <h4 className="text-danger">Acceso Restringido</h4>
          <p className="text-muted">Esta sección es solo para administradores del sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      
      {/* ==========================================
          SIDEBAR (BARRA LATERAL)
      ========================================== */}
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" style={{ width: "260px", zIndex: 100 }}>
        <div className="d-flex align-items-center mb-4 mt-2 px-2">
          <i className="bi bi-heart-pulse-fill text-success fs-3 me-2"></i>
          <span className="fs-5 fw-bold text-dark">NutriVida Admin</span>
        </div>
        
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          <li className="nav-item">
            <button className={`nav-link w-100 text-start ${vistaActiva === "dashboard" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("dashboard")}>
              <i className="bi bi-speedometer2 me-3"></i> Dashboard
            </button>
          </li>
          <li>
            <button className={`nav-link w-100 text-start ${vistaActiva === "pacientes" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("pacientes")}>
              <i className="bi bi-people me-3"></i> Pacientes
            </button>
          </li>
          <li>
            <button className={`nav-link w-100 text-start ${vistaActiva === "servicios" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("servicios")}>
              <i className="bi bi-box-seam me-3"></i> Servicios
            </button>
          </li>
          <li>
            <button className={`nav-link w-100 text-start ${vistaActiva === "ordenes" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("ordenes")}>
              <i className="bi bi-cart3 me-3"></i> Órdenes
            </button>
          </li>
          <li>
            <button className={`nav-link w-100 text-start ${vistaActiva === "reportes" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("reportes")}>
              <i className="bi bi-bar-chart-line me-3"></i> Reportes
            </button>
          </li>
          <hr className="my-2" />
          <li>
            <button className={`nav-link w-100 text-start ${vistaActiva === "perfil" ? "active bg-success text-white" : "text-dark"}`} onClick={() => setVistaActiva("perfil")}>
              <i className="bi bi-person me-3"></i> Perfil
            </button>
          </li>
        </ul>

        <div className="mt-auto pt-3 d-flex flex-column gap-2">
          <button onClick={irATienda} className="btn btn-dark w-100 d-flex align-items-center justify-content-center">
            <i className="bi bi-shop me-2"></i> Volver a la Tienda
          </button>
          <button onClick={manejarCerrarSesion} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center">
            <i className="bi bi-box-arrow-left me-2"></i> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ==========================================
          CONTENIDO PRINCIPAL
      ========================================== */}
      <div className="flex-grow-1 p-4 overflow-auto">
        
        {/* VISTA: DASHBOARD PRINCIPAL */}
        {vistaActiva === "dashboard" && (
          <div className="container-fluid py-2">
            <h2 className="fw-bold mb-0 text-dark">Dashboard</h2>
            <p className="text-muted mb-4">Resumen de las actividades de la clínica</p>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card text-white bg-success bg-opacity-75 border-0 shadow-sm h-100 p-3 rounded-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1 text-white-50">Pacientes Totales</h6>
                      <h2 className="fw-bold mb-0">{pacientes.length}</h2>
                    </div>
                    <i className="bi bi-people fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-success border-0 shadow-sm h-100 p-3 rounded-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1 text-white-50">Catálogo de Servicios</h6>
                      <h2 className="fw-bold mb-0">{servicios.length}</h2>
                    </div>
                    <i className="bi bi-box-seam fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-dark bg-warning border-0 shadow-sm h-100 p-3 rounded-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1 text-dark-50">Nuevas Órdenes</h6>
                      <h2 className="fw-bold mb-0">0</h2>
                    </div>
                    <i className="bi bi-cart3 fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {tarjetasMenu.map((tarjeta) => (
                <div className="col-md-4 col-lg-3" key={tarjeta.id}>
                  <div 
                    className="card border-0 shadow-sm h-100 text-center p-3 rounded-3" 
                    style={{ cursor: "pointer", transition: "transform 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => setVistaActiva(tarjeta.id)}
                  >
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      <i className={`bi ${tarjeta.icono} fs-2 text-success mb-3`}></i>
                      <h6 className="card-title fw-bold text-dark">{tarjeta.titulo}</h6>
                      <p className="card-text small text-muted mb-0">{tarjeta.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: GESTIÓN DE PACIENTES */}
        {vistaActiva === "pacientes" && (
          <div className="container-fluid py-2">
            <h3 className="fw-bold text-success mb-4"><i className="bi bi-people me-2"></i>Gestión de Pacientes</h3>
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="card shadow-sm border-0 bg-white">
                  <div className="card-body">
                    <h5 className="fw-bold text-success mb-3">
                      {editandoRut ? `Editando Paciente` : "Selecciona un paciente"}
                    </h5>
                    
                    {editandoRut ? (
                      <form onSubmit={manejarSubmitPaciente}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">RUT Seleccionado</label>
                          <input className="form-control form-control-sm" disabled value={editandoRut} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Plan o Asesoría Actual</label>
                          <input 
                            className="form-control form-control-sm" 
                            placeholder="Ej: Plan Descenso 3 Meses" 
                            value={formPaciente.planActual} 
                            onChange={(e) => setFormPaciente({ ...formPaciente, planActual: e.target.value })} 
                          />
                        </div>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <label className="form-label fw-semibold small">Fecha Próx. Cita</label>
                            <input 
                              type="date" 
                              className="form-control form-control-sm" 
                              value={formPaciente.fechaCita} 
                              onChange={(e) => setFormPaciente({ ...formPaciente, fechaCita: e.target.value })} 
                            />
                          </div>
                          <div className="col-6 mb-3">
                            <label className="form-label fw-semibold small">Hora Cita</label>
                            <input 
                              type="time" 
                              className="form-control form-control-sm" 
                              value={formPaciente.horaCita} 
                              onChange={(e) => setFormPaciente({ ...formPaciente, horaCita: e.target.value })} 
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-sm btn-success w-100 fw-bold">Actualizar Datos</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary w-100" onClick={cancelarEdicionPaciente}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-muted small">Haz clic en "Administrar" en la tabla de pacientes para programar sus citas o actualizar sus planes nutricionales.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card shadow-sm border-0 bg-white p-3">
                  <h5 className="fw-bold mb-3">Pacientes Registrados</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle small mb-0">
                      <thead className="table-success">
                        <tr>
                          <th>Paciente</th>
                          <th>Contacto</th>
                          <th>Plan Activo</th>
                          <th>Próxima Cita</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientes.map((p) => (
                          <tr key={p.rut}>
                            <td>
                              <strong>{p.nombre} {p.apellidos}</strong><br />
                              <span className="text-muted" style={{fontSize: '0.8rem'}}>{p.rut}</span>
                            </td>
                            <td>
                              <a href={`mailto:${p.correo}`} className="text-decoration-none">{p.correo}</a><br/>
                              <span className="text-muted">{p.telefono || "Sin teléfono"}</span>
                            </td>
                            <td>
                              {p.planActual ? <span className="badge bg-info text-dark">{p.planActual}</span> : <span className="text-muted">Sin plan</span>}
                            </td>
                            <td>
                              {p.fechaCita ? (
                                <span>
                                  <i className="bi bi-calendar-event me-1"></i>{p.fechaCita} <br/> 
                                  <i className="bi bi-clock me-1"></i>{p.horaCita} hrs
                                </span>
                              ) : <span className="text-muted">No agendado</span>}
                            </td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-outline-success" onClick={() => cargarPacienteParaEditar(p)}>
                                Administrar
                              </button>
                            </td>
                          </tr>
                        ))}
                        {pacientes.length === 0 && (
                          <tr><td colSpan="5" className="text-center text-muted py-3">No hay pacientes registrados en el sistema.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: GESTIÓN DE SERVICIOS */}
        {vistaActiva === "servicios" && (
          <div className="container-fluid py-2">
            <h3 className="fw-bold text-success mb-4"><i className="bi bi-box-seam me-2"></i>Gestión de Servicios</h3>
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="card shadow-sm border-0 bg-white">
                  <div className="card-body">
                    <h5 className="fw-bold text-success mb-3">{editandoServicio ? `Editando ${editandoServicio}` : "Nuevo Servicio"}</h5>
                    <form noValidate onSubmit={manejarSubmitServicio}>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label fw-semibold small">Código</label>
                          <input className="form-control form-control-sm" maxLength={20} disabled={!!editandoServicio} value={formServicio.codigo} onChange={(e) => setFormServicio({ ...formServicio, codigo: e.target.value })} />
                          {erroresServicio.codigo && <div className="text-danger small mt-1">{erroresServicio.codigo}</div>}
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label fw-semibold small">Precio (CLP)</label>
                          <input type="number" className="form-control form-control-sm" min="0" value={formServicio.precio} onChange={(e) => setFormServicio({ ...formServicio, precio: e.target.value })} />
                          {erroresServicio.precio && <div className="text-danger small mt-1">{erroresServicio.precio}</div>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold small">Nombre del Servicio</label>
                        <input className="form-control form-control-sm" maxLength={100} value={formServicio.nombre} onChange={(e) => setFormServicio({ ...formServicio, nombre: e.target.value })} />
                        {erroresServicio.nombre && <div className="text-danger small mt-1">{erroresServicio.nombre}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold small">Categoría</label>
                        <select className="form-select form-select-sm" value={formServicio.categoria} onChange={(e) => setFormServicio({ ...formServicio, categoria: e.target.value })}>
                          <option value="">Selecciona categoría</option>
                          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                        {erroresServicio.categoria && <div className="text-danger small mt-1">{erroresServicio.categoria}</div>}
                      </div>
                      <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-sm btn-success fw-bold flex-grow-1">
                          {editandoServicio ? "Guardar Cambios" : "Guardar Servicio"}
                        </button>
                        {editandoServicio && (
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicionServicio}>Cancelar</button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card shadow-sm border-0 bg-white p-3">
                  <h5 className="fw-bold mb-3">Catálogo Registrado</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle small mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Código</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicios.map((s) => (
                          <tr key={s.codigo}>
                            <td className="text-muted fw-bold">{s.codigo}</td>
                            <td>{s.nombre}</td>
                            <td className="text-success fw-bold">{formatoCLP(s.precio)}</td>
                            <td>{categorias.find((c) => c.id === s.categoria)?.nombre || s.categoria}</td>
                            <td className="text-center text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => cargarServicioParaEditar(s)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => manejarEliminarServicio(s.codigo)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTAS EN CONSTRUCCIÓN */}
        {["ordenes", "reportes", "perfil"].includes(vistaActiva) && (
          <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center text-muted">
            <i className="bi bi-tools fs-1 mb-3"></i>
            <h3 className="fw-bold">Módulo en construcción</h3>
            <p>La sección de {vistaActiva} será desarrollada próximamente.</p>
          </div>
        )}

      </div>
    </div>
  );
}