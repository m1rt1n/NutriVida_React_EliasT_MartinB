// ==========================================================================
// LoginRegistro.jsx
// ==========================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validarRutChileno, comunasPorRegion } from "../utils/validaciones";

// --- Validaciones en tiempo real ---
const dominiosPermitidos = ["@duocuc.cl", "@profesor.duocuc.cl", "@gmail.com"];

const validarEmailPermitido = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) return false;
  return dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
};

const validarPasswordFuerte = (password) => {
  const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regexPassword.test(password);
};

const validarSoloLetras = (texto) => {
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regexLetras.test(texto);
};

const getInputClass = (value, validatorFn) => {
  if (!value || value.trim().length === 0) return 'form-control';
  return validatorFn(value) ? 'form-control is-valid' : 'form-control is-invalid';
};

// ----------------------------- MODAL LOGIN --------------------------------
export function ModalLogin() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [rolLogin, setRolLogin] = useState("");
  const [vistaTrabajador, setVistaTrabajador] = useState(false);
  const [errorSesion, setErrorSesion] = useState(null);
  const [mostrarClave, setMostrarClave] = useState(false);

  function limpiarFormulario() {
    setCorreo("");
    setClave("");
    setRolLogin("");
    setErrorSesion(null);
    setMostrarClave(false);
  }

  function cambiarVista() {
    limpiarFormulario();
    setVistaTrabajador(!vistaTrabajador);
  }

  function manejarSubmit(e) {
    e.preventDefault();
    setErrorSesion(null);
    const rolFinal = vistaTrabajador ? rolLogin : "cliente";

    if (validarEmailPermitido(correo) && validarPasswordFuerte(clave) && rolFinal !== "") {
      const resultado = iniciarSesion(correo.trim(), clave, rolFinal);

      if (resultado.exito) {
        alert(`Inicio de sesión exitoso. ¡Bienvenido a NutriVida!`);
        limpiarFormulario();
        setVistaTrabajador(false);
        
        document.getElementById("btn-cerrar-modal-login")?.click();

        if (resultado.rol === "administrador") {
          setTimeout(() => navigate('/admin'), 300);
        }
      } else {
        setErrorSesion(resultado.mensaje);
      }
    }
  }

  return (
    <div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-success" id="modalLoginLabel">
              {vistaTrabajador ? "Acceso de Personal" : "Iniciar Sesión"}
            </h5>
            <button id="btn-cerrar-modal-login" type="button" className="btn-close" onClick={limpiarFormulario} data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4">
            
            {errorSesion && (
              <div className="alert alert-danger py-2 small fw-bold" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorSesion}
              </div>
            )}

            <form noValidate onSubmit={manejarSubmit}>
              
              {vistaTrabajador && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Cargo / Perfil</label>
                  <select 
                    className={`form-select ${rolLogin === "" ? "" : "is-valid"}`} 
                    value={rolLogin} 
                    onChange={(e) => setRolLogin(e.target.value)}
                  >
                    <option value="">Selecciona tu perfil...</option>
                    <option value="vendedor">Nutricionista</option>
                    <option value="administrador">Administrador / Gerente</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico</label>
                <input
                  type="email"
                  className={getInputClass(correo, validarEmailPermitido)}
                  placeholder="ejemplo@duocuc.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {correo.length > 0 && !validarEmailPermitido(correo) && (
                  <div className="invalid-feedback d-block">
                    Solo permitimos dominios @duocuc.cl, @profesor.duocuc.cl o @gmail.com
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>
                <div className="input-group has-validation">
                  <input
                    type={mostrarClave ? "text" : "password"}
                    className={getInputClass(clave, validarPasswordFuerte)}
                    placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => setMostrarClave(!mostrarClave)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${mostrarClave ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                  </button>
                  {clave.length > 0 && !validarPasswordFuerte(clave) && (
                    <div className="invalid-feedback">Debe tener mínimo 8 caracteres, una mayúscula y un número.</div>
                  )}
                </div>
              </div>
              
              <button 
                type="submit" 
                className={`btn w-100 fw-bold py-2 ${vistaTrabajador ? 'btn-dark' : 'btn-success'}`}
                disabled={!validarEmailPermitido(correo) || !validarPasswordFuerte(clave) || (vistaTrabajador && rolLogin === "")}
              >
                Ingresar {vistaTrabajador && "al Sistema"}
              </button>
            </form>

            <hr className="my-4" />
            
            <div className="text-center">
              {vistaTrabajador ? (
                <button type="button" className="btn btn-link text-success text-decoration-none small" onClick={cambiarVista}>
                  ← Soy un paciente, volver al inicio normal
                </button>
              ) : (
                <button type="button" className="btn btn-link text-muted text-decoration-none small" onClick={cambiarVista}>
                  ¿Eres trabajador (administrador, nutricionista)? Inicia sesión acá
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------- MODAL REGISTRO -------------------------------
const valorInicial = {
  rut: "", nombre: "", apellidos: "", correo: "", rol: "cliente", region: "", comuna: "", direccion: "", clave: ""
};

export function ModalRegistro() {
  const { registrar } = useAuth();
  const [form, setForm] = useState(valorInicial);
  const [mostrarClave, setMostrarClave] = useState(false);

  function actualizarCampo(campo, valor) {
    setForm((actual) => {
      if (campo === "region") return { ...actual, region: valor, comuna: "" };
      return { ...actual, [campo]: valor };
    });
  }

  const esFormularioValido = () => {
    return (
      validarRutChileno(form.rut) &&
      validarSoloLetras(form.nombre) &&
      validarSoloLetras(form.apellidos) &&
      validarEmailPermitido(form.correo) &&
      validarPasswordFuerte(form.clave) &&
      form.region !== "" &&
      form.comuna !== "" &&
      form.direccion.trim() !== ""
    );
  };

  function manejarSubmit(e) {
    e.preventDefault();
    if (esFormularioValido()) {
      registrar({ ...form, correo: form.correo.trim() });
      alert("¡Paciente registrado exitosamente en NutriVida!");
      setForm(valorInicial);
      setMostrarClave(false);
      document.getElementById("btn-cerrar-modal-registro")?.click();
    }
  }

  const comunasDisponibles = form.region && comunasPorRegion ? (comunasPorRegion[form.region] || []) : [];

  return (
    <div className="modal fade" id="modalRegistro" tabIndex="-1" aria-labelledby="modalRegistroLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-success" id="modalRegistroLabel">Registro de Paciente</h5>
            <button id="btn-cerrar-modal-registro" type="button" className="btn-close" onClick={() => { setForm(valorInicial); setMostrarClave(false); }} data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4">
            <form noValidate onSubmit={manejarSubmit}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">RUT / RUN (sin puntos ni guion)</label>
                <input 
                  maxLength="9" /* <-- Ajustado a 9 caracteres máximo */
                  className={getInputClass(form.rut, validarRutChileno)} 
                  placeholder="ej: 19011022K" 
                  value={form.rut} 
                  onChange={(e) => {
                    // Filtra todo lo que no sea número o la letra k/K, impidiendo escribir guiones
                    const valorLimpio = e.target.value.replace(/[^0-9kK]/g, '');
                    actualizarCampo("rut", valorLimpio.toUpperCase());
                  }} 
                />
                {form.rut.length > 0 && !validarRutChileno(form.rut) && (
                  <div className="invalid-feedback d-block">RUT inválido. Verifica el formato sin puntos ni guion.</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input 
                    className={getInputClass(form.nombre, validarSoloLetras)} 
                    value={form.nombre} 
                    onChange={(e) => actualizarCampo("nombre", e.target.value)} 
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Apellidos</label>
                  <input 
                    className={getInputClass(form.apellidos, validarSoloLetras)} 
                    value={form.apellidos} 
                    onChange={(e) => actualizarCampo("apellidos", e.target.value)} 
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className={getInputClass(form.correo, validarEmailPermitido)} 
                    placeholder="ejemplo@duocuc.cl" 
                    value={form.correo} 
                    onChange={(e) => actualizarCampo("correo", e.target.value)} 
                  />
                  {form.correo.length > 0 && !validarEmailPermitido(form.correo) && (
                    <div className="invalid-feedback d-block">
                      Solo permitimos dominios @duocuc.cl, @profesor.duocuc.cl o @gmail.com
                    </div>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group has-validation">
                    <input 
                      type={mostrarClave ? "text" : "password"}
                      className={getInputClass(form.clave, validarPasswordFuerte)} 
                      placeholder="Mayúscula y números requeridos" 
                      value={form.clave} 
                      onChange={(e) => actualizarCampo("clave", e.target.value)} 
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button" 
                      onClick={() => setMostrarClave(!mostrarClave)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${mostrarClave ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                    </button>
                    {form.clave.length > 0 && !validarPasswordFuerte(form.clave) && (
                      <div className="invalid-feedback">Mínimo 8 caracteres, 1 mayúscula y 1 número.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Región</label>
                  <select 
                    className={`form-select ${form.region === "" ? "" : "is-valid"}`} 
                    value={form.region} 
                    onChange={(e) => actualizarCampo("region", e.target.value)}
                  >
                    <option value="">Selecciona una región</option>
                    <option value="valparaiso">Región de Valparaíso</option>
                    <option value="metropolitana">Región Metropolitana</option>
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Comuna</label>
                  <select 
                    className={`form-select ${form.comuna === "" ? "" : "is-valid"}`} 
                    disabled={!form.region} 
                    value={form.comuna} 
                    onChange={(e) => actualizarCampo("comuna", e.target.value)}
                  >
                    <option value="">{form.region ? "Selecciona una comuna" : "Primero selecciona una región"}</option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna.toLowerCase()}>{comuna}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Dirección</label>
                <input 
                  className="form-control" 
                  placeholder="Calle, número, depto (ej: Álvarez 2366)" 
                  value={form.direccion} 
                  onChange={(e) => actualizarCampo("direccion", e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 fw-bold py-2"
                disabled={!esFormularioValido()}
              >
                Registrar Paciente
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}