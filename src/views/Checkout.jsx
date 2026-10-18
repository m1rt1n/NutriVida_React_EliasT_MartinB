// ==========================================================================
// Checkout.jsx
// --------------------------------------------------------------------------
// Corresponde a las Figuras 5 y 6 del Anexo 1: resumen del carrito + datos
// del cliente + dirección de entrega (región/comuna dinámicos, igual que en
// el registro). Al confirmar, navega a /compra-exitosa o /pago-error según
// el resultado simulado (Figuras 7 y 8).
// ==========================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { validarDominioCorreo, comunasPorRegion, formatoCLP } from "../utils/validaciones";

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
    if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
    else if (!validarDominioCorreo(form.correo.trim())) nuevosErrores.correo = "Correo con dominio no permitido.";
    if (!form.region) nuevosErrores.region = "Selecciona una región.";
    if (!form.comuna) nuevosErrores.comuna = "Selecciona una comuna.";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const codigoOrden = "ORDER" + Math.floor(10000 + Math.random() * 90000);
    const resumen = { ...form, items: carrito, total, codigoOrden };

    // Simulación de pasarela de pago: 85% de probabilidad de éxito
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
      <div className="container my-5 text-center">
        <p className="text-muted">Tu carrito está vacío. Agrega algún servicio antes de pagar.</p>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: 700 }}>
      <header className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
        <h3 className="fw-bold text-success m-0">Carrito de compra</h3>
        <span className="fw-bold text-success">Total a pagar: {formatoCLP(total)}</span>
      </header>

      <table className="table table-sm mb-4">
        <thead>
          <tr><th>Servicio</th><th>Precio</th></tr>
        </thead>
        <tbody>
          {carrito.map((item, i) => (
            <tr key={i}><td>{item.nombre}</td><td>{formatoCLP(item.precio)}</td></tr>
          ))}
        </tbody>
      </table>

      <h5 className="fw-bold mb-3">Información del cliente</h5>
      <form noValidate onSubmit={manejarSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Nombre*</label>
            <input className="form-control" value={form.nombre} onChange={(e) => actualizarCampo("nombre", e.target.value)} />
            {errores.nombre && <div className="text-danger small mt-1">{errores.nombre}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Apellidos*</label>
            <input className="form-control" value={form.apellidos} onChange={(e) => actualizarCampo("apellidos", e.target.value)} />
            {errores.apellidos && <div className="text-danger small mt-1">{errores.apellidos}</div>}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Correo*</label>
          <input type="email" className="form-control" value={form.correo} onChange={(e) => actualizarCampo("correo", e.target.value)} />
          {errores.correo && <div className="text-danger small mt-1">{errores.correo}</div>}
        </div>

        <h5 className="fw-bold mb-3 mt-4">Dirección de entrega</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Región*</label>
            <select className="form-select" value={form.region} onChange={(e) => actualizarCampo("region", e.target.value)}>
              <option value="">Selecciona una región</option>
              <option value="araucania">Región de La Araucanía</option>
              <option value="metropolitana">Región Metropolitana</option>
              <option value="biobio">Región del Biobío</option>
            </select>
            {errores.region && <div className="text-danger small mt-1">{errores.region}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Comuna*</label>
            <select className="form-select" value={form.comuna} disabled={!form.region} onChange={(e) => actualizarCampo("comuna", e.target.value)}>
              <option value="">{form.region ? "Selecciona una comuna" : "Primero selecciona una región"}</option>
              {comunasDisponibles.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
            {errores.comuna && <div className="text-danger small mt-1">{errores.comuna}</div>}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold">Dirección*</label>
          <input className="form-control" placeholder="Calle, número, depto" value={form.direccion} onChange={(e) => actualizarCampo("direccion", e.target.value)} />
          {errores.direccion && <div className="text-danger small mt-1">{errores.direccion}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold">Pagar ahora {formatoCLP(total)}</button>
      </form>
    </div>
  );
}

export default Checkout;
