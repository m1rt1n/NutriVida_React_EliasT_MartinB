import { useState } from "react";
import { validarDominioCorreo } from "../utils/validaciones";

const vacio = { nombre: "", correo: "", mensaje: "" };

function Contacto() {
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function manejarSubmit(e) {
    e.preventDefault();
    const nuevosErrores = {};

    const nombre = form.nombre.trim();
    if (!nombre) nuevosErrores.nombre = "El nombre es obligatorio.";
    else if (nombre.length > 100) nuevosErrores.nombre = "El nombre no puede superar los 100 caracteres.";

    const correo = form.correo.trim();
    if (!correo) nuevosErrores.correo = "El correo es obligatorio.";
    else if (!validarDominioCorreo(correo)) nuevosErrores.correo = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";

    const mensaje = form.mensaje.trim();
    if (!mensaje) nuevosErrores.mensaje = "El mensaje o consulta es obligatorio.";
    else if (mensaje.length > 500) nuevosErrores.mensaje = "El mensaje no puede superar los 500 caracteres.";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setForm(vacio);
      setTimeout(() => setEnviado(false), 4000);
    }
  }

  return (
    <div className="container my-5">
      <header className="border-bottom pb-2 mb-4">
        <h3 className="fw-bold text-success m-0">Contáctanos</h3>
        <p className="text-muted m-0">Envía tus consultas al equipo de NutriVida.</p>
      </header>

      <form noValidate onSubmit={manejarSubmit} style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre Completo</label>
          <input
            className="form-control"
            maxLength={100}
            placeholder="Ej: Juan Pérez"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          {errores.nombre && <div className="text-danger small mt-1">{errores.nombre}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            maxLength={100}
            placeholder="ejemplo@duoc.cl"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />
          {errores.correo && <div className="text-danger small mt-1">{errores.correo}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mensaje o Consulta</label>
          <textarea
            className="form-control"
            rows={4}
            maxLength={500}
            placeholder="Escribe tu consulta aquí..."
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          />
          <div className="d-flex justify-content-between">
            <div className="text-danger small mt-1">{errores.mensaje}</div>
            <small className="text-muted mt-1">{form.mensaje.length} / 500</small>
          </div>
        </div>

        <button type="submit" className="btn btn-success px-4">Enviar Mensaje</button>

        {enviado && (
          <div className="alert alert-success mt-3">
            ¡Mensaje enviado correctamente! Nos pondremos en contacto a la brevedad.
          </div>
        )}
      </form>
    </div>
  );
}

export default Contacto;
