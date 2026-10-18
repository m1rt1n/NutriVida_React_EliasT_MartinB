// ==========================================================================
// AdminDashboard.jsx
// --------------------------------------------------------------------------
// Reemplaza la sección #seccion-admin del HTML. La diferencia grande: antes
// "Guardar Servicio" solo mostraba un alert() y la tabla de al lado era
// estática (2 filas fijas). Ahora el formulario llama de verdad a las
// funciones CRUD de db.js, así que crear/editar/eliminar un servicio
// cambia el catálogo real que ve el resto del sitio.
// ==========================================================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  categorias,
} from "../data/db";
import { formatoCLP } from "../utils/validaciones";

const vacio = {
  codigo: "", nombre: "", precio: "", stock: "", stockCritico: "", categoria: "", descripcion: "", duracion: "", modalidad: "",
};

function AdminDashboard() {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState(() => obtenerServicios());
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(null); // código del servicio en edición, o null = creando
  const [errores, setErrores] = useState({});

  // Si no hay sesión de administrador, no se muestra el panel.
  if (!usuario || usuario.rol !== "administrador") {
    return (
      <div className="container my-5 text-center">
        <p className="text-muted">
          Esta sección es solo para administradores. Inicia sesión con una cuenta registrada
          con el rol <strong>Administrador</strong> para acceder.
        </p>
      </div>
    );
  }

  function refrescar() {
    setServicios(obtenerServicios());
  }

  function cargarParaEditar(servicio) {
    setEditando(servicio.codigo);
    setForm({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      precio: servicio.precio,
      stock: servicio.stock ?? "",
      stockCritico: servicio.stockCritico ?? "",
      categoria: servicio.categoria,
      descripcion: servicio.descripcion,
      duracion: servicio.duracion,
      modalidad: servicio.modalidad,
    });
  }

  function cancelarEdicion() {
    setEditando(null);
    setForm(vacio);
    setErrores({});
  }

  function manejarEliminar(codigo) {
    if (confirm(`¿Eliminar el servicio ${codigo}? Esta acción no se puede deshacer.`)) {
      eliminarServicio(codigo);
      refrescar();
    }
  }

  function manejarSubmit(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!form.codigo.trim() || form.codigo.trim().length < 3) nuevosErrores.codigo = "El código debe tener al menos 3 caracteres.";
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";

    const precio = parseInt(form.precio, 10);
    if (isNaN(precio) || precio < 0) nuevosErrores.precio = "Ingresa un precio válido (0 o superior).";

    const stock = form.stock === "" ? null : parseInt(form.stock, 10);
    if (stock !== null && stock < 0) nuevosErrores.stock = "El stock no puede ser negativo.";

    const stockCritico = form.stockCritico === "" ? null : parseInt(form.stockCritico, 10);
    if (stockCritico !== null && stockCritico < 0) nuevosErrores.stockCritico = "No puede ser negativo.";

    if (!form.categoria) nuevosErrores.categoria = "Selecciona una categoría.";

    // Código duplicado: solo valida al CREAR, no al editar el mismo registro
    const yaExiste = servicios.some((s) => s.codigo === form.codigo.trim() && s.codigo !== editando);
    if (yaExiste) nuevosErrores.codigo = "Ya existe un servicio con ese código.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const datos = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      precio,
      stock,
      stockCritico,
      categoria: form.categoria,
      descripcion: form.descripcion.trim(),
      duracion: form.duracion.trim() || "—",
      modalidad: form.modalidad.trim() || "Presencial",
    };

    if (editando) {
      actualizarServicio(editando, datos);
    } else {
      crearServicio(datos);
    }

    if (stockCritico !== null && stock !== null && stock <= stockCritico) {
      alert("⚠️ ALERTA: El stock ingresado es igual o inferior al stock crítico definido.");
    }

    refrescar();
    cancelarEdicion();
  }

  return (
    <div className="container my-5">
      <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3 className="fw-bold text-success m-0">Panel de Administración — Servicios</h3>
        <span className="badge bg-success">{servicios.length} servicios activos</span>
      </header>

      <div className="row">
        {/* Formulario CRUD */}
        <div className="col-lg-5 mb-4">
          <h5 className="fw-bold">{editando ? `Editando ${editando}` : "Nuevo Servicio"}</h5>
          <form noValidate onSubmit={manejarSubmit}>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label fw-semibold">Código</label>
                <input className="form-control" maxLength={20} disabled={!!editando} value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
                {errores.codigo && <div className="text-danger small mt-1">{errores.codigo}</div>}
              </div>
              <div className="col-6 mb-3">
                <label className="form-label fw-semibold">Precio (CLP)</label>
                <input type="number" className="form-control" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                {errores.precio && <div className="text-danger small mt-1">{errores.precio}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre del Servicio</label>
              <input className="form-control" maxLength={100} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              {errores.nombre && <div className="text-danger small mt-1">{errores.nombre}</div>}
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label fw-semibold">Stock Total</label>
                <input type="number" className="form-control" min="0" placeholder="Vacío = ilimitado" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                {errores.stock && <div className="text-danger small mt-1">{errores.stock}</div>}
              </div>
              <div className="col-6 mb-3">
                <label className="form-label fw-semibold">Stock Crítico</label>
                <input type="number" className="form-control" min="0" placeholder="Opcional" value={form.stockCritico} onChange={(e) => setForm({ ...form, stockCritico: e.target.value })} />
                {errores.stockCritico && <div className="text-danger small mt-1">{errores.stockCritico}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Categoría</label>
              <select className="form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                <option value="">Selecciona categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errores.categoria && <div className="text-danger small mt-1">{errores.categoria}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción (Opcional)</label>
              <textarea className="form-control" rows="2" maxLength={500} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-warning fw-bold flex-grow-1">
                {editando ? "Guardar Cambios" : "Guardar Servicio"}
              </button>
              {editando && (
                <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla con los datos reales del catálogo */}
        <div className="col-lg-7">
          <h5 className="fw-bold">Catálogo Registrado</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle small">
              <thead className="table-light">
                <tr>
                  <th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th></th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.codigo}>
                    <td>{s.codigo}</td>
                    <td>{s.nombre}</td>
                    <td>{formatoCLP(s.precio)}</td>
                    <td>{s.stock === null ? "Ilimitado" : s.stock}</td>
                    <td>{categorias.find((c) => c.id === s.categoria)?.nombre || s.categoria}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => cargarParaEditar(s)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => manejarEliminar(s.codigo)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
