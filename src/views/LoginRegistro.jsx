// ==========================================================================
// LoginRegistro.jsx
// --------------------------------------------------------------------------
// Acá viven los DOS modales (Iniciar sesión / Crear cuenta). En la versión
// HTML eran secciones con d-none que se mostraban con JS; ahora son
// <div className="modal"> de Bootstrap, controlados por los botones del
// Navbar (data-bs-toggle="modal" data-bs-target="#modalLogin").
//
// La validación se maneja con useState por campo: cada input tiene su
// propio "estado de error", igual que antes cada <div id="error-..."> se
// llenaba a mano con errorX.textContent = "...".
// ==========================================================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validarDominioCorreo, validarRutChileno, comunasPorRegion } from "../utils/validaciones";

// ----------------------------- MODAL LOGIN --------------------------------
export function ModalLogin() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});

  function manejarSubmit(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!validarDominioCorreo(correo.trim())) {
      nuevosErrores.correo = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }

    if (!clave) {
      nuevosErrores.clave = "La contraseña es obligatoria.";
    } else if (clave.length < 4 || clave.length > 10) {
      nuevosErrores.clave = "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      iniciarSesion(correo.trim());
      alert("Inicio de sesión exitoso. ¡Bienvenido a NutriVida!");
      setCorreo("");
      setClave("");
      document.getElementById("btn-cerrar-modal-login")?.click();
    }
  }

  return (
    <div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-success" id="modalLoginLabel">Iniciar Sesión</h5>
            <button id="btn-cerrar-modal-login" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form noValidate onSubmit={manejarSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="usuario@duoc.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errores.correo && <div className="text-danger small mt-1">{errores.correo}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="4 a 10 caracteres"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                {errores.clave && <div className="text-danger small mt-1">{errores.clave}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------- MODAL REGISTRO -------------------------------
const valorInicial = {
  rut: "", nombre: "", apellidos: "", correo: "", rol: "", region: "", comuna: "", direccion: "",
};

export function ModalRegistro() {
  const { registrar } = useAuth();
  const [form, setForm] = useState(valorInicial);
  const [errores, setErrores] = useState({});

  function actualizarCampo(campo, valor) {
    setForm((actual) => {
      // Si cambia la región, reseteamos la comuna (igual que el listener
      // de "change" sobre reg-region en app.js)
      if (campo === "region") return { ...actual, region: valor, comuna: "" };
      return { ...actual, [campo]: valor };
    });
  }

  function manejarSubmit(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!form.rut.trim()) nuevosErrores.rut = "El RUT es obligatorio.";
    else if (!validarRutChileno(form.rut.trim()))
      nuevosErrores.rut = "RUT inválido. Debe tener entre 7 y 9 dígitos sin puntos ni guion (ej: 19011022K).";

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";

    if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
    else if (!validarDominioCorreo(form.correo.trim()))
      nuevosErrores.correo = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";

    if (!form.rol) nuevosErrores.rol = "Debes seleccionar un tipo de usuario.";
    if (!form.region) nuevosErrores.region = "Selecciona una región.";
    if (!form.comuna) nuevosErrores.comuna = "Selecciona una comuna.";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria.";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      registrar({ ...form, correo: form.correo.trim() });
      alert("¡Usuario registrado exitosamente en NutriVida!");
      setForm(valorInicial);
      document.getElementById("btn-cerrar-modal-registro")?.click();
    }
  }

  const comunasDisponibles = form.region ? comunasPorRegion[form.region] : [];

  return (
    <div className="modal fade" id="modalRegistro" tabIndex="-1" aria-labelledby="modalRegistroLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-success" id="modalRegistroLabel">Registro de Usuarios</h5>
            <button id="btn-cerrar-modal-registro" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form noValidate onSubmit={manejarSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">RUT / RUN (sin puntos ni guion, ej: 19011022K)</label>
                <input className="form-control" maxLength={9} value={form.rut} onChange={(e) => actualizarCampo("rut", e.target.value)} />
                {errores.rut && <div className="text-danger small mt-1">{errores.rut}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input className="form-control" value={form.nombre} onChange={(e) => actualizarCampo("nombre", e.target.value)} />
                  {errores.nombre && <div className="text-danger small mt-1">{errores.nombre}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Apellidos</label>
                  <input className="form-control" value={form.apellidos} onChange={(e) => actualizarCampo("apellidos", e.target.value)} />
                  {errores.apellidos && <div className="text-danger small mt-1">{errores.apellidos}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input type="email" className="form-control" placeholder="ejemplo@duoc.cl" value={form.correo} onChange={(e) => actualizarCampo("correo", e.target.value)} />
                  {errores.correo && <div className="text-danger small mt-1">{errores.correo}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Tipo de Usuario</label>
                  <select className="form-select" value={form.rol} onChange={(e) => actualizarCampo("rol", e.target.value)}>
                    <option value="">Selecciona un perfil...</option>
                    <option value="administrador">Administrador</option>
                    <option value="vendedor">Nutricionista / Vendedor</option>
                    <option value="cliente">Paciente / Cliente</option>
                  </select>
                  {errores.rol && <div className="text-danger small mt-1">{errores.rol}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Región</label>
                  <select className="form-select" value={form.region} onChange={(e) => actualizarCampo("region", e.target.value)}>
                    <option value="">Selecciona una región</option>
                    <option value="araucania">Región de La Araucanía</option>
                    <option value="metropolitana">Región Metropolitana</option>
                    <option value="biobio">Región del Biobío</option>
                  </select>
                  {errores.region && <div className="text-danger small mt-1">{errores.region}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Comuna</label>
                  <select className="form-select" value={form.comuna} disabled={!form.region} onChange={(e) => actualizarCampo("comuna", e.target.value)}>
                    <option value="">{form.region ? "Selecciona una comuna" : "Primero selecciona una región"}</option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna.toLowerCase()}>{comuna}</option>
                    ))}
                  </select>
                  {errores.comuna && <div className="text-danger small mt-1">{errores.comuna}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Dirección</label>
                <input className="form-control" placeholder="Calle, número, depto" value={form.direccion} onChange={(e) => actualizarCampo("direccion", e.target.value)} />
                {errores.direccion && <div className="text-danger small mt-1">{errores.direccion}</div>}
              </div>

              <button type="submit" className="btn btn-success px-4">Registrar Usuario</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
