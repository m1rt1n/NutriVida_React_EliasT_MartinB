import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
// Se quitó validarDominioCorreo de las importaciones
import { comunasPorRegion, formatoCLP } from "../utils/validaciones";

// Lista de dominios permitidos
const dominiosPermitidos = ["@duocuc.cl", "@profesor.duocuc.cl", "@gmail.com"];

const validarEmailPermitido = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) return false;
  return dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
};

function Checkout() {
  const { carrito, total, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    region: "",
    comuna: "",
    direccion: "",
  });
  const [errores, setErrores] = useState({});

  function actualizarCampo(campo, valor) {
    setForm((actual) => (campo === "region" ? { ...actual, region: valor, comuna: "" } : { ...actual, [campo]: valor }));
  }

  function manejarSubmit(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!validarEmailPermitido(form.correo.trim())) {
      nuevosErrores.correo = "Solo se permiten dominios @duocuc.cl, @profesor.duocuc.cl o @gmail.com";
    }
    
    if (!form.region) nuevosErrores.region = "Selecciona una región.";
    if (!form.comuna) nuevosErrores.comuna = "Selecciona una comuna.";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const codigoOrden = "ORDER" + Math.floor(10000 + Math.random() * 90000);
    const resumen = { ...form, items: carrito, total, codigoOrden };

    const pagoExitoso = Math.random() > 0.15;

    if (pagoExitoso) {
      vaciarCarrito();
      navigate("/compra-exitosa", { state: resumen });
    } else {
      navigate("/pago-error", { state: resumen });
    }
  }

  const comunasDisponibles = form.region ? comunasPorRegion[form.region] : [];

  if (carrito.length === 0) {
    return (
      <div className="container my-5 text-center py-5">
        <i className="bi bi-cart-x display-1 text-muted opacity-25 mb-4 d-block"></i>
        <h3 className="fw-bold text-dark">Tu carrito está vacío</h3>
        <p className="text-secondary mb-4">Agrega algún plan nutricional para poder agendar tu hora.</p>
        <button className="btn btn-success rounded-pill px-5 fw-bold shadow-sm" onClick={() => navigate('/catalogo')}>
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: '950px' }}>
      <div className="text-center mb-5">
        <h2 className="fw-bolder" style={{ color: '#1a365d' }}>Finalizar Reserva</h2>
        <p className="text-muted">Completa tus datos para confirmar tu atención clínica.</p>
      </div>

      <div className="row g-5">
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4 text-success border-bottom pb-2">
              <i className="bi bi-person-lines-fill me-2"></i>Información del Paciente
            </h5>
            <form noValidate onSubmit={manejarSubmit}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">Nombre *</label>
                  <input className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={(e) => actualizarCampo("nombre", e.target.value)} />
                  {errores.nombre && <div className="invalid-feedback fw-semibold">{errores.nombre}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">Apellidos *</label>
                  <input className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`} value={form.apellidos} onChange={(e) => actualizarCampo("apellidos", e.target.value)} />
                  {errores.apellidos && <div className="invalid-feedback fw-semibold">{errores.apellidos}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Correo Electrónico *</label>
                  <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`} placeholder="usuario@duocuc.cl" value={form.correo} onChange={(e) => actualizarCampo("correo", e.target.value)} />
                  {errores.correo && <div className="invalid-feedback fw-semibold">{errores.correo}</div>}
                </div>

                <h5 className="fw-bold mb-3 mt-5 text-success border-bottom pb-2">
                  <i className="bi bi-geo-alt-fill me-2"></i>Dirección para Teleconsulta / Ficha
                </h5>
                
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">Región *</label>
                  <select className={`form-select ${errores.region ? 'is-invalid' : ''}`} value={form.region} onChange={(e) => actualizarCampo("region", e.target.value)}>
                    <option value="">Selecciona una región</option>
                    <option value="araucania">Región de La Araucanía</option>
                    <option value="metropolitana">Región Metropolitana</option>
                    <option value="biobio">Región del Biobío</option>
                  </select>
                  {errores.region && <div className="invalid-feedback fw-semibold">{errores.region}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small">Comuna *</label>
                  <select className={`form-select ${errores.comuna ? 'is-invalid' : ''}`} value={form.comuna} disabled={!form.region} onChange={(e) => actualizarCampo("comuna", e.target.value)}>
                    <option value="">{form.region ? "Selecciona una comuna" : "Primero elige región"}</option>
                    {comunasDisponibles.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                  </select>
                  {errores.comuna && <div className="invalid-feedback fw-semibold">{errores.comuna}</div>}
                </div>
                <div className="col-12 mb-4">
                  <label className="form-label fw-semibold text-secondary small">Dirección Exacta *</label>
                  <input className={`form-control ${errores.direccion ? 'is-invalid' : ''}`} placeholder="Ej: Av. Los Carrera 123, Depto 4B" value={form.direccion} onChange={(e) => actualizarCampo("direccion", e.target.value)} />
                  {errores.direccion && <div className="invalid-feedback fw-semibold">{errores.direccion}</div>}
                </div>
              </div>
              
              <button type="submit" className="btn btn-success btn-lg w-100 fw-bold rounded-pill shadow-sm">
                Confirmar y Pagar {formatoCLP(total)}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen Estilo Recibo */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 position-sticky" style={{ top: '100px', backgroundColor: '#f9fafb' }}>
            <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">
              <i className="bi bi-receipt me-2 text-success"></i>Resumen de la Orden
            </h5>
            <ul className="list-group list-group-flush mb-3 bg-transparent">
              {carrito.map((item, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between lh-sm bg-transparent px-0 py-3 border-bottom border-light">
                  <div>
                    <h6 className="my-0 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>{item.nombre}</h6>
                    <small className="text-muted">Servicio Clínica NutriVida</small>
                  </div>
                  <span className="text-success fw-semibold">{formatoCLP(item.precio)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <span className="fw-bold text-uppercase small text-muted">Total a Pagar</span>
              <strong className="fs-3 text-dark">{formatoCLP(total)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
